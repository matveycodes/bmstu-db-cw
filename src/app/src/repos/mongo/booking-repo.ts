import { ObjectId, WithId } from "mongodb";

import { Booking, BookingId } from "../../models/booking";
import { UserId } from "../../models/user";
import { ScooterId } from "../../models/scooter";

import { BookingRepo } from "../../interfaces/booking-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

type Document = {
  user_id: ObjectId;
  scooter_id: ObjectId;
  date_started: Date;
  date_finished: Date;
};

const document2model = (document: WithId<Document>) => {
  return new Booking({
    id: document._id.toString() as BookingId,
    userId: document.user_id.toString() as UserId,
    scooterId: document.scooter_id.toString() as ScooterId,
    dateStarted: document.date_started,
    dateFinished: document.date_finished,
  });
};

class BookingMongoRepo implements BookingRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async save(booking: Booking) {
    try {
      await this._connection.collection<Document>("bookings").updateOne(
        { _id: new ObjectId(booking.id) },
        {
          $set: {
            user_id: new ObjectId(booking.userId),
            scooter_id: new ObjectId(booking.scooterId),
            date_started: booking.dateStarted,
            date_finished: booking.dateFinished,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить бронирование");
    }
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("bookings")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список бронирований");
    }
  }

  public async getById(id: BookingId) {
    try {
      const document = await this._connection
        .collection<Document>("bookings")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Бронирование не найдено");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить бронирование по идентификатору"
      );
    }
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    try {
      const documents = await this._connection
        .collection<Document>("bookings")
        .find({
          scooter_id: new ObjectId(scooterId),
          date_finished: { $gt: new Date() },
        })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список незавершенных бронирований по идентификатору самоката"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("bookings")
        .find({
          user_id: new ObjectId(userId),
          date_finished: { $gt: new Date() },
        })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список незавершенных бронирований по идентификатору пользователя"
      );
    }
  }

  public nextId() {
    return new ObjectId().toString() as BookingId;
  }

  public async remove(id: BookingId) {
    try {
      await this._connection
        .collection<Document>("bookings")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить бронирование");
    }
  }

  public async isScooterBooked(scooterId: ScooterId, userId?: UserId) {
    try {
      const booking = await this._connection
        .collection<Document>("bookings")
        .findOne({
          scooter_id: new ObjectId(scooterId),
          user_id: new ObjectId(userId),
        });

      return !!booking;
    } catch {
      throw new DataAccessError("Не удалось проверить бронирование");
    }
  }
}

export { BookingMongoRepo };
