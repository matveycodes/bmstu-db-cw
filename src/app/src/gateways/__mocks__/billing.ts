import { UserId } from "../../models/user";

import { BillingGateway } from "../../interfaces/billing-gateway";
import { Logger } from "../../interfaces/logger";

class BillingMockGateway implements BillingGateway {
  private _logger?: Logger;

  constructor(logger?: Logger) {
    this._logger = logger;
  }

  private log(message: string) {
    this._logger?.log(message, this.constructor.name, "verbose");
  }

  public async bill(userId: UserId, amount: number) {
    this.log(`Списание ${amount} ₽ у пользователя ${userId}`);
  }
}

export { BillingMockGateway };
