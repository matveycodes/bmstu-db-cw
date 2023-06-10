/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { User } from "../../../models/user";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { Rental } from "../../../models/rental";

import { RentalPGRepo } from "../rental-repo";
import { UserPGRepo } from "../user-repo";
import { ScooterPGRepo } from "../scooter-repo";
import { ScooterModelPGRepo } from "../scooter-model-repo";
import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";

const pgPool = createPgPool();

const rentalRepo = new RentalPGRepo(pgPool);
const userRepo = new UserPGRepo(pgPool);
const scooterRepo = new ScooterPGRepo(pgPool);
const scooterModelRepo = new ScooterModelPGRepo(pgPool);
const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query(
    "TRUNCATE users, scooter_manufacturers, scooter_models, scooters, rentals CASCADE"
  );
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
