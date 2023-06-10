import { UserId } from "../models/user";

import { AuthToken } from "../vo/auth-token";

interface AuthTokenRepo {
  get(): Promise<AuthToken[]>;
  getByUser(userId: UserId): Promise<AuthToken[]>;
  getByValue(value: AuthToken["value"]): Promise<AuthToken>;
  save(token: AuthToken): Promise<void>;
  remove(value: AuthToken["value"]): Promise<void>;
}

export { AuthTokenRepo };
