import minBy from "lodash/minBy";

import { IRestrictedZoneService } from "../interfaces/restricted-zone-service";
import { RestrictedZoneRepo } from "../interfaces/restricted-zone-repo";

import { Location } from "../types/location";

import { CreateRestrictedZoneServiceDto } from "../dto/create-restricted-zone-service";

class RestrictedZoneService implements IRestrictedZoneService {
  private _restrictedZoneRepo: RestrictedZoneRepo;

  constructor(createRestrictedZoneServiceDto: CreateRestrictedZoneServiceDto) {
    this._restrictedZoneRepo =
      createRestrictedZoneServiceDto.restrictedZoneRepo;
  }

  /**
   * Возвращает все зоны ограничения скорости.
   */
  public async getAll() {
    return this._restrictedZoneRepo.get();
  }

  /**
   * Возвращает зоны ограничения скорости,
   * которые покрывают указанную точку.
   *
   * @param location - Точка
   */
  public async getByLocation(location: Location) {
    return this._restrictedZoneRepo.getByLocation(location);
  }

  /**
   * Возвращает ограничение скорости
   * в указанной точке.
   *
   * @param location - Точка
   */
  public async getSpeedLimitByLocation(location: Location) {
    const restrictedZones = await this._restrictedZoneRepo.getByLocation(
      location
    );

    return minBy(restrictedZones, "speedLimit")?.speedLimit ?? Infinity;
  }
}

export { RestrictedZoneService };
