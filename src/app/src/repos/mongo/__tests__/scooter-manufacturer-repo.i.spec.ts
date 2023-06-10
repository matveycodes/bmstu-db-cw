/**
 * @group integration
 */

import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";

import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";

let mongoConnection: MongoConnection;

let scooterManufacturerRepo: ScooterManufacturerRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("scooterManufacturers").deleteMany();
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
