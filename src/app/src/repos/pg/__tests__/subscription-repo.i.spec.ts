/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";

import { Subscription } from "../../../models/subscription";

import { SubscriptionPGRepo } from "../subscription-repo";

const pgPool = createPgPool();

const subscriptionRepo = new SubscriptionPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE subscriptions CASCADE");
});

it("Сохраняет подписку", async () => {
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });

  await subscriptionRepo.save(subscription);
});

it("Возвращает подписку по идентификатору", async () => {
  const subscription = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  await subscriptionRepo.save(subscription);

  await expect(subscriptionRepo.getById(subscription.id)).resolves.toEqual(
    subscription
  );
});

it("Возвращает список подписок", async () => {
  const subscriptionA = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const subscriptionB = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка 2",
    price: 2000,
    duration: 2 * 24 * 60 * 60,
  });
  await subscriptionRepo.save(subscriptionA);
  await subscriptionRepo.save(subscriptionB);

  const subscriptions = await subscriptionRepo.get();
  expect(subscriptions).toHaveLength(2);
  expect(subscriptions[0]).toHaveProperty("id", subscriptionA.id);
  expect(subscriptions[1]).toHaveProperty("id", subscriptionB.id);
});

it("Удаляет подписку", async () => {
  const subscriptionA = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка",
    price: 1000,
    duration: 24 * 60 * 60,
  });
  const subscriptionB = new Subscription({
    id: subscriptionRepo.nextId(),
    title: "Тестовая подписка 2",
    price: 2000,
    duration: 2 * 24 * 60 * 60,
  });
  await subscriptionRepo.save(subscriptionA);
  await subscriptionRepo.save(subscriptionB);

  await subscriptionRepo.remove(subscriptionB.id);

  const subscriptions = await subscriptionRepo.get();
  expect(subscriptions).toHaveLength(1);
  expect(subscriptions[0]).toHaveProperty("id", subscriptionA.id);
});
