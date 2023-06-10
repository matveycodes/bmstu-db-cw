/**
 * @group integration
 */

import { Booking } from "../../../models/booking";
import { User } from "../../../models/user";
import { ScooterManufacturer } from "../../../models/scooter-manufacturer";
import { ScooterModel } from "../../../models/scooter-model";
import { Scooter } from "../../../models/scooter";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { BookingRepo } from "../../../interfaces/booking-repo";
import { UserRepo } from "../../../interfaces/user-repo";
import { ScooterRepo } from "../../../interfaces/scooter-repo";
import { ScooterModelRepo } from "../../../interfaces/scooter-model-repo";
import { ScooterManufacturerRepo } from "../../../interfaces/scooter-manufacturer-repo";

import { BookingMongoRepo } from "../booking-repo";
import { UserMongoRepo } from "../user-repo";
import { ScooterMongoRepo } from "../scooter-repo";
import { ScooterModelMongoRepo } from "../scooter-model-repo";
import { ScooterManufacturerMongoRepo } from "../scooter-manufacturer-repo";

let mongoConnection: MongoConnection;
let bookingRepo: BookingRepo,
  userRepo: UserRepo,
  scooterRepo: ScooterRepo,
  scooterModelRepo: ScooterModelRepo,
  scooterManufacturerRepo: ScooterManufacturerRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  bookingRepo = new BookingMongoRepo(mongoConnection);
  userRepo = new UserMongoRepo(mongoConnection);
  scooterRepo = new ScooterMongoRepo(mongoConnection);
  scooterModelRepo = new ScooterModelMongoRepo(mongoConnection);
  scooterManufacturerRepo = new ScooterManufacturerMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("bookings").deleteMany();
  await mongoConnection.collection("users").deleteMany();
  await mongoConnection.collection("scooters").deleteMany();
  await mongoConnection.collection("scooterModels").deleteMany();
  await mongoConnection.collection("scooterManufacturers").deleteMany();
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
