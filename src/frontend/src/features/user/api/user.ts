import { client, RequestConfig } from "features/api";

import { User } from "../types/user";
import { GetCurrentUserResponse, UpdateCurrentUserBody } from "../types/api";

const getCurrentUser = async (
  config?: Omit<RequestConfig, "params">
): Promise<User> => {
  const { data } = await client.get<GetCurrentUserResponse>(
    "/users/current/",
    config
  );

  return data;
};

const updateCurrentUser = async (body: UpdateCurrentUserBody) => {
  await client.patch("/users/current/", body);
};

export { getCurrentUser, updateCurrentUser };
