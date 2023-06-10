import { format } from "sqlstring";
import * as crypto from "crypto";

import {
  ScooterManufacturer,
  ScooterManufacturerId,
} from "../../models/scooter-manufacturer";

import { ScooterManufacturerRepo } from "../../interfaces/scooter-manufacturer-repo";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  title: string;
}

const row2model = (row: Row) => {
  return new ScooterManufacturer({
    id: row.id as ScooterManufacturerId,
    title: row.title,
  });
};

class ScooterManufacturerPGRepo implements ScooterManufacturerRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query = "SELECT * FROM scooter_manufacturers";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список производителей самокатов"
      );
    }
  }

  public async getById(id: ScooterManufacturerId) {
    const query = format("SELECT * FROM scooter_manufacturers WHERE id = ?", [
      id,
    ]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Производитель самоката не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить производителя самоката по идентификатору"
      );
    }
  }

  public nextId() {
    return crypto.randomUUID() as ScooterManufacturerId;
  }

  public async save(scooterManufacturer: ScooterManufacturer) {
    const queryValues = [scooterManufacturer.id, scooterManufacturer.title];

    const query = format(
      "INSERT INTO scooter_manufacturers (id, title) " +
        "VALUES (?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, title = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить производителя самокатов");
    }
  }
}

export { ScooterManufacturerPGRepo };
