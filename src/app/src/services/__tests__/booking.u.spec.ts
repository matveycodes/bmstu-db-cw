/**
 * @group unit
 */

import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { ScooterMockRepo } from "../../repos/__mocks__/scooter-repo";
import { BookingMockRepo } from "../../repos/__mocks__/booking-repo";
import { User } from "../../models/user";
import { Scooter, ScooterId } from "../../models/scooter";
import { InvalidStateError } from "../../errors/invalid-state-error";
import { ScooterModelId } from "../../models/scooter-model";
import { Booking } from "../../models/booking";
import { SettingMockRepo } from "../../repos/__mocks__/setting-repo";
import { LimitError } from "../../errors/limit-error";
import { RentalMockRepo } from "../../repos/__mocks__/rental-repo";
import { PermissionError } from "../../errors/permission-error";
import { PingMockRepo } from "../../repos/__mocks__/ping-repo";

import { BookingService } from "../booking";

const getMocks = () => {
  const userRepo = new UserMockRepo();
  const scooterRepo = new ScooterMockRepo();
  const bookingRepo = new BookingMockRepo();
  const rentalRepo = new RentalMockRepo();
  const settingRepo = new SettingMockRepo();
  const pingRepo = new PingMockRepo();
  const bookingService = new BookingService({
    pingRepo,
    userRepo,
    scooterRepo,
    bookingRepo,
    rentalRepo,
    settingRepo,
  });

  return {
    userRepo,
    scooterRepo,
    rentalRepo,
    bookingRepo,
    bookingService,
    settingRepo,
    pingRepo,
  };
};

beforeAll(() => {
  jest.useFakeTimers({ now: new Date("2022-01-01T00:08:30") });
});

afterAll(() => {
  jest.useRealTimers();
});

