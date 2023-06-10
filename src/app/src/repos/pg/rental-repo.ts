import { format } from "sqlstring";
import * as crypto from "crypto";

import { Rental, RentalId } from "../../models/rental";
import { UserId } from "../../models/user";
import { ScooterId } from "../../models/scooter";

import { RentalRepo } from "../../interfaces/rental-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  user_id: string;
  scooter_id: string;
  start_price: number;
  per_minute_price: number;
  date_started: string;
  date_finished: string | null;
}

const row2model = (row: Row) => {
  return new Rental({
    id: row.id as RentalId,
    userId: row.user_id as UserId,
    scooterId: row.scooter_id as ScooterId,
    startPrice: row.start_price,
    perMinutePrice: row.per_minute_price,
    dateStarted: new Date(row.date_started),
    dateFinished: row.date_finished ? new Date(row.date_finished) : undefined,
  });
};

class RentalPGRepo implements RentalRepo {
  private _pool: PgPool;

  constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as RentalId;
  }

  public async get() {
    const query = "SELECT * FROM rentals ORDER BY date_started DESC";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список аренд");
    }
  }

  public async getById(id: RentalId) {
    const query = format("SELECT * FROM rentals WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Аренда не найдена");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить аренду по идентификатору");
    }
  }

  public async getFinishedByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM rentals WHERE user_id = ? AND date_finished IS NOT NULL " +
        " ORDER BY date_started DESC",
      [userId]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить завершенные аренды по идентификатору пользователя"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM rentals WHERE user_id = ? AND date_finished IS NULL " +
        "ORDER BY date_started DESC",
      [userId]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить незавершенные аренды по идентификатору пользователя"
      );
    }
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    const query = format(
      "SELECT * FROM rentals WHERE scooter_id = ? AND date_finished IS NULL " +
        "ORDER BY date_started DESC",
      [scooterId]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить незавершенные аренды по идентификатору самоката"
      );
    }
  }

  public async save(rental: Rental) {
    const queryValues = [
      rental.id,
      rental.userId,
      rental.scooterId,
      rental.startPrice,
      rental.perMinutePrice,
      rental.dateStarted.toISOString(),
      rental.dateFinished?.toISOString(),
    ];

    const query = format(
      "INSERT INTO rentals (id, user_id, scooter_id, start_price, per_minute_price, date_started, date_finished) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, user_id = ?, scooter_id = ?, start_price = ?, per_minute_price = ?, date_started = ?, date_finished = ? ",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить аренду");
    }
  }

  public async remove(id: RentalId) {
    const query = format("DELETE FROM rentals WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить аренду");
    }
  }

  public async isScooterRented(scooterId: ScooterId, userId?: UserId) {
    const query = userId
      ? format(
          "SELECT EXISTS (SELECT true FROM rentals WHERE scooter_id = ? AND date_finished IS NULL)",
          [scooterId]
        )
      : format(
          "SELECT EXISTS (SELECT true FROM rentals WHERE scooter_id = ? AND user_id = ? AND date_finished IS NULL)",
          [scooterId, userId]
        );

    try {
      const { rows } = await this._pool.result<{ exists: boolean }>(query);
      return rows[0].exists;
    } catch {
      throw new DataAccessError("Не удалось проверить аренду");
    }
  }
}

export { RentalPGRepo };
