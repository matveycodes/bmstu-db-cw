/**
 * @group integration
 */

import { User } from "../../../models/user";
import { Subscription } from "../../../models/subscription";

import { PurchasedSubscription } from "../../../vo/purchased-subscription";

import { createPgPool } from "../../../db/pg";

import { PurchasedSubscriptionPGRepo } from "../purchased-subscription-repo";
import { SubscriptionPGRepo } from "../subscription-repo";
import { UserPGRepo } from "../user-repo";

const pgPool = createPgPool();

const purchasedSubscriptionRepo = new PurchasedSubscriptionPGRepo(pgPool);
const subscriptionRepo = new SubscriptionPGRepo(pgPool);
const userRepo = new UserPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query(
    "TRUNCATE subscriptions, purchased_subscriptions, users CASCADE"
  );
});

it("Сохраняет купленную пользователем подписку", async () => {
  const user = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscription: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  await userRepo.save(user);
  await subscriptionRepo.save(subscription);

  await purchasedSubscriptionRepo.save(purchasedSubscription);
});

it("Возвращает завершенные подписки пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscriptionA: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date("2001-01-01T12:00:00"),
    dateFinished: new Date("2001-01-02T12:00:00"),
    datePurchased: new Date("2001-01-01T12:00:00"),
  };
  const purchasedSubscriptionB: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  await userRepo.save(user);
  await subscriptionRepo.save(subscription);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionA);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionB);

  const finished = await purchasedSubscriptionRepo.getFinishedByUser(user.id);

  expect(finished).toHaveLength(1);
  expect(finished[0]).toEqual(purchasedSubscriptionA);
});

it("Проверяет, есть ли пользователя активная подписка", async () => {
  const userA = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const userB = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999998",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscriptionA: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: userA.id,
    dateStarted: new Date("2001-01-01T12:00:00"),
    dateFinished: new Date("2001-01-02T12:00:00"),
    datePurchased: new Date("2001-01-01T12:00:00"),
  };
  const purchasedSubscriptionB: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: userB.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  await userRepo.save(userA);
  await userRepo.save(userB);
  await subscriptionRepo.save(subscription);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionA);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionB);

  await expect(
    purchasedSubscriptionRepo.hasUserActiveSubscription(userA.id)
  ).resolves.toBe(false);
  await expect(
    purchasedSubscriptionRepo.hasUserActiveSubscription(userB.id)
  ).resolves.toBe(true);
});

it("Возвращает последнюю активную подписку пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscriptionA: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(new Date().getTime() + subscription.duration * 1000),
    dateFinished: new Date(
      new Date().getTime() + 2 * subscription.duration * 1000
    ),
    datePurchased: new Date(),
  };
  const purchasedSubscriptionB: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  await userRepo.save(user);
  await subscriptionRepo.save(subscription);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionA);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionB);

  await expect(
    purchasedSubscriptionRepo.getLastActiveByUser(user.id)
  ).resolves.toEqual(purchasedSubscriptionA);
});

it("Возвращает все активные подписки пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscriptionA: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(new Date().getTime() + subscription.duration * 1000),
    dateFinished: new Date(
      new Date().getTime() + 2 * subscription.duration * 1000
    ),
    datePurchased: new Date(),
  };
  const purchasedSubscriptionB: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  const purchasedSubscriptionC: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: user.id,
    dateStarted: new Date("2001-01-01T12:00:00"),
    dateFinished: new Date("2001-02-01T12:00:00"),
    datePurchased: new Date("2001-01-01T12:00:00"),
  };
  await userRepo.save(user);
  await subscriptionRepo.save(subscription);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionA);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionB);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionC);

  const active = await purchasedSubscriptionRepo.getActiveByUser(user.id);

  expect(active).toHaveLength(2);
  expect(active).toContainEqual(purchasedSubscriptionA);
  expect(active).toContainEqual(purchasedSubscriptionB);
});

it("Возвращает все купленные подписки", async () => {
  const userA = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999999",
  });
  const userB = new User({
    id: userRepo.nextId(),
    status: "active",
    role: "customer",
    dateJoined: new Date(),
    phone: "79999999998",
  });
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const purchasedSubscriptionA: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: userA.id,
    dateStarted: new Date(new Date().getTime() + subscription.duration * 1000),
    dateFinished: new Date(
      new Date().getTime() + 2 * subscription.duration * 1000
    ),
    datePurchased: new Date(),
  };
  const purchasedSubscriptionB: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: userB.id,
    dateStarted: new Date(),
    dateFinished: new Date(new Date().getTime() + subscription.duration * 1000),
    datePurchased: new Date(),
  };
  const purchasedSubscriptionC: PurchasedSubscription = {
    subscriptionId: subscription.id,
    userId: userA.id,
    dateStarted: new Date("2001-01-01T12:00:00"),
    dateFinished: new Date("2001-02-01T12:00:00"),
    datePurchased: new Date("2001-01-01T12:00:00"),
  };
  await userRepo.save(userA);
  await userRepo.save(userB);
  await subscriptionRepo.save(subscription);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionA);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionB);
  await purchasedSubscriptionRepo.save(purchasedSubscriptionC);

  const all = await purchasedSubscriptionRepo.get();

  expect(all).toHaveLength(3);
  expect(all).toContainEqual(purchasedSubscriptionA);
  expect(all).toContainEqual(purchasedSubscriptionB);
  expect(all).toContainEqual(purchasedSubscriptionC);
});
