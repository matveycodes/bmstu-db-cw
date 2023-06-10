import { UserId } from "../models/user";

interface AuthToken {
  userId: UserId;
  value: string;
  dateExpired: Date;
}

export { AuthToken };
