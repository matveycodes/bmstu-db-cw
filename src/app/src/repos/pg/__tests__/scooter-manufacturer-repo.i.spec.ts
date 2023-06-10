/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";

import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";

const pgPool = createPgPool();

const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE scooter_manufacturers CASCADE");
});

it("Сохраняет производителя самокатов", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Xiaomi",
  });

  await scooterManufacturerRepo.save(scooterManufacturer);
});

it("Возвращает производителя самокатов по идентификатору", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Xiaomi",
  });
  await scooterManufacturerRepo.save(scooterManufacturer);

  await expect(
    scooterManufacturerRepo.getById(scooterManufacturer.id)
  ).resolves.toHaveProperty("id", scooterManufacturer.id);
});
