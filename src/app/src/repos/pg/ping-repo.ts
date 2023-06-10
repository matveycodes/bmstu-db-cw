import { format } from "sqlstring";

import { ScooterId } from "../../models/scooter";

import { PingRepo } from "../../interfaces/ping-repo";

import { LightsState, LockState, Ping } from "../../vo/ping";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { Bounds } from "../../types/bounds";

import { PgPool } from "../../db/pg";

interface Row {
  scooter_id: string;
  date: string;
  meta_info: object | null;
  latitude: number;
  longitude: number;
  battery_level: number;
  lock_state: string;
  lights_state: string;
}

const row2model = (row: Row) => {
  return {
    scooterId: row.scooter_id as ScooterId,
    date: new Date(row.date),
    metaInfo: row.meta_info ?? undefined,
    location: {
      longitude: row.longitude,
      latitude: row.latitude,
    },
    batteryLevel: row.battery_level,
    lockState: row.lock_state as LockState,
    lightsState: row.lights_state as LightsState,
  } as Ping;
};

class PingPGRepo implements PingRepo {
  private _pool: PgPool;

  constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async save(ping: Ping) {
    const query = format(
      "INSERT INTO pings (scooter_id, date, meta_info, location, battery_level, lock_state, lights_state) " +
        "VALUES (?, ?, ?, ST_Point(?, ?, 4326), ?, ?, ?)",
      [
        ping.scooterId,
        ping.date.toISOString(),
        ping.metaInfo,
        ping.location.longitude,
        ping.location.latitude,
        ping.batteryLevel,
        ping.lockState,
        ping.lightsState,
      ]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить пинг");
    }
  }

  public async get() {
    const query =
      "SELECT pings.*, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude FROM pings";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список пингов");
    }
  }

  public async getWithin(bounds: Bounds) {
    const query = format(
      "SELECT pings.*, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude " +
        "FROM pings " +
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
      throw new DataAccessError("Не удалось получить список пингов");
    }
  }

  public async getLatestByScooter(scooterId: ScooterId) {
    const query = format(
      "SELECT pings.*, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude " +
        "FROM pings " +
        "WHERE scooter_id = ? " +
        "ORDER BY date DESC " +
        "LIMIT 1",
      [scooterId]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Пинг не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить последний пинг по идентификатору самоката"
      );
    }
  }
}

export { PingPGRepo };
