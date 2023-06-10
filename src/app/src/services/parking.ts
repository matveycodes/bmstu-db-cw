import { ScooterId } from "../models/scooter";

import { ParkingRepo } from "../interfaces/parking-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { IParkingService } from "../interfaces/parking-service";

import { CreateParkingServiceDto } from "../dto/create-parking-service";
import { Bounds } from "../types/bounds";

class ParkingService implements IParkingService {
  private _parkingRepo: ParkingRepo;
  private _pingRepo: PingRepo;

  public constructor(createParkingServiceDto: CreateParkingServiceDto) {
    this._parkingRepo = createParkingServiceDto.parkingRepo;
    this._pingRepo = createParkingServiceDto.pingRepo;
  }

  /**
   * Возвращает все парковки внутри границ.
   *
   * @param bounds - Границы
   */
  public async getWithinBounds(bounds: Bounds) {
    return this._parkingRepo.getWithin(bounds);
  }

  /**
   * Проверяет, находится ли самокат рядом с парковкой.
   *
   * @param scooterId - Уникальный идентификатор самоката
   */
  public async isScooterNearParking(scooterId: ScooterId) {
    const ping = await this._pingRepo.getLatestByScooter(scooterId);
    const nearbyParkings = await this._parkingRepo.getNear(ping.location);

    return nearbyParkings.length > 0;
  }
}

export { ParkingService };
