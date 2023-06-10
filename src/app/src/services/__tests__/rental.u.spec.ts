/**
 * @group unit
 */

import { RentalMockRepo } from "../../repos/__mocks__/rental-repo";
import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { ScooterMockRepo } from "../../repos/__mocks__/scooter-repo";
import { ScooterAPIMockGateway } from "../../gateways/__mocks__/scooter-api";
import { ScooterModelMockRepo } from "../../repos/__mocks__/scooter-model-repo";
import { PingMockRepo } from "../../repos/__mocks__/ping-repo";
import { SettingMockRepo } from "../../repos/__mocks__/setting-repo";
import { BillingMockGateway } from "../../gateways/__mocks__/billing";
import { User } from "../../models/user";
import { Scooter } from "../../models/scooter";
import { ScooterModelId } from "../../models/scooter-model";
import { InvalidStateError } from "../../errors/invalid-state-error";
import { Rental } from "../../models/rental";
import { LimitError } from "../../errors/limit-error";
import { PermissionError } from "../../errors/permission-error";
import { BookingMockRepo } from "../../repos/__mocks__/booking-repo";
import { ParkingMockRepo } from "../../repos/__mocks__/parking-repo";
import { Parking } from "../../models/parking";
import { SubscriptionMockRepo } from "../../repos/__mocks__/subscription-repo";
import { PurchasedSubscriptionMockRepo } from "../../repos/__mocks__/purchased-subscription-repo";
import { Subscription } from "../../models/subscription";
import { RestrictedZoneMockRepo } from "../../repos/__mocks__/restricted-zone-repo";

import { ScooterService } from "../scooter";
import { RentalService } from "../rental";
import { ParkingService } from "../parking";
import { PingService } from "../ping";
import { RestrictedZoneService } from "../restricted-zone";
import { SubscriptionService } from "../subscription";
import { TariffService } from "../tariff";

const getMocks = () => {
  const rentalRepo = new RentalMockRepo();
  const userRepo = new UserMockRepo();
  const scooterRepo = new ScooterMockRepo();
  const scooterApiGateway = new ScooterAPIMockGateway();
  const scooterModelRepo = new ScooterModelMockRepo();
  const pingRepo = new PingMockRepo();
  const bookingRepo = new BookingMockRepo();
  const restrictedZoneRepo = new RestrictedZoneMockRepo();
  const subscriptionRepo = new SubscriptionMockRepo();
  const purchasedSubscriptionRepo = new PurchasedSubscriptionMockRepo();
  const scooterService = new ScooterService({
    scooterApiGateway,
    scooterRepo,
    scooterModelRepo,
    pingRepo,
  });
  const restrictedZoneService = new RestrictedZoneService({
    restrictedZoneRepo,
  });
  const pingService = new PingService({
    pingRepo,
    restrictedZoneService,
    scooterService,
  });
  const settingRepo = new SettingMockRepo();
  const billingGateway = new BillingMockGateway();
  const parkingRepo = new ParkingMockRepo();
  const parkingService = new ParkingService({ parkingRepo, pingRepo });
  const subscriptionService = new SubscriptionService({
    subscriptionRepo,
    purchasedSubscriptionRepo,
    userRepo,
    billingGateway,
  });
  const tariffService = new TariffService({ settingRepo, subscriptionService });
  const rentalService = new RentalService({
    rentalRepo,
    userRepo,
    scooterService,
    settingRepo,
    tariffService,
    billingGateway,
    bookingRepo,
    parkingService,
    pingService,
  });

  return {
    rentalRepo,
    userRepo,
    scooterRepo,
    scooterApiGateway,
    scooterModelRepo,
    pingRepo,
    scooterService,
    settingRepo,
    billingGateway,
    rentalService,
    bookingRepo,
    parkingRepo,
    parkingService,
    subscriptionRepo,
    purchasedSubscriptionRepo,
  };
};

