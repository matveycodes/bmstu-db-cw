import { format } from "sqlstring";
import identity from "lodash/identity";

import { SettingRepo } from "../../interfaces/setting-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { Setting } from "../../vo/setting";

import { PgPool } from "../../db/pg";

interface Row {
  name: string;
  value: string;
}

class SettingPGRepo implements SettingRepo {
  private _pool: PgPool;

  public constructor(pool: PgPool) {
    this._pool = pool;
  }

  public async get() {
    const query = "SELECT * FROM settings";

    try {
      const { rows } = await this._pool.result<Row>(query);
      return rows;
    } catch {
      throw new DataAccessError("Не удалось получить настройки");
    }
  }

  public async getByName<TValue>(
    name: Setting["name"],
    transformer: (arg0: unknown) => TValue = identity
  ) {
    const query = format("SELECT * FROM settings WHERE name = ?", [name]);

    try {
      const { rows } = await this._pool.result<Row>(query);
      if (rows.length === 0) {
        throw new NotFoundError("Настройка не найдена");
      }

      return transformer(rows[0].value);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить настройку по имени");
    }
  }

  public async remove(name: Setting["name"]) {
    const query = format("DELETE FROM settings WHERE name = ?", [name]);

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось удалить настройку");
    }
  }

  public async save(setting: Setting) {
    const query = format(
      "INSERT INTO settings (name, value) VALUES (?, ?) ON CONFLICT (name) DO UPDATE SET value = ?",
      [setting.name, setting.value, setting.value]
    );

    try {
      await this._pool.result(query);
    } catch {
      throw new DataAccessError("Не удалось сохранить настройку");
    }
  }
}

export { SettingPGRepo };
