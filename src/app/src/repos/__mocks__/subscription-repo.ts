import * as crypto from "crypto";

import { Subscription, SubscriptionId } from "../../models/subscription";
import { SubscriptionRepo } from "../../interfaces/subscription-repo";
import { NotFoundError } from "../../errors/not-found-error";

class SubscriptionMockRepo implements SubscriptionRepo {
  private _subscriptions: Subscription[] = [];

  public async get() {
    return this._subscriptions;
  }

  public async getById(id: SubscriptionId) {
    const subscription = this._subscriptions.find((s) => s.id === id);

    return (
      subscription || Promise.reject(new NotFoundError("Подписка не найдена"))
    );
  }

  public nextId() {
    return crypto.randomUUID() as SubscriptionId;
  }

  public async remove(id: SubscriptionId) {
    this._subscriptions = this._subscriptions.filter((s) => s.id !== id);
  }

  public async save(subscription: Subscription) {
    await this.remove(subscription.id);
    this._subscriptions.push(subscription);
  }
}

export { SubscriptionMockRepo };
