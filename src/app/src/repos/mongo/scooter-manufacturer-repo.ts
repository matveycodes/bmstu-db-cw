import { ObjectId, WithId } from "mongodb";

import {
  ScooterManufacturer,
  ScooterManufacturerId,
} from "../../models/scooter-manufacturer";

import { ScooterManufacturerRepo } from "../../interfaces/scooter-manufacturer-repo";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  title: string;
}

const document2model = (document: WithId<Document>) => {
  return new ScooterManufacturer({
    id: document._id.toString() as ScooterManufacturerId,
    title: document.title,
  });
};

class ScooterManufacturerMongoRepo implements ScooterManufacturerRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("scooterManufacturers")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список производителей самокатов"
      );
    }
  }

  public async getById(id: ScooterManufacturerId) {
    try {
      const document = await this._connection
        .collection<Document>("scooterManufacturers")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Производитель самоката не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить производителя самоката по идентификатору"
      );
    }
  }

  public nextId() {
    return new ObjectId().toString() as ScooterManufacturerId;
  }

  public async save(scooterManufacturer: ScooterManufacturer) {
    try {
      await this._connection
        .collection<Document>("scooterManufacturers")
        .updateOne(
          { _id: new ObjectId(scooterManufacturer.id) },
          { $set: { title: scooterManufacturer.title } },
          { upsert: true }
        );
    } catch {
      throw new DataAccessError("Не удалось сохранить производителя самокатов");
    }
  }
}

export { ScooterManufacturerMongoRepo };
