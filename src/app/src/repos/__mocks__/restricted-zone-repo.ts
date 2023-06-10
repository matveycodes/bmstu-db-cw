import * as crypto from "crypto";

import { RestrictedZone, RestrictedZoneId } from "../../models/restricted-zone";

import { RestrictedZoneRepo } from "../../interfaces/restricted-zone-repo";

import { Location } from "../../types/location";

class RestrictedZoneMockRepo implements RestrictedZoneRepo {
  private _zones: RestrictedZone[] = [];

  public async get() {
    return this._zones;
  }

  public async getByLocation(location: Location) {
    return this._zones.filter((z) => z.contains(location));
  }

  public async remove(id: RestrictedZoneId) {
    this._zones = this._zones.filter((z) => z.id !== id);
  }

  public async save(restrictedZone: RestrictedZone) {
    await this.remove(restrictedZone.id);
    this._zones.push(restrictedZone);
  }

  public nextId() {
    return crypto.randomUUID() as RestrictedZoneId;
  }
}

export { RestrictedZoneMockRepo };