describe("bookScooter", () => {
  it("Бросает исключение, если пользователь неактивен", async () => {
    const { userRepo, bookingService } = getMocks();
    const user = new User({
      phone: "79991234567",
      status: "blocked",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    await userRepo.save(user);

    await expect(
      bookingService.bookScooter(user.id, "2" as ScooterId)
    ).rejects.toThrow(PermissionError);
  });

  it("Бросает исключение, если самокат недоступен", async () => {
    const { userRepo, bookingService, scooterRepo, settingRepo } = getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      status: "disabled",
      number: "XYZ",
      modelId: "1" as ScooterModelId,
    });
    await settingRepo.save({ name: "MAX_BOOKINGS", value: 5 });
    await userRepo.save(user);
    await scooterRepo.save(scooter);

    await expect(
      bookingService.bookScooter(user.id, scooter.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Бросает исключение, если превышен лимит бронирований", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo, settingRepo } =
      getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooters = new Array(4).fill(0).map(
      () =>
        new Scooter({
          id: scooterRepo.nextId(),
          number: "XYZ",
          modelId: "1" as ScooterModelId,
          status: "enabled",
        })
    );
    const bookings = new Array(3).fill(0).map(
      (_, i) =>
        new Booking({
          id: bookingRepo.nextId(),
          userId: user.id,
          scooterId: scooters[i].id,
          dateStarted: new Date("2022-01-01T00:00:00"),
          dateFinished: new Date("2022-01-01T00:15:00"),
        })
    );
    await userRepo.save(user);
    await Promise.all(scooters.map((scooter) => scooterRepo.save(scooter)));
    await Promise.all(bookings.map((booking) => bookingRepo.save(booking)));
    await settingRepo.save({ value: 3, name: "MAX_BOOKINGS" });

    await expect(
      bookingService.bookScooter(user.id, scooters[3].id)
    ).rejects.toThrow(LimitError);
  });

  it("Бросает исключение, если самокат уже забронирован", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo, settingRepo } =
      getMocks();
    const users = new Array(2).fill(0).map(
      () =>
        new User({
          phone: "79991234567",
          status: "active",
          id: userRepo.nextId(),
          role: "customer",
          dateJoined: new Date(),
        })
    );
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const booking = new Booking({
      userId: users[0].id,
      scooterId: scooter.id,
      id: bookingRepo.nextId(),
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:00"),
    });
    await settingRepo.save({ name: "MAX_BOOKINGS", value: 5 });
    await Promise.all(users.map((user) => userRepo.save(user)));
    await scooterRepo.save(scooter);
    await bookingRepo.save(booking);

    await expect(
      bookingService.bookScooter(users[1].id, scooter.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Успешно создает бронирование", async () => {
    const { userRepo, bookingService, scooterRepo, pingRepo, settingRepo } =
      getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    await userRepo.save(user);
    await scooterRepo.save(scooter);
    await settingRepo.save({ name: "MAX_BOOKINGS", value: 5 });
    await settingRepo.save({ name: "BOOKING_DURATION", value: 15 * 60 });
    await pingRepo.save({
      scooterId: scooter.id,
      date: new Date(),
      location: { longitude: 1, latitude: 1 },
      lightsState: "off",
      lockState: "locked",
      batteryLevel: 10,
    });

    await expect(bookingService.bookScooter(user.id, scooter.id)).resolves;
  });
});

describe("cancelBooking", () => {
  it("Бросает исключение, если бронирование уже отменено", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo, settingRepo } =
      getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const booking = new Booking({
      userId: user.id,
      scooterId: scooter.id,
      id: bookingRepo.nextId(),
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:00:15"),
    });
    await settingRepo.save({ name: "BOOKING_DURATION", value: 15 * 60 });
    await userRepo.save(user);
    await scooterRepo.save(scooter);
    await bookingRepo.save(booking);

    await expect(
      bookingService.cancelBooking(user.id, booking.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Успешно отменяет бронирование", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo } = getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const booking = new Booking({
      userId: user.id,
      scooterId: scooter.id,
      id: bookingRepo.nextId(),
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:00"),
    });
    await userRepo.save(user);
    await scooterRepo.save(scooter);
    await bookingRepo.save(booking);

    await expect(bookingService.cancelBooking(user.id, booking.id)).resolves;
  });
});

describe("getActiveBookings", () => {
  it("Возвращает пустой массив, если у пользователя нет активных бронирований", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo, settingRepo } =
      getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const booking = new Booking({
      userId: user.id,
      scooterId: scooter.id,
      id: bookingRepo.nextId(),
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:05:00"),
    });
    await settingRepo.save({ name: "BOOKING_DURATION", value: 15 * 60 });
    await userRepo.save(user);
    await scooterRepo.save(scooter);
    await bookingRepo.save(booking);

    const bookings = await bookingService.getActiveBookings(user.id);
    expect(bookings).toHaveLength(0);
  });

  it("Возвращает только активные бронирования", async () => {
    const { userRepo, bookingService, scooterRepo, bookingRepo, settingRepo } =
      getMocks();
    const user = new User({
      phone: "79991234567",
      status: "active",
      id: userRepo.nextId(),
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const bookings = new Array(3).fill(0).map(
      (_, i) =>
        new Booking({
          userId: user.id,
          scooterId: scooter.id,
          id: bookingRepo.nextId(),
          dateStarted: new Date("2022-01-01T00:00:00"),
          dateFinished:
            i <= 1
              ? new Date("2022-01-01T00:05:00")
              : new Date("2022-01-01T00:15:00"),
        })
    );
    await settingRepo.save({ name: "BOOKING_DURATION", value: 15 * 60 });
    await userRepo.save(user);
    await scooterRepo.save(scooter);
    await Promise.all(bookings.map((b) => bookingRepo.save(b)));

    const activeBookings = await bookingService.getActiveBookings(user.id);
    expect(activeBookings).toHaveLength(1);
    expect(activeBookings[0]).toHaveProperty("id", bookings[2].id);
  });
});
