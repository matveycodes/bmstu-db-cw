import { format } from "sqlstring";
import * as crypto from "crypto";

import { Booking, BookingId } from "../../models/booking";
import { UserId } from "../../models/user";
import { ScooterId } from "../../models/scooter";

import { BookingRepo } from "../../interfaces/booking-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  user_id: string;
  scooter_id: string;
  date_started: string;
  date_finished: string;
}

const row2model = (row: Row) => {
  return new Booking({
    id: row.id as BookingId,
    userId: row.user_id as UserId,
    scooterId: row.scooter_id as ScooterId,
    dateStarted: new Date(row.date_started),
    dateFinished: new Date(row.date_finished),
  });
};

class BookingPGRepo implements BookingRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async save(booking: Booking) {
    const queryValues = [
      booking.id,
      booking.userId,
      booking.scooterId,
      booking.dateStarted.toISOString(),
      booking.dateFinished.toISOString(),
    ];

    const query = format(
      "INSERT INTO bookings (id, user_id, scooter_id, date_started, date_finished) " +
        "VALUES (?, ?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, user_id = ?, scooter_id = ?, date_started = ?, date_finished = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить бронирование");
    }
  }

  public async get() {
    const query = "SELECT * FROM bookings";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список бронирований");
    }
  }

  public async getById(id: BookingId) {
    const query = format("SELECT * FROM bookings WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Бронирование не найдено");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить бронирование по идентификатору"
      );
    }
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    const query = format(
      "SELECT * FROM bookings WHERE scooter_id = ? AND date_finished > ?",
      [scooterId, new Date().toISOString()]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список незавершенных бронирований по идентификатору самоката"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM bookings WHERE user_id = ? AND date_finished > ?",
      [userId, new Date().toISOString()]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список незавершенных бронирований по идентификатору пользователя"
      );
    }
  }

  public nextId() {
    return crypto.randomUUID() as BookingId;
  }

  public async remove(id: BookingId) {
    const query = format("DELETE FROM bookings WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить бронирование");
    }
  }

  public async isScooterBooked(scooterId: ScooterId, userId?: UserId) {
    const query = userId
      ? format(
          "SELECT EXISTS (SELECT true FROM bookings WHERE scooter_id = ?)",
          [scooterId]
        )
      : format(
          "SELECT EXISTS (SELECT true FROM bookings WHERE scooter_id = ? AND user_id = ?)",
          [scooterId, userId]
        );

    try {
      const { rows } = await this._pool.result<{ exists: boolean }>(query);
      return rows[0].exists;
    } catch {
      throw new DataAccessError("Не удалось проверить бронирование");
    }
  }
}

export { BookingPGRepo };
