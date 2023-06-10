import toNumber from "lodash/toNumber";

import { Rental, RentalId } from "../models/rental";
import { Scooter, ScooterId } from "../models/scooter";
import { UserId } from "../models/user";

import { RentalRepo } from "../interfaces/rental-repo";
import { UserRepo } from "../interfaces/user-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { BillingGateway } from "../interfaces/billing-gateway";
import { BookingRepo } from "../interfaces/booking-repo";
import { IRentalService } from "../interfaces/rental-service";
import { IScooterService } from "../interfaces/scooter-service";
import { IParkingService } from "../interfaces/parking-service";
import { Logger } from "../interfaces/logger";
import { IPingService } from "../interfaces/ping-service";
import { ITariffService } from "../interfaces/tariff-service";

import { LimitError } from "../errors/limit-error";
import { InvalidStateError } from "../errors/invalid-state-error";
import { PermissionError } from "../errors/permission-error";

import { CreateRentalServiceDto } from "../dto/create-rental-service";

import { Bounds } from "../types/bounds";

class RentalService implements IRentalService {
  private _rentalRepo: RentalRepo;
  private _userRepo: UserRepo;
  private _scooterService: IScooterService;
  private _settingRepo: SettingRepo;
  private _tariffService: ITariffService;
  private _bookingRepo: BookingRepo;
  private _billingGateway: BillingGateway;
  private _parkingService: IParkingService;
  private _pingService: IPingService;
  private _logger?: Logger;

  public constructor(createRentalServiceDto: CreateRentalServiceDto) {
    this._rentalRepo = createRentalServiceDto.rentalRepo;
    this._userRepo = createRentalServiceDto.userRepo;
    this._scooterService = createRentalServiceDto.scooterService;
    this._settingRepo = createRentalServiceDto.settingRepo;
    this._billingGateway = createRentalServiceDto.billingGateway;
    this._bookingRepo = createRentalServiceDto.bookingRepo;
    this._parkingService = createRentalServiceDto.parkingService;
    this._pingService = createRentalServiceDto.pingService;
    this._tariffService = createRentalServiceDto.tariffService;
    this._logger = createRentalServiceDto.logger;
  }

  /**
   * Логирует действия сервиса.
   * @private
   *
   * @param message - Сообщение
   */
  private log(message: string) {
    this._logger?.log(message, this.constructor.name, "verbose");
  }

  /**
   * Проверяет, можно ли арендовать указанный самокат.
   * @private
   *
   * @param scooterId - Уникальный идентификатор самоката
   */
  private async ensureScooterIsRentable(scooterId: ScooterId) {
    const scooter = await this._scooterService.getById(scooterId);
    if (!scooter.isEnabled) {
      throw new InvalidStateError("Самокат недоступен");
    }

    const bookings = await this._bookingRepo.getActiveByScooter(scooterId);
    if (bookings.length !== 0) {
      throw new InvalidStateError("Самокат забронирован");
    }

    if (await this.isScooterRented(scooterId)) {
      throw new InvalidStateError("Самокат уже арендован");
    }

    if (await this._scooterService.isDischarged(scooterId)) {
      throw new InvalidStateError("Самокат разряжен");
    }
  }

  /**
   * Проверяет, может ли пользователь арендовывать самокаты.
   * @private
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  private async ensureUserCanStartRental(userId: UserId) {
    const user = await this._userRepo.getById(userId);
    if (!user.isActive || user.role !== "customer") {
      throw new PermissionError("Пользователь не может арендовать самокаты");
    }

    const rentals = await this._rentalRepo.getActiveByUser(user.id);
    const limit = await this._settingRepo.getByName("MAX_RENTALS", toNumber);
    if (rentals.length >= limit) {
      throw new LimitError("Арендовано максимальное количество самокатов");
    }
  }

  /**
   * Начинает аренду пользователем указанного самоката.
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param scooterId - Уникальный идентификатор самоката
   */
  public async startRental(userId: UserId, scooterId: ScooterId) {
    this.log(`Начало аренды для ${userId} на самокате ${scooterId}`);

    await this.ensureUserCanStartRental(userId);
    await this.ensureScooterIsRentable(scooterId);

    const { startPrice, perMinutePrice } = await this._tariffService.get(
      userId
    );

    const rental = new Rental({
      id: this._rentalRepo.nextId(),
      userId,
      scooterId,
      startPrice,
      perMinutePrice,
      dateStarted: new Date(),
    });
    await this._rentalRepo.save(rental);

    this.log(
      `Начата аренда ${rental.id} за ${rental.startPrice} ₽ + ${rental.perMinutePrice} ₽/мин`
    );

    await this._scooterService.prepareForRide(scooterId);
  }

