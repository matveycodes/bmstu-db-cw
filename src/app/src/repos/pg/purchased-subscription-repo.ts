import { format } from "sqlstring";

import { SubscriptionId } from "../../models/subscription";
import { UserId } from "../../models/user";

import { PurchasedSubscriptionRepo } from "../../interfaces/purchased-subscription-repo";

import { PurchasedSubscription } from "../../vo/purchased-subscription";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { PgPool } from "../../db/pg";

interface Row {
  subscription_id: string;
  user_id: string;
  date_started: string;
  date_finished: string;
  date_purchased: string;
}

const row2model = (row: Row) => {
  return {
    subscriptionId: row.subscription_id as SubscriptionId,
    userId: row.user_id as UserId,
    dateStarted: new Date(row.date_started),
    dateFinished: new Date(row.date_finished),
    datePurchased: new Date(row.date_purchased),
  } as PurchasedSubscription;
};

class PurchasedSubscriptionPGRepo implements PurchasedSubscriptionRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query = "SELECT * FROM purchased_subscriptions";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список купленных подписок"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM purchased_subscriptions WHERE user_id = ? AND date_finished > ? " +
        "ORDER BY date_started ASC",
      [userId, new Date().toISOString()]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список действующих подписок по идентификатору пользователя"
      );
    }
  }

  public async getLastActiveByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM purchased_subscriptions WHERE user_id = ? AND date_finished > ? " +
        "ORDER BY date_finished DESC LIMIT 1",
      [userId, new Date().toISOString()]
    );

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
        "Не удалось получить самую позднюю активную подписку"
      );
    }
  }

  public async hasUserActiveSubscription(userId: UserId) {
    const query = format(
      "SELECT EXISTS (SELECT true FROM purchased_subscriptions WHERE user_id = ? AND date_finished > ?)",
      [userId, new Date().toISOString()]
    );

    try {
      const { rows } = await this._pool.result<{ exists: boolean }>(query);
      return rows[0].exists;
    } catch {
      throw new DataAccessError("Не удалось проверить подписку");
    }
  }

  public async getFinishedByUser(userId: UserId) {
    const query = format(
      "SELECT * FROM purchased_subscriptions WHERE user_id = ? AND date_finished < ? " +
        "ORDER BY date_finished DESC",
      [userId, new Date().toISOString()]
    );

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список завершённых подписок по идентификатору пользователя"
      );
    }
  }

  public async save(subscription: PurchasedSubscription) {
    const query = format(
      "INSERT INTO purchased_subscriptions (subscription_id, user_id, date_started, date_finished, date_purchased) " +
        "VALUES (?, ?, ?, ?, ?)",
      [
        subscription.subscriptionId,
        subscription.userId,
        subscription.dateStarted.toISOString(),
        subscription.dateFinished.toISOString(),
        subscription.datePurchased.toISOString(),
      ]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить подписку");
    }
  }
}

export { PurchasedSubscriptionPGRepo };
