import orderBy from "lodash/orderBy";

import { UserId } from "../../models/user";

import { PurchasedSubscriptionRepo } from "../../interfaces/purchased-subscription-repo";

import { PurchasedSubscription } from "../../vo/purchased-subscription";

class PurchasedSubscriptionMockRepo implements PurchasedSubscriptionRepo {
  private _purchasedSubscriptions: PurchasedSubscription[] = [];

  public async get() {
    return this._purchasedSubscriptions;
  }

  public async getActiveByUser(userId: UserId) {
    const now = new Date();

    return this._purchasedSubscriptions.filter((s) => {
      return s.userId === userId && s.dateFinished > now;
    });
  }

  public async getFinishedByUser(userId: UserId) {
    const now = new Date();

    return this._purchasedSubscriptions.filter((s) => {
      return s.userId === userId && s.dateFinished < now;
    });
  }

  public async getLastActiveByUser(userId: UserId) {
    const active = await this.getActiveByUser(userId);
    return orderBy(active, ["date_started", "desc"])[0];
  }

  public async hasUserActiveSubscription(userId: UserId) {
    const now = new Date();

    return !!this._purchasedSubscriptions.find((s) => {
      return s.userId === userId && s.dateFinished > now;
    });
  }

  public async save(subscription: PurchasedSubscription) {
    this._purchasedSubscriptions.push(subscription);
  }
}

export { PurchasedSubscriptionMockRepo };
