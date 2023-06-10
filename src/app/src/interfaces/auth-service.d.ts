import { User } from "../models/user";

interface IAuthService {
  requestAuth(phone: string): Promise<string>;
  auth(signature: string, code: number): Promise<string>;
  getUserByToken(value: string): Promise<User>;
}

export { IAuthService };
