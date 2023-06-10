/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";

import { ScooterModelPGRepo } from "../scooter-model-repo";
import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";

const pgPool = createPgPool();

const scooterModelRepo = new ScooterModelPGRepo(pgPool);
const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE scooter_manufacturers, scooter_models CASCADE");
});

it("Сохраняет модель самоката", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Ninebot",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Max Plus",
    singleChargeMileage: 50,
    maxLoad: 100,
    manufacturerId: scooterManufacturer.id,
    maxSpeed: 25,
    weight: 15,
    year: 2021,
  });
  await scooterManufacturerRepo.save(scooterManufacturer);

  await scooterModelRepo.save(scooterModel);
});

it("Возвращает модель самоката по идентификатору", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Ninebot",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Max Plus",
    singleChargeMileage: 50,
    maxLoad: 100,
    manufacturerId: scooterManufacturer.id,
    maxSpeed: 25,
    weight: 15,
    year: 2021,
  });
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);

  await expect(
    scooterModelRepo.getById(scooterModel.id)
  ).resolves.toHaveProperty("title", "Max Plus");
});
