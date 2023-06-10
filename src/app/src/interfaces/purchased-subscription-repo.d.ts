import { UserId } from "../models/user";

import { PurchasedSubscription } from "../vo/purchased-subscription";

interface PurchasedSubscriptionRepo {
  get(): Promise<PurchasedSubscription[]>;
  hasUserActiveSubscription(userId: UserId): Promise<boolean>;
  getActiveByUser(userId: UserId): Promise<PurchasedSubscription[]>;
  getLastActiveByUser(userId: UserId): Promise<PurchasedSubscription>;
  getFinishedByUser(userId: UserId): Promise<PurchasedSubscription[]>;
  save(subscription: PurchasedSubscription): Promise<void>;
}

export { PurchasedSubscriptionRepo };
