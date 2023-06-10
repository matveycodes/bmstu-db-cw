/**
 * @group integration
 */

import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { ScooterModelRepo } from "../../../interfaces/scooter-model-repo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";

import { ScooterModelMongoRepo } from "../scooter-model-repo";
import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";

let mongoConnection: MongoConnection;

let scooterModelRepo: ScooterModelRepo,
  scooterManufacturerRepo: ScooterManufacturerRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  scooterModelRepo = new ScooterModelMongoRepo(mongoConnection);
  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("scooterModels").deleteMany();
  await mongoConnection.collection("scooterManufacturers").deleteMany();
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
