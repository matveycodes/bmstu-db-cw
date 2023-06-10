import { useQuery, UseQueryOptions } from "features/api";

import { getActiveRentals } from "../api/rentals";

import { Rental } from "../types/rental";

type UseActiveRentalsOptions = Omit<
  UseQueryOptions<Rental[]>,
  "queryKey" | "queryFn"
>;

const useActiveRentals = (options?: UseActiveRentalsOptions) => {
  return useQuery({
    queryKey: ["rental", "list", "active"],
    queryFn: ({ signal }) => getActiveRentals({ signal }),
    ...options,
  });
};

export { useActiveRentals };
