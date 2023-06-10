import { ObjectId, WithId } from "mongodb";

import { Subscription, SubscriptionId } from "../../models/subscription";

import { SubscriptionRepo } from "../../interfaces/subscription-repo";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  title: string;
  duration: number;
  price: number;
}

const document2model = (document: WithId<Document>) => {
  return new Subscription({
    id: document._id.toString() as SubscriptionId,
    title: document.title,
    price: document.price,
    duration: document.duration,
  });
};

class SubscriptionMongoRepo implements SubscriptionRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as SubscriptionId;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("subscriptions")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список подписок");
    }
  }

  public async save(subscription: Subscription) {
    try {
      await this._connection.collection<Document>("subscriptions").updateOne(
        { _id: new ObjectId(subscription.id) },
        {
          $set: {
            title: subscription.title,
            price: subscription.price,
            duration: subscription.duration,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить подписку");
    }
  }

  public async remove(id: SubscriptionId) {
    try {
      await this._connection
        .collection<Document>("subscriptions")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить подписку");
    }
  }

  public async getById(id: SubscriptionId) {
    try {
      const document = await this._connection
        .collection<Document>("subscriptions")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Подписка не найдена");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить подписку по идентификатору"
      );
    }
  }
}

export { SubscriptionMongoRepo };
