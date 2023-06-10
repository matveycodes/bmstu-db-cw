import { useQuery, UseQueryOptions } from "features/api";

import { getDischargedScooters } from "../api/scooters";

import { Scooter } from "../types/scooter";
import { GetDischargedScootersRequest } from "../types/api";

type UseDischargedScootersOptions = Omit<
  UseQueryOptions<Scooter[]>,
  "queryKey" | "queryFn"
>;

const useDischargedScooters = (
  params: GetDischargedScootersRequest,
  options?: UseDischargedScootersOptions
) => {
  return useQuery({
    queryKey: ["scooter", "list", "discharged", params],
    queryFn: ({ signal }) => getDischargedScooters(params, { signal }),
    ...options,
  });
};

export { useDischargedScooters };
