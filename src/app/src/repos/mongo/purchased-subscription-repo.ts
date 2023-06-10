import { ObjectId, WithId } from "mongodb";

import { SubscriptionId } from "../../models/subscription";
import { UserId } from "../../models/user";

import { PurchasedSubscriptionRepo } from "../../interfaces/purchased-subscription-repo";

import { PurchasedSubscription } from "../../vo/purchased-subscription";

import { DataAccessError } from "../../errors/data-access-error";
import { NotFoundError } from "../../errors/not-found-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  subscription_id: ObjectId;
  user_id: ObjectId;
  date_started: Date;
  date_finished: Date;
  date_purchased: Date;
}

const document2model = (row: WithId<Document>) => {
  return {
    subscriptionId: row.subscription_id.toString() as SubscriptionId,
    userId: row.user_id.toString() as UserId,
    dateStarted: row.date_started,
    dateFinished: row.date_finished,
    datePurchased: row.date_purchased,
  } as PurchasedSubscription;
};

class PurchasedSubscriptionMongoRepo implements PurchasedSubscriptionRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("purchasedSubscriptions")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список купленных подписок"
      );
    }
  }

  public async getActiveByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("purchasedSubscriptions")
        .find(
          { user_id: new ObjectId(userId), date_finished: { $gt: new Date() } },
          { sort: { date_started: "asc" } }
        )
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список действующих подписок по идентификатору пользователя"
      );
    }
  }

  public async getLastActiveByUser(userId: UserId) {
    try {
      const document = await this._connection
        .collection<Document>("purchasedSubscriptions")
        .findOne(
          { user_id: new ObjectId(userId), date_finished: { $gt: new Date() } },
          { sort: { date_finished: "desc" } }
        );
      if (!document) {
        throw new NotFoundError("Подписка не найдена");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить самую позднюю активную подписку"
      );
    }
  }

  public async hasUserActiveSubscription(userId: UserId) {
    try {
      const document = await this._connection
        .collection<Document>("purchasedSubscriptions")
        .findOne({
          user_id: new ObjectId(userId),
          date_finished: { $gt: new Date() },
        });

      return !!document;
    } catch {
      throw new DataAccessError("Не удалось проверить подписку");
    }
  }

  public async getFinishedByUser(userId: UserId) {
    try {
      const documents = await this._connection
        .collection<Document>("purchasedSubscriptions")
        .find(
          { user_id: new ObjectId(userId), date_finished: { $lt: new Date() } },
          { sort: { date_finished: "desc" } }
        )
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список завершённых подписок по идентификатору пользователя"
      );
    }
  }

  public async save(subscription: PurchasedSubscription) {
    try {
      await this._connection
        .collection<Document>("purchasedSubscriptions")
        .insertOne({
          subscription_id: new ObjectId(subscription.subscriptionId),
          user_id: new ObjectId(subscription.userId),
          date_started: subscription.dateStarted,
          date_finished: subscription.dateFinished,
          date_purchased: subscription.datePurchased,
        });
    } catch {
      throw new DataAccessError("Не удалось сохранить подписку");
    }
  }
}

export { PurchasedSubscriptionMongoRepo };
