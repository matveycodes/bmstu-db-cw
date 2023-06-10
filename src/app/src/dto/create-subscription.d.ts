import { SubscriptionId } from "../models/subscription";

interface CreateSubscriptionDto {
  id: SubscriptionId;
  title: string;
  price: number;
  duration: number;
}

export { CreateSubscriptionDto };
