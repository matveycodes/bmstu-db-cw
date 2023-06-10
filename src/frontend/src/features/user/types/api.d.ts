import { Response } from "features/api";

import { User } from "./user";

type GetCurrentUserResponse = Response<User>;

interface UpdateCurrentUserBody {
  birthdate?: string;
  middle_name?: string;
  first_name?: string;
  email?: string;
  last_name?: string;
}

export { GetCurrentUserResponse, UpdateCurrentUserBody };