describe("startRental", () => {
  it("Бросает исключение, если пользователь неактивен", async () => {
    const { userRepo, rentalService, scooterRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      role: "customer",
      dateJoined: new Date(),
      status: "pending",
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    await userRepo.save(user);

    await expect(
      rentalService.startRental(user.id, scooter.id)
    ).rejects.toThrow(PermissionError);
  });

  it("Бросает исключение, если самокат недоступен", async () => {
    const { userRepo, rentalService, scooterRepo, settingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "disabled",
    });
    await settingRepo.save({ name: "MAX_RENTALS", value: 10 });
    await scooterRepo.save(scooter);
    await userRepo.save(user);

    await expect(
      rentalService.startRental(user.id, scooter.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Бросает исключение, если самокат уже арендован", async () => {
    const { userRepo, rentalService, scooterRepo, rentalRepo, settingRepo } =
      getMocks();
    const users = new Array(2).fill(0).map(
      () =>
        new User({
          id: userRepo.nextId(),
          phone: "79991234567",
          status: "active",
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
    const rental = new Rental({
      id: rentalRepo.nextId(),
      userId: users[0].id,
      scooterId: scooter.id,
      startPrice: 50,
      perMinutePrice: 6,
      dateStarted: new Date("2022-01-01"),
    });
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });
    await rentalRepo.save(rental);
    await scooterRepo.save(scooter);
    await Promise.all(users.map((u) => userRepo.save(u)));

    await expect(
      rentalService.startRental(users[1].id, scooter.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Бросает исключение, если превышен лимит аренд", async () => {
    const { userRepo, rentalService, scooterRepo, rentalRepo, settingRepo } =
      getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooters = new Array(2).fill(0).map(
      () =>
        new Scooter({
          id: scooterRepo.nextId(),
          number: "XYZ",
          modelId: "1" as ScooterModelId,
          status: "enabled",
        })
    );
    const rental = new Rental({
      id: rentalRepo.nextId(),
      userId: user.id,
      scooterId: scooters[0].id,
      startPrice: 50,
      perMinutePrice: 6,
      dateStarted: new Date("2022-01-01"),
    });
    await rentalRepo.save(rental);
    await Promise.all(scooters.map((s) => scooterRepo.save(s)));
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });

    await expect(
      rentalService.startRental(user.id, scooters[1].id)
    ).rejects.toThrow(LimitError);
  });

  it("Успешно начинает аренду", async () => {
    const { userRepo, rentalService, scooterRepo, settingRepo, pingRepo } =
      getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    await userRepo.save(user);
    await pingRepo.save({
      scooterId: scooter.id,
      batteryLevel: 10,
      location: { longitude: 1, latitude: 1 },
      date: new Date(),
      lockState: "locked",
      lightsState: "off",
    });
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });

    await expect(rentalService.startRental(user.id, scooter.id)).resolves;
  });

  it("Успешно начинает аренду с бесплатным стартом при активной подписке", async () => {
    const {
      userRepo,
      rentalService,
      scooterRepo,
      settingRepo,
      pingRepo,
      subscriptionRepo,
      purchasedSubscriptionRepo,
      rentalRepo,
    } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const subscription = new Subscription({
      id: subscriptionRepo.nextId(),
      title: "Подписка",
      price: 1,
      duration: 86400,
    });
    await scooterRepo.save(scooter);
    await userRepo.save(user);
    await pingRepo.save({
      scooterId: scooter.id,
      batteryLevel: 10,
      location: { longitude: 1, latitude: 1 },
      date: new Date(),
      lockState: "locked",
      lightsState: "off",
    });
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });
    await subscriptionRepo.save(subscription);
    await purchasedSubscriptionRepo.save({
      subscriptionId: subscription.id,
      userId: user.id,
      datePurchased: new Date(),
      dateStarted: new Date(),
      dateFinished: new Date(new Date().getTime() + 86400000),
    });

    await rentalService.startRental(user.id, scooter.id);
    const rentals = await rentalRepo.getActiveByUser(user.id);
    expect(rentals).toHaveLength(1);
    expect(rentals[0]).toHaveProperty("startPrice", 0);
  });
});

