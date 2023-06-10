import isPointInPolygon from "geolib/es/isPointInPolygon";

import { ScooterId } from "../../models/scooter";

import { PingRepo } from "../../interfaces/ping-repo";

import { Ping } from "../../vo/ping";
import { Bounds } from "../../types/bounds";
import { NotFoundError } from "../../errors/not-found-error";

class PingMockRepo implements PingRepo {
  private _pings: Ping[] = [];

  public async get() {
    return this._pings;
  }

  public async getLatestByScooter(scooterId: ScooterId) {
    const pings = [...this._pings].reverse();
    const ping = pings.find((p) => p.scooterId === scooterId);
    return ping || Promise.reject(new NotFoundError("Пинг не найден"));
  }

  public async getWithin(bounds: Bounds) {
    return this._pings.filter((p) =>
      isPointInPolygon(p.location, [
        { latitude: bounds.min_latitude, longitude: bounds.min_longitude },
        { latitude: bounds.max_latitude, longitude: bounds.max_longitude },
      ])
    );
  }

  public async save(ping: Ping) {
    this._pings.push(ping);
  }
}

export { PingMockRepo };
