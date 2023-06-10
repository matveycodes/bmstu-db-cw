import { format } from "sqlstring";
import * as crypto from "crypto";

import { Scooter, ScooterId, ScooterStatus } from "../../models/scooter";
import { ScooterModelId } from "../../models/scooter-model";

import { ScooterRepo } from "../../interfaces/scooter-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  model_id: string;
  status: string;
  number: string;
}

const row2model = (row: Row) => {
  return new Scooter({
    id: row.id as ScooterId,
    modelId: row.model_id as ScooterModelId,
    status: row.status as ScooterStatus,
    number: row.number,
  });
};

class ScooterPGRepo implements ScooterRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as ScooterId;
  }

  public async get() {
    const query = "SELECT * FROM scooters";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список самокатов");
    }
  }

  public async getById(id: ScooterId) {
    const query = format("SELECT * FROM scooters WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Самокат не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить самокат по идентификатору"
      );
    }
  }

  public async save(scooter: Scooter) {
    const queryValues = [
      scooter.id,
      scooter.modelId,
      scooter.status,
      scooter.number,
    ];

    const query = format(
      "INSERT INTO scooters (id, model_id, status, number) " +
        "VALUES (?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, model_id = ?, status = ?, number = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить самокат");
    }
  }

  public async remove(id: ScooterId) {
    const query = format("DELETE FROM scooters WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить самокат");
    }
  }
}

export { ScooterPGRepo };
