import { SubscriptionRepo } from "../interfaces/subscription-repo";
import { PurchasedSubscriptionRepo } from "../interfaces/purchased-subscription-repo";
import { BillingGateway } from "../interfaces/billing-gateway";
import { UserRepo } from "../interfaces/user-repo";

interface CreateSubscriptionServiceDto {
  userRepo: UserRepo;
  subscriptionRepo: SubscriptionRepo;
  purchasedSubscriptionRepo: PurchasedSubscriptionRepo;
  billingGateway: BillingGateway;
}

export { CreateSubscriptionServiceDto };
