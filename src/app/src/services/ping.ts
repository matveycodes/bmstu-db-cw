import { ScooterId } from "../models/scooter";

import { PingRepo } from "../interfaces/ping-repo";
import { IPingService } from "../interfaces/ping-service";
import { Logger } from "../interfaces/logger";
import { IScooterService } from "../interfaces/scooter-service";
import { IRestrictedZoneService } from "../interfaces/restricted-zone-service";

import { Bounds } from "../types/bounds";

import { SavePingDto } from "../dto/save-ping";
import { CreatePingServiceDto } from "../dto/create-ping-service";
import { Ping } from "../vo/ping";

class PingService implements IPingService {
  private _pingRepo: PingRepo;
  private _restrictedZoneService: IRestrictedZoneService;
  private _scooterService: IScooterService;
  private _logger?: Logger;

  public constructor(createPingServiceDto: CreatePingServiceDto) {
    this._pingRepo = createPingServiceDto.pingRepo;
    this._restrictedZoneService = createPingServiceDto.restrictedZoneService;
    this._scooterService = createPingServiceDto.scooterService;
    this._logger = createPingServiceDto.logger;
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
   * Сохраняет пинг от самоката.
   *
   * @param savePingDto - Пинг
   */
  public async save(savePingDto: SavePingDto) {
    const ping: Ping = { ...savePingDto, date: new Date() };
    await this._pingRepo.save(ping);

    const speedLimit =
      await this._restrictedZoneService.getSpeedLimitByLocation(ping.location);

    if (Number.isFinite(speedLimit)) {
      this.log(`Скорость должна быть ограничена до ${speedLimit} км/ч`);
      await this._scooterService.setSpeedLimit(ping.scooterId, speedLimit);
    } else {
      this.log("Ограничение скорости должно быть снято");
      await this._scooterService.resetSpeedLimit(ping.scooterId);
    }
  }

  /**
   * Возвращает последний пинг самоката.
   *
   * @param scooterId - Уникальный идентификатор самоката
   */
  public async getLatestByScooter(scooterId: ScooterId) {
    return this._pingRepo.getLatestByScooter(scooterId);
  }

  /**
   * Возвращает пинги в указанной зоне.
   *
   * @param bounds - Границы зоны
   */
  public async getWithinBounds(bounds: Bounds) {
    return this._pingRepo.getWithin(bounds);
  }
}

export { PingService };
