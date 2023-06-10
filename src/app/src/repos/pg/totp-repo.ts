import { format } from "sqlstring";

import { TOTPRepo } from "../../interfaces/totp-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { TOTP } from "../../vo/totp";

import { PgPool } from "../../db/pg";

interface Row {
  code: number;
  date_sent: string;
  phone: string;
  signature: string;
  date_used: string | null;
}

const row2model = (row: Row) => {
  return {
    code: row.code,
    dateSent: new Date(row.date_sent),
    phone: row.phone,
    signature: row.signature,
    dateUsed: row.date_used ? new Date(row.date_used) : undefined,
  } as TOTP;
};

class TOTPPGRepo implements TOTPRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query = "SELECT * FROM totp";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows.map(row2model);
    } catch {
      throw new DataAccessError("Не удалось получить коды");
    }
  }

  public async getBySignature(signature: TOTP["signature"]) {
    const query = format("SELECT * FROM totp WHERE signature = ?", [signature]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Код не найден");
      }

      return row2model(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить код по подписи");
    }
  }

  public async save(totp: TOTP) {
    const queryValues = [
      totp.code,
      totp.dateSent.toISOString(),
      totp.phone,
      totp.signature,
      totp.dateUsed?.toISOString(),
    ];

    const query = format(
      "INSERT INTO totp (code, date_sent, phone, signature, date_used) " +
        "VALUES (?, ?, ?, ?, ?) " +
        "ON CONFLICT (signature) DO UPDATE " +
        "SET code = ?, date_sent = ?, phone = ?, signature = ?, date_used = ?",
      [...queryValues, ...queryValues]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить код");
    }
  }

  public async remove(signature: TOTP["signature"]) {
    const query = format("DELETE FROM totp WHERE signature = ?", [signature]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить код");
    }
  }
}

export { TOTPPGRepo };
