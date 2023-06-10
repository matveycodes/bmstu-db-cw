import { UserId } from "../models/user";

interface BillingGateway {
  bill(userId: UserId, amount: number): Promise<void>;
}

export { BillingGateway };
