import { client, RequestConfig } from "features/api";

import {
  GetActiveSubscriptionsResponse,
  GetFinishedSubscriptionsResponse,
  GetSubscriptionsResponse,
} from "../types/api";
import { Subscription } from "../types/subscription";
import { PurchasedSubscription } from "../types/purchased-subscription";

const getSubscriptions = async (
  config?: Omit<RequestConfig, "params">
): Promise<Subscription[]> => {
  const { data } = await client.get<GetSubscriptionsResponse>(
    "/subscriptions/",
    config
  );

  return data;
};

const getActiveSubscriptions = async (
  config?: Omit<RequestConfig, "params">
): Promise<PurchasedSubscription[]> => {
  const { data } = await client.get<GetActiveSubscriptionsResponse>(
    "/subscriptions/active/",
    config
  );

  return data;
};

const getFinishedSubscriptions = async (
  config?: Omit<RequestConfig, "params">
): Promise<PurchasedSubscription[]> => {
  const { data } = await client.get<GetFinishedSubscriptionsResponse>(
    "/subscriptions/finished/",
    config
  );

  return data;
};

const purchaseSubscription = async (id: string) => {
  await client.post(`/subscriptions/${id}/purchase/`);
};

export {
  getSubscriptions,
  purchaseSubscription,
  getActiveSubscriptions,
  getFinishedSubscriptions,
};
