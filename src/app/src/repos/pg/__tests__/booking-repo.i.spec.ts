/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { Booking } from "../../../models/booking";
import { User } from "../../../models/user";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";

import { ScooterManufacturerPGRepo } from "../scooter-manufacturer-repo";
import { UserPGRepo } from "../user-repo";
import { ScooterPGRepo } from "../scooter-repo";
import { ScooterModelPGRepo } from "../scooter-model-repo";
import { BookingPGRepo } from "../booking-repo";

const pgPool = createPgPool();

const bookingRepo = new BookingPGRepo(pgPool);
const userRepo = new UserPGRepo(pgPool);
const scooterRepo = new ScooterPGRepo(pgPool);
const scooterModelRepo = new ScooterModelPGRepo(pgPool);
const scooterManufacturerRepo = new ScooterManufacturerPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query(
    "TRUNCATE users, scooter_manufacturers, scooter_models, scooters, bookings CASCADE"
  );
});

it("Сохраняет бронирование", async () => {
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
  const booking = new Booking({
    id: bookingRepo.nextId(),
    userId: user.id,
    scooterId: scooter.id,
    dateStarted: new Date("2022-01-01T00:00:00"),
    dateFinished: new Date("2022-01-01T00:15:00"),
  });
  await userRepo.save(user);
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);

  await bookingRepo.save(booking);
});

it("Возвращает бронирование по идентификатору", async () => {
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
  const booking = new Booking({
    id: bookingRepo.nextId(),
    userId: user.id,
    scooterId: scooter.id,
    dateStarted: new Date("2022-01-01T00:00:00"),
    dateFinished: new Date("2022-01-01T00:15:00"),
  });
  await userRepo.save(user);
  await scooterManufacturerRepo.save(scooterManufacturer);
  await scooterModelRepo.save(scooterModel);
  await scooterRepo.save(scooter);
  await bookingRepo.save(booking);

  await expect(bookingRepo.getById(booking.id)).resolves.toHaveProperty(
    "id",
    booking.id
  );
});
