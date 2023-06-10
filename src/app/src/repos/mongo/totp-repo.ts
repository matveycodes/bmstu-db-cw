import { WithId } from "mongodb";

import { TOTPRepo } from "../../interfaces/totp-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { TOTP } from "../../vo/totp";

import { MongoConnection } from "../../db/mongo";

interface Document {
  code: number;
  date_sent: Date;
  phone: string;
  signature: string;
  date_used: Date | null;
}

const document2model = (document: WithId<Document>) => {
  return {
    code: document.code,
    dateSent: document.date_sent,
    phone: document.phone,
    signature: document.signature,
    dateUsed: document.date_used,
  } as TOTP;
};

class TOTPMongoRepo implements TOTPRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("totp")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить коды");
    }
  }

  public async getBySignature(signature: TOTP["signature"]) {
    try {
      const document = await this._connection
        .collection<Document>("totp")
        .findOne({ signature });
      if (!document) {
        throw new NotFoundError("Код не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить код по подписи");
    }
  }

  public async save(totp: TOTP) {
    try {
      await this._connection.collection<Document>("totp").insertOne({
        code: totp.code,
        date_sent: totp.dateSent,
        phone: totp.phone,
        signature: totp.signature,
        date_used: totp.dateUsed || null,
      });
    } catch {
      throw new DataAccessError("Не удалось сохранить код");
    }
  }

  public async remove(signature: TOTP["signature"]) {
    try {
      await this._connection
        .collection<Document>("totp")
        .deleteOne({ signature });
    } catch {
      throw new DataAccessError("Не удалось удалить код");
    }
  }
}

export { TOTPMongoRepo };
