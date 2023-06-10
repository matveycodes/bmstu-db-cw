import { useQuery, UseQueryOptions } from "features/api";

import { getActiveBookings } from "../api/bookings";

import { Booking } from "../types/booking";

type UseActiveBookingsOptions = Omit<
  UseQueryOptions<Booking[]>,
  "queryKey" | "queryFn"
>;

const useActiveBookings = (options?: UseActiveBookingsOptions) => {
  return useQuery({
    queryKey: ["booking", "list", "active"],
    queryFn: ({ signal }) => getActiveBookings({ signal }),
    ...options,
  });
};

export { useActiveBookings };
