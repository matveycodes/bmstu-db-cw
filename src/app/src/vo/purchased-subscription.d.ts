import { SubscriptionId } from "../models/subscription";
import { UserId } from "../models/user";

interface PurchasedSubscription {
  subscriptionId: SubscriptionId;
  userId: UserId;
  datePurchased: Date;
  dateStarted: Date;
  dateFinished: Date;
}

export { PurchasedSubscription };
