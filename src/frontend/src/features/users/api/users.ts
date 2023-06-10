import { client, RequestConfig } from "features/api";
import { User } from "features/user";

import { GetUsersResponse } from "../types/api";

const getUsers = async (
  config?: Omit<RequestConfig, "params">
): Promise<User[]> => {
  const { data } = await client.get<GetUsersResponse>("/users/", config);

  return data;
};

const blockUser = async (id: string) => {
  await client.post(`/users/${id}/block/`);
};

export { getUsers, blockUser };
