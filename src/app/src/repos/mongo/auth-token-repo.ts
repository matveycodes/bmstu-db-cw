import { ObjectId, WithId } from "mongodb";

import { UserId } from "../../models/user";

import { AuthTokenRepo } from "../../interfaces/auth-token-repo";

import { AuthToken } from "../../vo/auth-token";

import { MongoConnection } from "../../db/mongo";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

interface Document {
  user_id: ObjectId;
  value: string;
  date_expired: Date;
}

const document2model = (document: WithId<Document>) => {
  return {
    userId: document.user_id.toString(),
    value: document.value,
    dateExpired: document.date_expired,
  } as AuthToken;
};

class AuthTokenMongoRepo implements AuthTokenRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("authTokens")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список токенов авторизации"
      );
    }
  }

  public async getByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("authTokens")
        .find({ user_id: new ObjectId(userId) })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить токен авторизации пользователя"
      );
    }
  }

  public async getByValue(value: AuthToken["value"]) {
    try {
      const document = await this._connection
        .collection<Document>("authTokens")
        .findOne({ value });
      if (!document) {
        throw new NotFoundError("Токен авторизации не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить токен авторизации по значению"
      );
    }
  }

  public async remove(value: AuthToken["value"]) {
    try {
      await this._connection
        .collection<Document>("authTokens")
        .deleteOne({ value });
    } catch {
      throw new DataAccessError("Не удалось удалить токен авторизации");
    }
  }

  public async save(token: AuthToken) {
    try {
      await this._connection.collection<Document>("authTokens").insertOne({
        user_id: new ObjectId(token.userId),
        value: token.value,
        date_expired: token.dateExpired,
      });
    } catch {
      throw new DataAccessError("Не удалось сохранить токен авторизации");
    }
  }
}

export { AuthTokenMongoRepo };
