import { ObjectId, WithId } from "mongodb";

import { ScooterModel, ScooterModelId } from "../../models/scooter-model";
import { ScooterManufacturerId } from "../../models/scooter-manufacturer";

import { ScooterModelRepo } from "../../interfaces/scooter-model-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  manufacturer_id: ObjectId;
  title: string;
  single_charge_mileage: number;
  weight: number;
  max_speed: number;
  max_load: number;
  year: number;
}

const document2model = (document: WithId<Document>) => {
  return new ScooterModel({
    id: document._id.toString() as ScooterModelId,
    manufacturerId:
      document.manufacturer_id.toString() as ScooterManufacturerId,
    title: document.title,
    singleChargeMileage: document.single_charge_mileage,
    weight: document.weight,
    maxSpeed: document.max_speed,
    maxLoad: document.max_load,
    year: document.year,
  });
};

class ScooterModelMongoRepo implements ScooterModelRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as ScooterModelId;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("scooterModels")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список моделей самокатов");
    }
  }

  public async getById(id: ScooterModelId) {
    try {
      const document = await this._connection
        .collection<Document>("scooterModels")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Модель самоката не найдена");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить модель самоката по идентификатору"
      );
    }
  }

  public async save(scooterModel: ScooterModel) {
    try {
      await this._connection.collection<Document>("scooterModels").updateOne(
        { _id: new ObjectId(scooterModel.id) },
        {
          $set: {
            manufacturer_id: new ObjectId(scooterModel.manufacturerId),
            title: scooterModel.title,
            single_charge_mileage: scooterModel.singleChargeMileage,
            weight: scooterModel.weight,
            max_speed: scooterModel.maxSpeed,
            max_load: scooterModel.maxLoad,
            year: scooterModel.year,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить модель самоката");
    }
  }
}

export { ScooterModelMongoRepo };
