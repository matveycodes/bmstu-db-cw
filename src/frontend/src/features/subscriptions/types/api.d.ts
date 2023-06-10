import { Response } from "features/api";

import { Subscription } from "./subscription";
import { PurchasedSubscription } from "./purchased-subscription";

type GetSubscriptionsResponse = Response<Subscription[]>;

type GetActiveSubscriptionsResponse = Response<PurchasedSubscription[]>;

type GetFinishedSubscriptionsResponse = Response<PurchasedSubscription[]>;

export {
  GetActiveSubscriptionsResponse,
  GetSubscriptionsResponse,
  GetFinishedSubscriptionsResponse,
};