describe("finishRental", () => {
  it("Бросает исключение, если аренда уже завершена", async () => {
    const { userRepo, rentalService, scooterRepo, rentalRepo, settingRepo } =
      getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const rental = new Rental({
      id: rentalRepo.nextId(),
      userId: user.id,
      scooterId: scooter.id,
      startPrice: 50,
      perMinutePrice: 6,
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:01:00"),
    });
    await rentalRepo.save(rental);
    await scooterRepo.save(scooter);
    await userRepo.save(user);
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });

    await expect(
      rentalService.finishRental(user.id, rental.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Бросает исключение, если самокат не находится на парковке", async () => {
    const {
      userRepo,
      rentalService,
      scooterRepo,
      rentalRepo,
      settingRepo,
      pingRepo,
    } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const rental = new Rental({
      id: rentalRepo.nextId(),
      userId: user.id,
      scooterId: scooter.id,
      startPrice: 50,
      perMinutePrice: 6,
      dateStarted: new Date("2022-01-01T00:00:00"),
    });
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });
    await rentalRepo.save(rental);
    await scooterRepo.save(scooter);
    await userRepo.save(user);
    await pingRepo.save({
      scooterId: scooter.id,
      location: { latitude: 1, longitude: 1 },
      lockState: "unlocked",
      lightsState: "off",
      date: new Date(),
      batteryLevel: 50,
    });

    await expect(
      rentalService.finishRental(user.id, rental.id)
    ).rejects.toThrow(InvalidStateError);
  });

  it("Успешно завершает аренду", async () => {
    const {
      userRepo,
      rentalService,
      scooterRepo,
      rentalRepo,
      settingRepo,
      parkingRepo,
      pingRepo,
    } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const rental = new Rental({
      id: rentalRepo.nextId(),
      userId: user.id,
      scooterId: scooter.id,
      startPrice: 50,
      perMinutePrice: 6,
      dateStarted: new Date("2022-01-01T00:00:00"),
    });
    const parking = new Parking({
      id: parkingRepo.nextId(),
      location: { latitude: 55.77151878598088, longitude: 37.692130857742086 },
    });
    await settingRepo.save({ name: "START_PRICE", value: 50 });
    await settingRepo.save({ name: "PER_MINUTE_PRICE", value: 6 });
    await settingRepo.save({ name: "MAX_RENTALS", value: 1 });
    await rentalRepo.save(rental);
    await scooterRepo.save(scooter);
    await userRepo.save(user);
    await pingRepo.save({
      scooterId: scooter.id,
      location: { latitude: 55.77153572308305, longitude: 37.69212116035939 },
      lockState: "unlocked",
      lightsState: "off",
      date: new Date(),
      batteryLevel: 50,
    });
    await parkingRepo.save(parking);

    await expect(rentalService.finishRental(user.id, rental.id)).resolves;
  });
});

describe("getRentableScooters", () => {
  it("Бросает исключение, если пользователь не имеет прав", async () => {
    const { userRepo, rentalService } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      role: "customer",
      dateJoined: new Date(),
      status: "pending",
    });
    await userRepo.save(user);

    await expect(rentalService.getRentableScooters(user.id)).rejects.toThrow(
      PermissionError
    );
  });

  it("Не показывает скрытые самокаты", async () => {
    const { userRepo, rentalService, scooterRepo, pingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooters = [
      new Scooter({
        id: scooterRepo.nextId(),
        number: "XYZ",
        modelId: "1" as ScooterModelId,
        status: "enabled",
      }),
      new Scooter({
        id: scooterRepo.nextId(),
        number: "ABC",
        modelId: "1" as ScooterModelId,
        status: "disabled",
      }),
    ];
    await userRepo.save(user);
    await Promise.all(scooters.map((s) => scooterRepo.save(s)));
    await Promise.all(
      scooters.map((s) =>
        pingRepo.save({
          scooterId: s.id,
          batteryLevel: 10,
          location: { longitude: 1, latitude: 1 },
          date: new Date(),
          lockState: "locked",
          lightsState: "off",
        })
      )
    );

    const rentableScooters = await rentalService.getRentableScooters(user.id);
    expect(rentableScooters).toHaveLength(1);
    expect(rentableScooters[0]).toHaveProperty("id", scooters[0].id);
  });

  it("Не показывает разряженные самокаты", async () => {
    const { userRepo, rentalService, scooterRepo, pingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "79991234567",
      status: "active",
      role: "customer",
      dateJoined: new Date(),
    });
    const scooters = [
      new Scooter({
        id: scooterRepo.nextId(),
        number: "XYZ",
        modelId: "1" as ScooterModelId,
        status: "enabled",
      }),
      new Scooter({
        id: scooterRepo.nextId(),
        number: "ABC",
        modelId: "1" as ScooterModelId,
        status: "enabled",
      }),
    ];
    await userRepo.save(user);
    await Promise.all(scooters.map((s) => scooterRepo.save(s)));
    await Promise.all(
      scooters.map((s) =>
        pingRepo.save({
          scooterId: s.id,
          batteryLevel: s.id === scooters[0].id ? 0 : 100,
          location: { longitude: 1, latitude: 1 },
          date: new Date(),
          lockState: "locked",
          lightsState: "off",
        })
      )
    );

    const rentableScooters = await rentalService.getRentableScooters(user.id);
    expect(rentableScooters).toHaveLength(1);
    expect(rentableScooters[0]).toHaveProperty("id", scooters[1].id);
  });
});
