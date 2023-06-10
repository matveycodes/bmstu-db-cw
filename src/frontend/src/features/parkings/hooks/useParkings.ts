import { useQuery, UseQueryOptions } from "features/api";

import { getParkings } from "../api/parkings";

import { GetParkingsRequest } from "../types/api";
import { Parking } from "../types/parking";

type UseParkingsOptions = Omit<
  UseQueryOptions<Parking[]>,
  "queryKey" | "queryFn"
>;

const useParkings = (
  params: GetParkingsRequest,
  options?: UseParkingsOptions
) => {
  return useQuery({
    queryKey: ["parking", "list", params],
    queryFn: ({ signal }) => getParkings(params, { signal }),
    ...options,
  });
};

export { useParkings };
