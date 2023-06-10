import { User, UserId } from "../models/user";

interface UserRepo {
  nextId(): UserId;
  save(user: User): Promise<void>;
  get(): Promise<User[]>;
  getById(id: UserId): Promise<User>;
  getByPhone(phone: User["phone"]): Promise<User>;
  remove(id: UserId): Promise<void>;
}

export { UserRepo };
