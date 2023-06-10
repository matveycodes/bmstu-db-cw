import { Subscription, SubscriptionId } from "../models/subscription";

interface SubscriptionRepo {
  save(subscription: Subscription): Promise<void>;
  get(): Promise<Subscription[]>;
  getById(id: SubscriptionId): Promise<Subscription>;
  nextId(): SubscriptionId;
  remove(id: SubscriptionId): Promise<void>;
}

export { SubscriptionRepo };
