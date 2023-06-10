import { ObjectId, WithId } from "mongodb";

import { Scooter, ScooterId, ScooterStatus } from "../../models/scooter";
import { ScooterModelId } from "../../models/scooter-model";

import { ScooterRepo } from "../../interfaces/scooter-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  model_id: ObjectId;
  status: string;
  number: string;
}

const document2model = (document: WithId<Document>) => {
  return new Scooter({
    id: document._id.toString() as ScooterId,
    modelId: document.model_id.toString() as ScooterModelId,
    status: document.status as ScooterStatus,
    number: document.number,
  });
};

class ScooterMongoRepo implements ScooterRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as ScooterId;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("scooters")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список самокатов");
    }
  }

  public async getById(id: ScooterId) {
    try {
      const document = await this._connection
        .collection<Document>("scooters")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Самокат не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить самокат по идентификатору"
      );
    }
  }

  public async save(scooter: Scooter) {
    try {
      await this._connection.collection<Document>("scooters").updateOne(
        { _id: new ObjectId(scooter.id) },
        {
          $set: {
            model_id: new ObjectId(scooter.modelId),
            status: scooter.status,
            number: scooter.number,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить самокат");
    }
  }

  public async remove(id: ScooterId) {
    try {
      await this._connection
        .collection<Document>("scooters")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить самокат");
    }
  }
}

export { ScooterMongoRepo };
