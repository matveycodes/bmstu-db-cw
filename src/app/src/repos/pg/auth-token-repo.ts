import { format } from "sqlstring";

import { UserId } from "../../models/user";

import { AuthTokenRepo } from "../../interfaces/auth-token-repo";

import { AuthToken } from "../../vo/auth-token";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  user_id: string;
  value: string;
  date_expired: string;
}

const row2model = (row: Row) => {
  return {
    userId: row.user_id,
    value: row.value,
    dateExpired: new Date(row.date_expired),
  } as AuthToken;
};

class AuthTokenPGRepo implements AuthTokenRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query = "SELECT * FROM auth_tokens";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список токенов авторизации"
      );
    }
  }

  public async getByUser(userId: UserId) {
    const query = format("SELECT * FROM auth_tokens WHERE user_id = ?", [
      userId,
    ]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить токен авторизации пользователя"
      );
    }
  }

  public async getByValue(value: AuthToken["value"]) {
    const query = format("SELECT * FROM auth_tokens WHERE value = ?", [value]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Токен авторизации не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить токен авторизации по значению"
      );
    }
  }

  public async save(token: AuthToken) {
    const query = format(
      "INSERT INTO auth_tokens (user_id, value, date_expired) VALUES (?, ?, ?)",
      [token.userId, token.value, token.dateExpired.toISOString()]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить токен авторизации");
    }
  }

  public async remove(value: AuthToken["value"]) {
    const query = format("DELETE FROM auth_tokens WHERE value = ?", [value]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить токен авторизации");
    }
  }
}

export { AuthTokenPGRepo };
