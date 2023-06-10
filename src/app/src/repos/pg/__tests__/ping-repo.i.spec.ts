/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { Ping } from "../../../vo/ping";

import { PingPGRepo } from "../ping-repo";
import { ScooterPGRepo } from "../scooter-repo";
import { ScooterModelPGRepo } from "../scooter-model-repo";
import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";

const pgPool = createPgPool();

const pingRepo = new PingPGRepo(pgPool);
const scooterRepo = new ScooterPGRepo(pgPool);
const scooterModelRepo = new ScooterModelPGRepo(pgPool);
const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query(
    "TRUNCATE scooter_manufacturers, scooter_models, scooters, pings CASCADE"
  );
});

it("Сохраняет пинг", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Manufacturer",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Model",
    singleChargeMileage: 10,
    weight: 20,
    maxSpeed: 25,
    maxLoad: 100,
    manufacturerId: scooterManufacturer.id,
    year: 2020,
  });
  const scooter = new Scooter({
    id: scooterRepo.nextId(),
    number: "XYZ",
    modelId: scooterModel.id,
    status: "enabled",
  });
  const ping: Ping = {
    date: new Date(),
    scooterId: scooter.id,
    location: { longitude: 37.68508, latitude: 55.76592 },
    lockState: "locked",
    lightsState: "off",
    batteryLevel: 95,
  };
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);

  await pingRepo.save(ping);
});

it("Возвращает последний пинг самоката", async () => {
  const scooterManufacturer = new ScooterManufacturer({
    id: scooterManufacturerRepo.nextId(),
    title: "Manufacturer",
  });
  const scooterModel = new ScooterModel({
    id: scooterModelRepo.nextId(),
    title: "Model",
    singleChargeMileage: 10,
    weight: 20,
    maxSpeed: 25,
    maxLoad: 100,
    manufacturerId: scooterManufacturer.id,
    year: 2020,
  });
  const scooter = new Scooter({
    id: scooterRepo.nextId(),
    number: "XYZ",
    modelId: scooterModel.id,
    status: "enabled",
  });
  const pingA: Ping = {
    date: new Date("2022-01-01T00:00:00"),
    scooterId: scooter.id,
    location: { longitude: 37.68508, latitude: 55.76592 },
    lockState: "locked",
    lightsState: "off",
    batteryLevel: 95,
  };
  const pingB: Ping = {
    date: new Date("2022-01-01T00:00:05"),
    scooterId: scooter.id,
    location: { longitude: 37.68508, latitude: 55.76592 },
    lockState: "unlocked",
    lightsState: "off",
    batteryLevel: 95,
  };
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);
  await pingRepo.save(pingA);
  await pingRepo.save(pingB);

  await expect(pingRepo.getLatestByScooter(scooter.id)).resolves.toHaveProperty(
    "lockState",
    "unlocked"
  );
});
