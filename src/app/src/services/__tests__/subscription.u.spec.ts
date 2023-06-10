/**
 * @group unit
 */

import { Subscription } from "../../models/subscription";
import { User } from "../../models/user";

import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { SubscriptionMockRepo } from "../../repos/__mocks__/subscription-repo";
import { PurchasedSubscriptionMockRepo } from "../../repos/__mocks__/purchased-subscription-repo";
import { SettingMockRepo } from "../../repos/__mocks__/setting-repo";

import { BillingMockGateway } from "../../gateways/__mocks__/billing";

import { PermissionError } from "../../errors/permission-error";

import { SubscriptionService } from "../subscription";

beforeAll(() => {
  jest.useFakeTimers({ now: new Date("2022-01-01") });
});

afterAll(() => {
  jest.useRealTimers();
});

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

  return {
    subscriptionService,
    settingRepo,
    billingGateway,
    purchasedSubscriptionRepo,
    subscriptionRepo,
    userRepo,
  };
};

describe("purchase", () => {
  it("Бросает исключение, если неактивный пользователь покупает подписку", async () => {
    const { subscriptionService, userRepo, settingRepo, subscriptionRepo } =
      getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79999999999",
      status: "pending",
      role: "customer",
      dateJoined: new Date(),
    });
    const subscription = new Subscription({
      id: subscriptionRepo.nextId(),
      title: "Тестовая подписка",
      price: 10000,
      duration: 24 * 60 * 60,
    });
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: "5000" });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: "700" });
    await subscriptionRepo.save(subscription);

    await expect(
      subscriptionService.purchase(subscription.id, user.id)
    ).rejects.toThrow(PermissionError);
  });

  it("Успешно оформляет первую активную подписку", async () => {
    const {
      subscriptionService,
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
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: "5000" });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: "700" });
    await subscriptionRepo.save(subscription);

    await subscriptionService.purchase(subscription.id, user.id);

    const active = await purchasedSubscriptionRepo.getActiveByUser(user.id);

    expect(active).toHaveLength(1);
    expect(active[0]).toHaveProperty("subscriptionId", subscription.id);
    expect(active[0]).toHaveProperty("datePurchased", new Date());
    expect(active[0]).toHaveProperty(
      "dateFinished",
      new Date(new Date().getTime() + subscription.duration * 1000)
    );
    expect(active[0]).toHaveProperty("dateStarted", new Date());
  });

  it("Успешно оформляет еще одну активную подписку, сдвигая дату начала", async () => {
    const {
      subscriptionService,
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
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: "5000" });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: "700" });
    await subscriptionRepo.save(subscription);

    await subscriptionService.purchase(subscription.id, user.id);
    await subscriptionService.purchase(subscription.id, user.id);

    const active = await purchasedSubscriptionRepo.getActiveByUser(user.id);

    expect(active).toHaveLength(2);
    expect(active[0]).toHaveProperty("datePurchased", new Date());
    expect(active[0]).toHaveProperty(
      "dateFinished",
      new Date(new Date().getTime() + subscription.duration * 1000)
    );
    expect(active[0]).toHaveProperty("dateStarted", new Date());
    expect(active[1]).toHaveProperty("datePurchased", new Date());
    expect(active[1]).toHaveProperty(
      "dateFinished",
      new Date(new Date().getTime() + 2 * subscription.duration * 1000)
    );
    expect(active[1]).toHaveProperty(
      "dateStarted",
      new Date(new Date().getTime() + subscription.duration * 1000)
    );
  });
});
