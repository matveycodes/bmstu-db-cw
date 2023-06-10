import { Subscription, SubscriptionId } from "../models/subscription";
import { UserId } from "../models/user";

import { PurchasedSubscription } from "../vo/purchased-subscription";

interface ISubscriptionService {
  get(): Promise<Subscription[]>;
  getById(id: SubscriptionId): Promise<Subscription>;
  hasUserActiveSubscription(userId: UserId): Promise<boolean>;
  getActive(userId: UserId): Promise<PurchasedSubscription[]>;
  getFinished(userId: UserId): Promise<PurchasedSubscription[]>;
  purchase(id: SubscriptionId, userId: UserId): Promise<void>;
}

export { ISubscriptionService };
