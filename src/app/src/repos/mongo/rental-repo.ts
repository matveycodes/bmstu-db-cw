import { ObjectId, WithId } from "mongodb";

import { Rental, RentalId } from "../../models/rental";
import { UserId } from "../../models/user";
import { ScooterId } from "../../models/scooter";

import { RentalRepo } from "../../interfaces/rental-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  user_id: ObjectId;
  scooter_id: ObjectId;
  start_price: number;
  per_minute_price: number;
  date_started: Date;
  date_finished: Date | null;
}

const document2model = (document: WithId<Document>) => {
  return new Rental({
    id: document._id.toString() as RentalId,
    userId: document.user_id.toString() as UserId,
    scooterId: document.scooter_id.toString() as ScooterId,
    startPrice: document.start_price,
    perMinutePrice: document.per_minute_price,
    dateStarted: document.date_started,
    dateFinished: document.date_finished ?? undefined,
  });
};

class RentalMongoRepo implements RentalRepo {
  private _connection: MongoConnection;

  constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as RentalId;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("rentals")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список аренд");
    }
  }

  public async getById(id: RentalId) {
    try {
      const document = await this._connection
        .collection<Document>("rentals")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Аренда не найдена");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить аренду по идентификатору");
    }
  }

  public async getFinishedByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("rentals")
        .find(
          { user_id: new ObjectId(userId), date_finished: { $ne: null } },
          { sort: { date_started: "desc" } }
        )
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить завершенные аренды по идентификатору пользователя"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("rentals")
        .find(
          { user_id: new ObjectId(userId), date_finished: null },
          { sort: { date_started: "desc" } }
        )
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить незавершенные аренды по идентификатору пользователя"
      );
    }
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    try {
      const documents = await this._connection
        .collection<Document>("rentals")
        .find(
          { scooter_id: new ObjectId(scooterId), date_finished: null },
          { sort: { date_started: "desc" } }
        )
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить незавершенные аренды по идентификатору самоката"
      );
    }
  }

  public async save(rental: Rental) {
    try {
      await this._connection.collection<Document>("rentals").updateOne(
        { _id: new ObjectId(rental.id) },
        {
          $set: {
            user_id: new ObjectId(rental.userId),
            scooter_id: new ObjectId(rental.scooterId),
            start_price: rental.startPrice,
            per_minute_price: rental.perMinutePrice,
            date_started: rental.dateStarted,
            date_finished: rental.dateFinished,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить аренду");
    }
  }

  public async remove(id: RentalId) {
    try {
      await this._connection
        .collection<Document>("rentals")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить аренду");
    }
  }

  public async isScooterRented(scooterId: ScooterId, userId?: UserId) {
    try {
      const document = await this._connection
        .collection<Document>("rentals")
        .findOne({
          scooter_id: new ObjectId(scooterId),
          user_id: new ObjectId(userId),
          date_finished: null,
        });

      return !!document;
    } catch {
      throw new DataAccessError("Не удалось проверить аренду");
    }
  }
}

export { RentalMongoRepo };
