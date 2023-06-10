import { format, raw } from "sqlstring";
import * as crypto from "crypto";

import { RestrictedZone, RestrictedZoneId } from "../../models/restricted-zone";

import { RestrictedZoneRepo } from "../../interfaces/restricted-zone-repo";

import { Location } from "../../types/location";

import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  polygon: string;
  speed_limit: number;
}

const row2model = (row: Row) => {
  return new RestrictedZone({
    id: row.id as RestrictedZoneId,
    polygon: (
      JSON.parse(row.polygon) as { coordinates: number[][][] }
    ).coordinates[0].map((coordinate) => ({
      longitude: coordinate[0],
      latitude: coordinate[1],
    })),
    speedLimit: row.speed_limit,
  });
};

class RestrictedZonePGRepo implements RestrictedZoneRepo {
  private _pool: PgPool;

  constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as RestrictedZoneId;
  }

  public async save(restrictedZone: RestrictedZone) {
    const polygon = restrictedZone.polygon
      .map((point) => `${point.longitude} ${point.latitude}`)
      .join(",");

    const queryValues = [
      restrictedZone.id,
      raw(polygon),
      restrictedZone.speedLimit,
    ];

    const query = format(
      "INSERT INTO restricted_zones (id, polygon, speed_limit) " +
        "VALUES (?, ST_Polygon('LINESTRING(?)'::geometry, 4326), ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, polygon = ST_Polygon('LINESTRING(?)'::geometry, 4326), speed_limit = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError(
        "Не удалось сохранить зону ограничения скорости"
      );
    }
  }

  public async get() {
    const query =
      "SELECT id, speed_limit, ST_AsGeoJSON(polygon) as polygon FROM restricted_zones";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список зон ограничения скорости"
      );
    }
  }

  public async getByLocation(location: Location) {
    const query = format(
      "SELECT id, speed_limit, ST_AsGeoJSON(polygon) as polygon " +
        "FROM restricted_zones " +
        "WHERE ST_Contains(polygon, ST_Point(?, ?, 4326))",
      [location.longitude, location.latitude]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список зон ограничения скорости для указанной локации"
      );
    }
  }

  public async remove(id: RestrictedZoneId) {
    const query = format("DELETE FROM restricted_zones WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить зону ограничения скорости");
    }
  }
}

export { RestrictedZonePGRepo };
