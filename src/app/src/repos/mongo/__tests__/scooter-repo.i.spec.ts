/**
 * @group integration
 */

import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";
import { ScooterModelRepo } from "../../../interfaces/scooter-model-repo";
import { ScooterRepo } from "../../../interfaces/scooter-repo";

import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";
import { ScooterModelMongoRepo } from "../scooter-model-repo";
import { ScooterMongoRepo } from "../scooter-repo";

let mongoConnection: MongoConnection;

let scooterManufacturerRepo: ScooterManufacturerRepo,
  scooterModelRepo: ScooterModelRepo,
  scooterRepo: ScooterRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
  scooterModelRepo = new ScooterModelMongoRepo(mongoConnection);
  scooterRepo = new ScooterMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("scooterManufacturers").deleteMany();
  await mongoConnection.collection("scooterModels").deleteMany();
  await mongoConnection.collection("scooters").deleteMany();
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
