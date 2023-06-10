import * as crypto from "crypto";

import { User, UserId } from "../../models/user";

import { UserRepo } from "../../interfaces/user-repo";

import { NotFoundError } from "../../errors/not-found-error";

class UserMockRepo implements UserRepo {
  private _users: User[] = [];

  public async get() {
    return this._users;
  }

  public async getById(id: UserId) {
    const user = this._users.find((u) => u.id === id);
    return user || Promise.reject(new NotFoundError("Пользователь не найден"));
  }

  public async getByPhone(phone: User["phone"]) {
    const user = this._users.find((u) => u.phone === phone);
    return user || Promise.reject(new NotFoundError("Пользователь не найден"));
  }

  public nextId() {
    return crypto.randomUUID() as UserId;
  }

  public async remove(id: UserId) {
    this._users = this._users.filter((u) => u.id !== id);
  }

  public async save(user: User): Promise<void> {
    await this.remove(user.id);
    this._users.push(user);
  }
}

export { UserMockRepo };
