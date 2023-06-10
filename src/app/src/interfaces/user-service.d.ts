import { User, UserId } from "../models/user";

import { UpdateUserDto } from "../dto/update-user";

interface IUserService {
  get(): Promise<User[]>;
  getInfo(id: UserId): Promise<User>;
  updateInfo(id: UserId, updateUserDto: UpdateUserDto): Promise<void>;
  block(id: UserId): Promise<void>;
}

export { IUserService };
