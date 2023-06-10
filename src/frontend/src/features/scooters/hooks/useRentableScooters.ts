import { useQuery, UseQueryOptions } from "features/api";

import { getRentableScooters } from "../api/scooters";

import { Scooter } from "../types/scooter";
import { GetRentableScootersRequest } from "../types/api";

type UseRentableScootersOptions = Omit<
  UseQueryOptions<Scooter[]>,
  "queryKey" | "queryFn"
>;

const useRentableScooters = (
  params: GetRentableScootersRequest,
  options?: UseRentableScootersOptions
) => {
  return useQuery({
    queryKey: ["scooter", "list", "rentable", params],
    queryFn: ({ signal }) => getRentableScooters(params, { signal }),
    ...options,
  });
};

export { useRentableScooters };
