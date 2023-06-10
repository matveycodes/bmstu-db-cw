import { format } from "sqlstring";
import * as crypto from "crypto";

import { Subscription, SubscriptionId } from "../../models/subscription";

import { SubscriptionRepo } from "../../interfaces/subscription-repo";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  title: string;
  duration: number;
  price: number;
}

const row2model = (row: Row) => {
  return new Subscription({
    id: row.id as SubscriptionId,
    title: row.title,
    price: row.price,
    duration: row.duration,
  });
};

class SubscriptionPGRepo implements SubscriptionRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as SubscriptionId;
  }

  public async get() {
    const query = "SELECT * FROM subscriptions";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список подписок");
    }
  }

  public async save(subscription: Subscription) {
    const queryValues = [
      subscription.id,
      subscription.title,
      subscription.price,
      subscription.duration,
    ];

    const query = format(
      "INSERT INTO subscriptions (id, title, price, duration) " +
        "VALUES (?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, title = ?, price = ?, duration = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить подписку");
    }
  }

  public async remove(id: SubscriptionId) {
    const query = format("DELETE FROM subscriptions WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить подписку");
    }
  }

  public async getById(id: SubscriptionId) {
    const query = format("SELECT * FROM subscriptions WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Подписка не найдена");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить подписку по идентификатору"
      );
    }
  }
}

export { SubscriptionPGRepo };
