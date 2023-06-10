/**
 * @group unit
 */

import { User } from "../../models/user";
import { Subscription } from "../../models/subscription";

import { PurchasedSubscription } from "../../vo/purchased-subscription";

import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { SubscriptionMockRepo } from "../../repos/__mocks__/subscription-repo";
import { PurchasedSubscriptionMockRepo } from "../../repos/__mocks__/purchased-subscription-repo";
import { SettingMockRepo } from "../../repos/__mocks__/setting-repo";

import { BillingMockGateway } from "../../gateways/__mocks__/billing";

import { TariffService } from "../tariff";
import { SubscriptionService } from "../subscription";

const getMocks = () => {
  const userRepo = new UserMockRepo();
  const subscriptionRepo = new SubscriptionMockRepo();
  const purchasedSubscriptionRepo = new PurchasedSubscriptionMockRepo();
  const billingGateway = new BillingMockGateway();
  const settingRepo = new SettingMockRepo();
  const subscriptionService = new SubscriptionService({
    userRepo,
    subscriptionRepo,
    purchasedSubscriptionRepo,
    billingGateway,
  });
  const tariffService = new TariffService({ settingRepo, subscriptionService });

  return {
    tariffService,
    subscriptionService,
    settingRepo,
    billingGateway,
    purchasedSubscriptionRepo,
    subscriptionRepo,
    userRepo,
  };
};

describe("get", () => {
  it("Возвращает тариф в соответствии с настройками, если нет активной подписки", async () => {
    const { tariffService, userRepo, settingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79999999999",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: "5000" });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: "700" });

    const tariff = await tariffService.get(user.id);

    expect(tariff).toHaveProperty("startPrice", 5000);
    expect(tariff).toHaveProperty("perMinutePrice", 700);
  });

  it("Возвращает тариф с бесплатным стартом, если есть активная подписка", async () => {
    const {
      tariffService,
      userRepo,
      settingRepo,
      subscriptionRepo,
      purchasedSubscriptionRepo,
    } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79999999999",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const subscription = new Subscription({
      id: subscriptionRepo.nextId(),
      title: "Тестовая подписка",
      price: 10000,
      duration: 24 * 60 * 60,
    });
    const purchasedSubscription: PurchasedSubscription = {
      subscriptionId: subscription.id,
      userId: user.id,
      dateFinished: new Date(
        new Date().getTime() + subscription.duration * 1000
      ),
      datePurchased: new Date(),
      dateStarted: new Date(),
    };
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: "5000" });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: "700" });
    await subscriptionRepo.save(subscription);
    await purchasedSubscriptionRepo.save(purchasedSubscription);

    const tariff = await tariffService.get(user.id);

    expect(tariff).toHaveProperty("startPrice", 0);
    expect(tariff).toHaveProperty("perMinutePrice", 700);
  });
});