  /**
   * Завершает указанную аренду.
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param id - Уникальный идентификатор аренды
   */
  public async finishRental(userId: UserId, id: RentalId) {
    this.log(`Конец аренды ${id} для ${userId}`);

    const rental = await this._rentalRepo.getById(id);

    if (rental.userId !== userId) {
      throw new PermissionError("Аренда не принадлежит пользователю");
    }

    if (rental.dateFinished) {
      throw new InvalidStateError("Аренда уже завершена");
    }

    if (!(await this._parkingService.isScooterNearParking(rental.scooterId))) {
      throw new InvalidStateError("Самокат находится далеко от парковки");
    }

    rental.dateFinished = new Date();
    await this._rentalRepo.save(rental);

    this.log(`Аренда ${id} завершена`);

    await this._scooterService.prepareForSleep(rental.scooterId);
    await this._billingGateway.bill(rental.userId, rental.totalPrice);
  }

  /**
   * Выбирает из списка самокатов те из, которые
   * доступны для аренды указанным пользователем.
   * @private
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param scooters - Массив самокатов
   */
  private async filterRentableScooters(userId: UserId, scooters: Scooter[]) {
    const user = await this._userRepo.getById(userId);
    if (!user.isActive) {
      throw new PermissionError("Пользователь не может арендовывать самокаты");
    }

    const available: Scooter[] = [];
    for (const scooter of scooters) {
      try {
        await this.ensureScooterIsRentable(scooter.id);
        available.push(scooter);
      } catch {
        /* noop */
      }
    }

    return available;
  }

  /**
   * Возвращает список доступных для аренды самокатов.
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async getRentableScooters(userId: UserId) {
    const scooters = await this._scooterService.get();
    return this.filterRentableScooters(userId, scooters);
  }

  /**
   * Возвращает список доступных для аренды самокатов
   * в указанной зоне.
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param bounds - Границы зоны
   */
  public async getRentableScootersWithinBounds(userId: UserId, bounds: Bounds) {
    const pings = await this._pingService.getWithinBounds(bounds);
    const scooters = await this._scooterService.get();

    const scootersWithinBounds = scooters.filter((scooter) => {
      return !!pings.find((ping) => ping.scooterId === scooter.id);
    });

    return this.filterRentableScooters(userId, scootersWithinBounds);
  }

  /**
   * Возвращает список активных аренд пользователя.
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async getActiveRentals(userId: UserId) {
    const user = await this._userRepo.getById(userId);
    if (!user.isActive) {
      throw new PermissionError(
        "Пользователь не может получить список активных аренд"
      );
    }

    return this._rentalRepo.getActiveByUser(user.id);
  }

  /**
   * Возвращает список завершенных аренд пользователя
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async getFinishedRentals(userId: UserId) {
    return this._rentalRepo.getFinishedByUser(userId);
  }

  /**
   * Проверяет, арендован ли указанный самокат.
   *
   * @param scooterId - Уникальный идентификатор самоката
   * @param userId - Уникальный идентификатор пользователя
   */
  public async isScooterRented(scooterId: ScooterId, userId?: UserId) {
    const rentals = await this._rentalRepo.getActiveByScooter(scooterId);

    if (userId) {
      return !!rentals.find((r) => r.userId === userId);
    }

    return rentals.length > 0;
  }
}

export { RentalService };
