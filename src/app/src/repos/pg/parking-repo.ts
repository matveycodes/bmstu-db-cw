import { format } from "sqlstring";
import * as crypto from "crypto";

import { Parking, ParkingId } from "../../models/parking";

import { ParkingRepo } from "../../interfaces/parking-repo";

import { Location } from "../../types/location";
import { Bounds } from "../../types/bounds";

import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  latitude: number;
  longitude: number;
}

const row2model = (row: Row) => {
  return new Parking({
    id: row.id as ParkingId,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
    },
  });
};

class ParkingPGRepo implements ParkingRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query =
      "SELECT id, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude FROM parkings";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch (err) {
      throw new DataAccessError("Не удалось получить список парковок");
    }
  }

  public async getNear(location: Location) {
    const query = format(
      "SELECT id, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude " +
        "FROM parkings " +
        "WHERE ST_DWithin(location, ST_Point(?, ?, 4326), 10)",
      [location.longitude, location.latitude]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список ближайших парковок"
      );
    }
  }

  public nextId() {
    return crypto.randomUUID() as ParkingId;
  }

  public async remove(id: ParkingId) {
    const query = format("DELETE FROM parkings WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить парковку");
    }
  }

  public async getWithin(bounds: Bounds) {
    const query = format(
      "SELECT id, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude " +
        "FROM parkings " +
        "WHERE ST_Contains(ST_MakeEnvelope(?, ?, ?, ?, 4326), location::geometry)",
      [
        bounds.min_longitude,
        bounds.min_latitude,
        bounds.max_longitude,
        bounds.max_latitude,
      ]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список парковок");
    }
  }

  public async save(parking: Parking) {
    const queryValues = [
      parking.id,
      parking.location.longitude,
      parking.location.latitude,
    ];

    const query = format(
      "INSERT INTO parkings (id, location) " +
        "VALUES (?, ST_Point(?, ?, 4326)) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, location = ST_Point(?, ?, 4326)",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить парковку");
    }
  }
}

export { ParkingPGRepo };
