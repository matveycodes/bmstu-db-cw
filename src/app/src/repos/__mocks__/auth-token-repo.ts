import { UserId } from "../../models/user";

import { AuthTokenRepo } from "../../interfaces/auth-token-repo";

import { AuthToken } from "../../vo/auth-token";

import { NotFoundError } from "../../errors/not-found-error";

class AuthTokenMockRepo implements AuthTokenRepo {
  private _tokens: AuthToken[] = [];

  public async get() {
    return this._tokens;
  }

  public async getByUser(userId: UserId) {
    return this._tokens.filter((t) => t.userId === userId);
  }

  public async getByValue(value: AuthToken["value"]) {
    const token = this._tokens.find((t) => t.value === value);
    return token || Promise.reject(new NotFoundError("Токен не найден"));
  }

  public async save(token: AuthToken) {
    await this.remove(token.value);
    this._tokens.push(token);
  }

  public async remove(value: AuthToken["value"]) {
    this._tokens = this._tokens.filter((t) => t.value !== value);
  }
}

export { AuthTokenMockRepo };
