import { format } from "sqlstring";
import * as crypto from "crypto";

import { ScooterModel, ScooterModelId } from "../../models/scooter-model";
import { ScooterManufacturerId } from "../../models/scooter-manufacturer";

import { ScooterModelRepo } from "../../interfaces/scooter-model-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  manufacturer_id: string;
  title: string;
  single_charge_mileage: number;
  weight: number;
  max_speed: number;
  max_load: number;
  year: number;
}

const row2model = (row: Row) => {
  return new ScooterModel({
    id: row.id as ScooterModelId,
    manufacturerId: row.manufacturer_id as ScooterManufacturerId,
    title: row.title,
    singleChargeMileage: row.single_charge_mileage,
    weight: row.weight,
    maxSpeed: row.max_speed,
    maxLoad: row.max_load,
    year: row.year,
  });
};

class ScooterModelPGRepo implements ScooterModelRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as ScooterModelId;
  }

  public async get() {
    const query = "SELECT * FROM scooter_models";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список моделей самокатов");
    }
  }

  public async getById(id: ScooterModelId) {
    const query = format("SELECT * FROM scooter_models WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Модель самоката не найдена");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить модель самоката по идентификатору"
      );
    }
  }

  public async save(scooterModel: ScooterModel) {
    const queryValues = [
      scooterModel.id,
      scooterModel.manufacturerId,
      scooterModel.title,
      scooterModel.singleChargeMileage,
      scooterModel.weight,
      scooterModel.maxSpeed,
      scooterModel.maxLoad,
      scooterModel.year,
    ];

    const query = format(
      "INSERT INTO scooter_models (id, manufacturer_id, title, single_charge_mileage, weight, max_speed, max_load, year) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, manufacturer_id = ?, title = ?, single_charge_mileage = ?, weight = ?, max_speed = ?, max_load = ?, year = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить модель самоката");
    }
  }
}

export { ScooterModelPGRepo };
