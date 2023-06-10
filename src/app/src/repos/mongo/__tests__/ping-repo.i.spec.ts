/**
 * @group integration
 */

import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { Ping } from "../../../vo/ping";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { PingRepo } from "../../../interfaces/ping-repo";
import { ScooterRepo } from "../../../interfaces/scooter-repo";
import { ScooterModelRepo } from "../../../interfaces/scooter-model-repo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";

import { PingMongoRepo } from "../ping-repo";
import { ScooterMongoRepo } from "../scooter-repo";
import { ScooterModelMongoRepo } from "../scooter-model-repo";
import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";

let mongoConnection: MongoConnection;

let pingRepo: PingRepo,
  scooterRepo: ScooterRepo,
  scooterModelRepo: ScooterModelRepo,
  scooterManufacturerRepo: ScooterManufacturerRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  pingRepo = new PingMongoRepo(mongoConnection);
  scooterRepo = new ScooterMongoRepo(mongoConnection);
  scooterModelRepo = new ScooterModelMongoRepo(mongoConnection);
  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("pings").deleteMany();
  await mongoConnection.collection("scooters").deleteMany();
  await mongoConnection.collection("scooterModels").deleteMany();
  await mongoConnection.collection("scooterManufacturers").deleteMany();
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
