/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";

import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";
import { ScooterModelPGRepo } from "../scooter-model-repo";
import { ScooterPGRepo } from "../scooter-repo";

const pgPool = createPgPool();

const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);
const scooterModelRepo = new ScooterModelPGRepo(pgPool);
const scooterRepo = new ScooterPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query(
    "TRUNCATE scooter_manufacturers, scooter_models, scooters CASCADE"
  );
});

it("Сохраняет самокат", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Ninebot",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Max Plus",
    singleChargeMileage: 50,
    maxSpeed: 25,
    weight: 15,
    maxLoad: 100,
    year: 2021,
    manufacturerId: scooterManufacturer.id,
  });
  const scooter = new Scooter({
    id: scooterRepo.nextId(),
    modelId: scooterModel.id,
    status: "enabled",
    number: "XYZ",
  });
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);

  await scooterRepo.save(scooter);
});

it("Возвращает самокат по идентификатору", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Ninebot",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Max Plus",
    singleChargeMileage: 50,
    maxSpeed: 25,
    weight: 15,
    maxLoad: 100,
    year: 2021,
    manufacturerId: scooterManufacturer.id,
  });
  const scooter = new Scooter({
    id: scooterRepo.nextId(),
    modelId: scooterModel.id,
    status: "enabled",
    number: "XYZ",
  });
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);

  await expect(scooterRepo.getById(scooter.id)).resolves.toHaveProperty(
    "number",
    "XYZ"
  );
});
