import dayjs from "dayjs";
import toNumber from "lodash/toNumber";

import { ScooterId } from "../models/scooter";
import { UserId } from "../models/user";
import { Booking, BookingId } from "../models/booking";

import { UserRepo } from "../interfaces/user-repo";
import { BookingRepo } from "../interfaces/booking-repo";
import { ScooterRepo } from "../interfaces/scooter-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { RentalRepo } from "../interfaces/rental-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { IBookingService } from "../interfaces/booking-service";
import { Logger } from "../interfaces/logger";

import { InvalidStateError } from "../errors/invalid-state-error";
import { PermissionError } from "../errors/permission-error";
import { LimitError } from "../errors/limit-error";

import { CreateBookingServiceDto } from "../dto/create-booking-service";

class BookingService implements IBookingService {
  private _userRepo: UserRepo;
  private _scooterRepo: ScooterRepo;
  private _bookingRepo: BookingRepo;
  private _rentalRepo: RentalRepo;
  private _settingRepo: SettingRepo;
  private _pingRepo: PingRepo;
  private _logger?: Logger;

  public constructor(createBookingServiceDto: CreateBookingServiceDto) {
    this._userRepo = createBookingServiceDto.userRepo;
    this._scooterRepo = createBookingServiceDto.scooterRepo;
    this._bookingRepo = createBookingServiceDto.bookingRepo;
    this._rentalRepo = createBookingServiceDto.rentalRepo;
    this._settingRepo = createBookingServiceDto.settingRepo;
    this._pingRepo = createBookingServiceDto.pingRepo;
    this._logger = createBookingServiceDto.logger;
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
   * Проверяет, можно ли забронировать указанный самокат.
   * @private
   *
   * @param scooterId - Уникальный идентификатор самоката
   */
  private async ensureScooterIsBookable(scooterId: ScooterId) {
    const scooter = await this._scooterRepo.getById(scooterId);
    if (!scooter.isEnabled) {
      throw new InvalidStateError("Самокат недоступен");
    }

    if (await this._rentalRepo.isScooterRented(scooterId)) {
      throw new InvalidStateError("Самокат арендован");
    }

    if (await this.isScooterBooked(scooterId)) {
      throw new InvalidStateError("Самокат уже забронирован");
    }

    const ping = await this._pingRepo.getLatestByScooter(scooterId);
    if (ping.batteryLevel === 0) {
      throw new InvalidStateError("Самокат разряжен");
    }
  }

  /**
   * Проверяет, может ли пользователь бронировать самокаты.
   * @private
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  private async ensureUserCanBook(userId: UserId) {
    const user = await this._userRepo.getById(userId);
    if (!user.isActive || user.role !== "customer") {
      throw new PermissionError("Пользователь не может бронировать самокаты");
    }

    const bookings = await this._bookingRepo.getActiveByUser(userId);
    const limit = await this._settingRepo.getByName("MAX_BOOKINGS", toNumber);
    if (bookings.length >= limit) {
      throw new LimitError("Забронировано максимальное количество самокатов");
    }
  }

  /**
   * Бронирует указанный самокат.
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param scooterId - Уникальный идентификатор самоката
   */
  public async bookScooter(userId: UserId, scooterId: ScooterId) {
    this.log(`Бронирование самоката ${scooterId} для ${userId}`);

    await this.ensureUserCanBook(userId);
    await this.ensureScooterIsBookable(scooterId);

    const dateStarted = new Date();
    const duration = await this._settingRepo.getByName(
      "BOOKING_DURATION",
      toNumber
    );
    const dateFinished = dayjs(dateStarted).add(duration, "seconds").toDate();

    const booking = new Booking({
      id: this._bookingRepo.nextId(),
      userId,
      scooterId,
      dateStarted,
      dateFinished,
    });
    await this._bookingRepo.save(booking);

    this.log(`Самокат ${scooterId} забронирован до ${booking.dateFinished}`);
  }

  /**
   * Отменяет указанное бронирование.
   *
   * @param userId - Уникальный идентификатор пользователя
   * @param id - Уникальный идентификатор бронирования
   */
  public async cancelBooking(userId: UserId, id: BookingId) {
    this.log(`Отмена бронирования ${id} для ${userId}`);

    const booking = await this._bookingRepo.getById(id);

    if (booking.userId !== userId) {
      throw new PermissionError("Бронирование не принадлежит пользователю");
    }

    const now = new Date();
    if (booking.dateFinished < now) {
      throw new InvalidStateError("Бронирование уже завершено");
    }

    booking.dateFinished = now;
    await this._bookingRepo.save(booking);

    this.log(`Бронирование ${id} отменено ${booking.dateFinished}`);
  }

  /**
   * Возвращает все активные бронирования указанного
   * пользователя.
   *
   * @param userId - Уникальный идентификатор пользователя.
   */
  public async getActiveBookings(userId: UserId) {
    return this._bookingRepo.getActiveByUser(userId);
  }

  /**
   * Проверяет, забронирован ли самокат.
   *
   * @param scooterId - Уникальный идентификатор самоката
   * @param userId - Уникальный идентификатор пользователя
   */
  public async isScooterBooked(scooterId: ScooterId, userId?: UserId) {
    const bookings = await this._bookingRepo.getActiveByScooter(scooterId);

    if (userId) {
      return !!bookings.find((b) => b.userId === userId);
    }

    return bookings.length > 0;
  }
}

export { BookingService };
