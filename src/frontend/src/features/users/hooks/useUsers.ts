import { useQuery, UseQueryOptions } from "features/api";
import { User } from "features/user";

import { getUsers } from "../api/users";

type UseUsersOptions = Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">;

const useUsers = (options?: UseUsersOptions) => {
  return useQuery({
    queryKey: ["user", "list"],
    queryFn: ({ signal }) => getUsers({ signal }),
    ...options,
  });
};

export { useUsers };
