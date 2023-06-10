import { Response } from "features/api";
import { User } from "features/user";

type GetUsersResponse = Response<User[]>;

export { GetUsersResponse };
