import { useQuery, UseQueryOptions } from "features/api";

import { getSubscriptions } from "../api/subscriptions";

import { Subscription } from "../types/subscription";

type UseSubscriptionsOptions = Omit<
  UseQueryOptions<Subscription[]>,
  "queryKey" | "queryFn"
>;

const useSubscriptions = (options?: UseSubscriptionsOptions) => {
  return useQuery({
    queryKey: ["subscription", "list"],
    queryFn: ({ signal }) => getSubscriptions({ signal }),
    ...options,
  });
};

export { useSubscriptions };
