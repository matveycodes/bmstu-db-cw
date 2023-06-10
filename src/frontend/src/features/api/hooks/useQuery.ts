import {
  useQuery as useReactQuery,
  UseQueryOptions as UseReactQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { SetRequired } from "type-fest";

import { Response } from "../types/response";

type UseQueryOptions<TData> = SetRequired<
  UseReactQueryOptions<Response<TData>, unknown, Response<TData>, unknown[]>,
  "queryKey"
>;

type UseQueryReturn<TData> = UseQueryResult<Response<TData>> & {
  queryKey: unknown[];
};

const useQuery = <TData>(
  options: UseQueryOptions<TData>
): UseQueryReturn<TData> => {
  const query = useReactQuery(options);

  return { ...query, queryKey: options.queryKey };
};

export { useQuery };
export type { UseQueryOptions, UseQueryReturn };
