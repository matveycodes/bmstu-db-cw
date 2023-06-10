/**
 * @group unit
 */

import { ScooterMockRepo } from "../../repos/__mocks__/scooter-repo";
import { ScooterAPIMockGateway } from "../../gateways/__mocks__/scooter-api";
import { ScooterModelMockRepo } from "../../repos/__mocks__/scooter-model-repo";
import { PingMockRepo } from "../../repos/__mocks__/ping-repo";
import { RestrictedZoneMockRepo } from "../../repos/__mocks__/restricted-zone-repo";
import { Scooter } from "../../models/scooter";
import { ScooterModelId } from "../../models/scooter-model";
import { RestrictedZone } from "../../models/restricted-zone";

import { ScooterService } from "../scooter";
import { PingService } from "../ping";
import { RestrictedZoneService } from "../restricted-zone";

const getMocks = () => {
  const scooterApiGateway = new ScooterAPIMockGateway();
  const scooterRepo = new ScooterMockRepo();
  const scooterModelRepo = new ScooterModelMockRepo();
  const pingRepo = new PingMockRepo();
  const scooterService = new ScooterService({
    scooterApiGateway,
    scooterRepo,
    scooterModelRepo,
    pingRepo,
  });
  const restrictedZoneRepo = new RestrictedZoneMockRepo();
  const restrictedZoneService = new RestrictedZoneService({
    restrictedZoneRepo,
  });
  const pingService = new PingService({
    pingRepo,
    restrictedZoneService,
    scooterService,
  });

  return {
    scooterApiGateway,
    scooterRepo,
    scooterModelRepo,
    pingRepo,
    scooterService,
    restrictedZoneRepo,
    pingService,
  };
};

beforeAll(() => {
  jest.useFakeTimers({ now: new Date("2022-01-01") });
});

afterAll(() => {
  jest.useRealTimers();
});

describe("save", () => {
  it("Сохраняет пинг от самоката", async () => {
    const { scooterRepo, pingService, pingRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    await scooterRepo.save(scooter);

    await pingService.save({
      scooterId: scooter.id,
      batteryLevel: 95,
      lightsState: "on",
      lockState: "unlocked",
      location: { latitude: 1, longitude: 2 },
    });

    const ping = await pingRepo.getLatestByScooter(scooter.id);
    expect(ping).toHaveProperty("date", new Date("2022-01-01"));
  });

  it("Устанавливает ограничение скорости", async () => {
    const { scooterRepo, pingService, restrictedZoneRepo, scooterApiGateway } =
      getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      number: "XYZ",
      modelId: "1" as ScooterModelId,
      status: "enabled",
    });
    const restrictedZone = new RestrictedZone({
      id: restrictedZoneRepo.nextId(),
      polygon: [
        { longitude: 0, latitude: 0 },
        { longitude: 0, latitude: 1 },
        { longitude: 1, latitude: 1 },
        { longitude: 1, latitude: 0 },
      ],
      speedLimit: 10,
    });
    await restrictedZoneRepo.save(restrictedZone);
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await pingService.save({
      scooterId: scooter.id,
      batteryLevel: 95,
      lightsState: "on",
      lockState: "unlocked",
      location: { latitude: 0.5, longitude: 0.5 },
    });

    expect(spy).toHaveBeenCalledWith(scooter.id, "SPEED_LIMIT_ON", 10);

    await pingService.save({
      scooterId: scooter.id,
      batteryLevel: 90,
      lightsState: "on",
      lockState: "unlocked",
      location: { latitude: 4, longitude: 4 },
    });

    expect(spy).toHaveBeenCalledWith(scooter.id, "SPEED_LIMIT_OFF");
    spy.mockRestore();
  });
});
