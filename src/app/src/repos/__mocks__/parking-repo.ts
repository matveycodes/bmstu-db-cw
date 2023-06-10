import * as crypto from "crypto";
import isPointInPolygon from "geolib/es/isPointInPolygon";

import { Parking, ParkingId } from "../../models/parking";

import { ParkingRepo } from "../../interfaces/parking-repo";

import { Location } from "../../types/location";
import { Bounds } from "../../types/bounds";

class ParkingMockRepo implements ParkingRepo {
  private _parkings: Parking[] = [];

  public async get() {
    return this._parkings;
  }

  public async getWithin(bounds: Bounds) {
    return this._parkings.filter((p) =>
      isPointInPolygon(p.location, [
        { latitude: bounds.min_latitude, longitude: bounds.min_longitude },
        { latitude: bounds.max_latitude, longitude: bounds.max_longitude },
      ])
    );
  }

  public nextId() {
    return crypto.randomUUID() as ParkingId;
  }

  public async remove(id: ParkingId) {
    this._parkings = this._parkings.filter((p) => p.id === id);
  }

  public async save(parking: Parking) {
    await this.remove(parking.id);
    this._parkings.push(parking);
  }

  public async getNear(location: Location) {
    return this._parkings.filter((p) => p.isNear(location));
  }
}

export { ParkingMockRepo };
