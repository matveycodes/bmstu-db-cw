import * as crypto from "crypto";
import { format } from "sqlstring";

import { User, UserId, UserRole, UserStatus } from "../../models/user";

import { UserRepo } from "../../interfaces/user-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { PgPool } from "../../db/pg";

interface Row {
  id: string;
  status: string;
  role: string;
  date_joined: string;
  middle_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string;
  birthdate: string | null;
}

const row2model = (row: Row) => {
  return new User({
    id: row.id as UserId,
    status: row.status as UserStatus,
    role: row.role as UserRole,
    dateJoined: new Date(row.date_joined),
    middleName: row.middle_name ?? undefined,
    firstName: row.first_name ?? undefined,
    lastName: row.last_name ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone,
    birthdate: row.birthdate ? new Date(row.birthdate) : undefined,
  });
};

class UserPGRepo implements UserRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public nextId() {
    return crypto.randomUUID() as UserId;
  }

  public async save(user: User) {
    const queryValues = [
      user.id,
      user.status,
      user.dateJoined.toISOString(),
      user.middleName,
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.birthdate?.toISOString(),
    ];

    const query = format(
      "INSERT INTO users (id, status, date_joined, middle_name, first_name, last_name, email, phone, birthdate) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT (id) DO UPDATE " +
        "SET id = ?, status = ?, date_joined = ?, middle_name = ?, first_name = ?, last_name = ?, email = ?, phone = ?, birthdate = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить пользователя");
    }
  }

  public async get() {
    const query = "SELECT * FROM users";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить список пользователей");
    }
  }

  public async getById(id: UserId) {
    const query = format("SELECT * FROM users WHERE id = ?", [id]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Пользователь не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить пользователя по идентификатору"
      );
    }
  }

  public async getByPhone(phone: User["phone"]) {
    const query = format("SELECT * FROM users WHERE phone = ?", [phone]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Пользователь не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить пользователя по телефону");
    }
  }

  public async remove(id: UserId) {
    const query = format("DELETE FROM users WHERE id = ?", [id]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить пользователя");
    }
  }
}

export { UserPGRepo };
