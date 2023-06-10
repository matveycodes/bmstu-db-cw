import { useQuery, UseQueryOptions } from "features/api";

import { getRentalsHistory } from "../api/rentals";

import { Rental } from "../types/rental";

type UseRentalsHistoryOptions = Omit<
  UseQueryOptions<Rental[]>,
  "queryKey" | "queryFn"
>;

const useRentalsHistory = (options?: UseRentalsHistoryOptions) => {
  return useQuery({
    queryKey: ["rental", "list", "history"],
    queryFn: ({ signal }) => getRentalsHistory({ signal }),
    ...options,
  });
};

export { useRentalsHistory };
