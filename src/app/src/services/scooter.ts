import { ScooterId } from "../models/scooter";

import { ScooterAPIGateway } from "../interfaces/scooter-api-gateway";
import { ScooterRepo } from "../interfaces/scooter-repo";
import { ScooterModelRepo } from "../interfaces/scooter-model-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { IScooterService } from "../interfaces/scooter-service";
import { Logger } from "../interfaces/logger";

import { CreateScooterServiceDto } from "../dto/create-scooter-service";
import { Bounds } from "../types/bounds";

class ScooterService implements IScooterService {
  private _scooterApiGateway: ScooterAPIGateway;
  private _scooterRepo: ScooterRepo;
  private _scooterModelRepo: ScooterModelRepo;
  private _pingRepo: PingRepo;
  private _logger?: Logger;

  public constructor(createScooterServiceDto: CreateScooterServiceDto) {
    this._scooterApiGateway = createScooterServiceDto.scooterApiGateway;
    this._scooterRepo = createScooterServiceDto.scooterRepo;
    this._scooterModelRepo = createScooterServiceDto.scooterModelRepo;
    this._pingRepo = createScooterServiceDto.pingRepo;
    this._logger = createScooterServiceDto.logger;
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
   * Включает дисплей самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  private async turnDisplayOn(id: ScooterId) {
    this.log(`Включение дисплея самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "DISPLAY_ON");
  }

  /**
   * Выключает дисплей самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  private async turnDisplayOff(id: ScooterId) {
    this.log(`Выключение дисплея самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "DISPLAY_OFF");
  }

  /**
   * Возвращает список разряженных самокатов
   * в указанной зоне.
   *
   * @param bounds - Границы зоны
   */
  public async getDischargedWithinBounds(bounds: Bounds) {
    const pings = await this._pingRepo.getWithin(bounds);

    const dischargedPings = [];
    for (const ping of pings) {
      if (await this.isDischarged(ping.scooterId)) {
        dischargedPings.push(ping);
      }
    }

    return await Promise.all(
      dischargedPings.map((p) => this.getById(p.scooterId))
    );
  }

  /**
   * Включает звонок на самокате.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async beep(id: ScooterId) {
    this.log(`Включение звонка самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "BEEP");
  }

  /**
   * Разблокирует самокат.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async unlock(id: ScooterId) {
    this.log(`Разблокировка замка самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "UNLOCK");
  }

  /**
   * Включает фары самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async turnLightsOn(id: ScooterId) {
    this.log(`Включение фар самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "LIGHTS_ON");
  }

  /**
   * Выключает фары самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async turnLightsOff(id: ScooterId) {
    this.log(`Выключение фар самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "LIGHTS_OFF");
  }

  /**
   * Ограничивает максимальную скорость самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   * @param value - Максимальная скорость
   */
  public async setSpeedLimit(id: ScooterId, value: number) {
    this.log(`Ограничение скорости до ${value} км/ч для самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "SPEED_LIMIT_ON", value);
  }

  /**
   * Снимает ограничение скорости самоката.
   * @private
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async resetSpeedLimit(id: ScooterId) {
    this.log(`Снятие ограничения скорости для самоката ${id}`);
    await this._scooterApiGateway.sendCommand(id, "SPEED_LIMIT_OFF");
  }

  /**
   * Определяет, требуется ли включать фары.
   * @private
   */
  private areLightsNeeded() {
    const now = new Date();
    return now.getHours() > 20 || now.getHours() < 6;
  }

  /**
   * Подготавливает самокат к поездке.
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async prepareForRide(id: ScooterId) {
    this.log(`Подготовка самоката ${id} к поездке`);

    await this.turnDisplayOn(id);

    if (this.areLightsNeeded()) {
      await this.turnLightsOn(id);
    }

    await this.unlock(id);
  }

  /**
   * Подготавливает самокат к переходу
   * в спящий режим.
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async prepareForSleep(id: ScooterId) {
    this.log(`Перевод самоката ${id} в спящий режим`);

    await this.turnDisplayOff(id);
    await this.turnLightsOff(id);
    await this.beep(id);
  }

  /**
   * Оценивает расстояние, которое может преодолеть
   * указанный самокат.
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async estimateDistance(id: ScooterId) {
    const scooter = await this._scooterRepo.getById(id);
    const ping = await this._pingRepo.getLatestByScooter(scooter.id);
    const model = await this._scooterModelRepo.getById(scooter.modelId);

    return Math.floor(model.singleChargeMileage * (ping.batteryLevel / 100));
  }

  /**
   * Возвращает самокат по его
   * идентификатору.
   *
   * @param id - Уникальный идентификатор
   */
  public async getById(id: ScooterId) {
    return this._scooterRepo.getById(id);
  }

  /**
   * Оценивает время в минутах, которое
   * самокату осталось работать с текущим
   * уровнем заряда батареи.
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async estimateTime(id: ScooterId) {
    const scooter = await this.getById(id);
    const model = await this._scooterModelRepo.getById(scooter.modelId);
    const distance = await this.estimateDistance(id);

    return Math.floor((distance / model.maxSpeed) * 60);
  }

  /**
   * Определяет, разряжен ли самокат.
   *
   * @param id - Уникальный идентификатор самоката
   */
  public async isDischarged(id: ScooterId) {
    const ping = await this._pingRepo.getLatestByScooter(id);
    return ping.batteryLevel === 0;
  }

  /**
   * Возвращает все самокаты сервиса.
   */
  public async get() {
    return this._scooterRepo.get();
  }
}

export { ScooterService };
