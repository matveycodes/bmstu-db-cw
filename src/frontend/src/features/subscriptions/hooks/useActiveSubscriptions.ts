import { useQuery, UseQueryOptions } from "features/api";

import { getActiveSubscriptions } from "../api/subscriptions";

import { PurchasedSubscription } from "../types/purchased-subscription";

type UseActiveSubscriptionsOptions = Omit<
  UseQueryOptions<PurchasedSubscription[]>,
  "queryKey" | "queryFn"
>;

const useActiveSubscriptions = (options?: UseActiveSubscriptionsOptions) => {
  return useQuery({
    queryKey: ["subscription", "list", "active"],
    queryFn: ({ signal }) => getActiveSubscriptions({ signal }),
    ...options,
  });
};

export { useActiveSubscriptions };
