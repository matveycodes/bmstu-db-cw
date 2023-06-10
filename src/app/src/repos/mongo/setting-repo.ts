import { WithId } from "mongodb";
import identity from "lodash/identity";

import { SettingRepo } from "../../interfaces/setting-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { Setting } from "../../vo/setting";

import { MongoConnection } from "../../db/mongo";

interface Document {
  name: string;
  value: unknown;
}

const document2model = (document: WithId<Document>) => {
  return { name: document.name, value: document.value } as Setting;
};

class SettingMongoRepo implements SettingRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("settings")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить настройки");
    }
  }

  public async getByName<TValue>(
    name: Setting["name"],
    transformer: (arg0: unknown) => TValue = identity
  ) {
    try {
      const document = await this._connection
        .collection<Document>("settings")
        .findOne({ name });
      if (!document) {
        throw new NotFoundError("Настройка не найдена");
      }

      return transformer(document.value);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить настройку по имени");
    }
  }

  public async remove(name: Setting["name"]) {
    try {
      await this._connection
        .collection<Document>("settings")
        .deleteOne({ name });
    } catch {
      throw new DataAccessError("Не удалось удалить настройку");
    }
  }

  public async save(setting: Setting) {
    try {
      await this._connection
        .collection<Document>("settings")
        .updateOne(
          { name: setting.name },
          { $set: { value: setting.value } },
          { upsert: true }
        );
    } catch {
      throw new DataAccessError("Не удалось сохранить настройку");
    }
  }
}

export { SettingMongoRepo };
