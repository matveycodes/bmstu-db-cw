import { useQuery, UseQueryOptions } from "features/api";

import { getFinishedSubscriptions } from "../api/subscriptions";

import { PurchasedSubscription } from "../types/purchased-subscription";

type UseFinishedSubscriptionsOptions = Omit<
  UseQueryOptions<PurchasedSubscription[]>,
  "queryKey" | "queryFn"
>;

const useFinishedSubscriptions = (
  options?: UseFinishedSubscriptionsOptions
) => {
  return useQuery({
    queryKey: ["subscription", "list", "finished"],
    queryFn: ({ signal }) => getFinishedSubscriptions({ signal }),
    ...options,
  });
};

export { useFinishedSubscriptions };
