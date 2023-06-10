import { Subscription } from "./subscription";

interface PurchasedSubscription {
  date_started: string;
  date_finished: string;
  date_purchased: string;
  subscription: Subscription;
}

export { PurchasedSubscription };
