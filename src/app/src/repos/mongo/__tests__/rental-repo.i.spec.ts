/**
 * @group integration
 */

import { User } from "../../../models/user";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { Rental } from "../../../models/rental";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { RentalRepo } from "../../../interfaces/rental-repo";
import { UserRepo } from "../../../interfaces/user-repo";
import { ScooterRepo } from "../../../interfaces/scooter-repo";
import { ScooterModelRepo } from "../../../interfaces/scooter-model-repo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";

import { RentalMongoRepo } from "../rental-repo";
import { UserMongoRepo } from "../user-repo";
import { ScooterMongoRepo } from "../scooter-repo";
import { ScooterModelMongoRepo } from "../scooter-model-repo";
import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";

let mongoConnection: MongoConnection;

let rentalRepo: RentalRepo,
  userRepo: UserRepo,
  scooterRepo: ScooterRepo,
  scooterModelRepo: ScooterModelRepo,
  scooterManufacturerRepo: ScooterManufacturerRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  rentalRepo = new RentalMongoRepo(mongoConnection);
  userRepo = new UserMongoRepo(mongoConnection);
  scooterRepo = new ScooterMongoRepo(mongoConnection);
  scooterModelRepo = new ScooterModelMongoRepo(mongoConnection);
  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("rentals").deleteMany();
  await mongoConnection.collection("users").deleteMany();
  await mongoConnection.collection("scooters").deleteMany();
  await mongoConnection.collection("scooterModels").deleteMany();
  await mongoConnection.collection("scooterManufacturers").deleteMany();
});

it("Сохраняет аренду", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
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
  const rental = new Rental({
    scooterId: scooter.id,
    userId: user.id,
    dateStarted: new Date("2022-01-01T15:40:01"),
    perMinutePrice: 6,
    startPrice: 10,
    id: rentalRepo.nextId(),
  });
  await userRepo.save(user);
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);

  await rentalRepo.save(rental);
});

it("Возвращает незавершенные аренды пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
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
  const rental = new Rental({
    scooterId: scooter.id,
    userId: user.id,
    dateStarted: new Date("2022-01-01T15:40:01"),
    perMinutePrice: 6,
    startPrice: 10,
    id: rentalRepo.nextId(),
  });
  await userRepo.save(user);
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);
  await rentalRepo.save(rental);

  const rentals = await rentalRepo.getActiveByUser(user.id);

  expect(rentals).toHaveLength(1);
  expect(rentals[0]).toHaveProperty("id", rental.id);
});
