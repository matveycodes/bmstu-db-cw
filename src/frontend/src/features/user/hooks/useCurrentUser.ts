import { useQuery, UseQueryOptions } from "features/api";

import { getCurrentUser } from "../api/user";

import { User } from "../types/user";

type UseCurrentUserOptions = Omit<
  UseQueryOptions<User>,
  "queryKey" | "queryFn"
>;

const useCurrentUser = (options?: UseCurrentUserOptions) => {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: ({ signal }) => getCurrentUser({ signal }),
    staleTime: Infinity,
    ...options,
  });
};

export { useCurrentUser };
