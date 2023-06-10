/**
 * @group unit
 */

import { ScooterAPIMockGateway } from "../../gateways/__mocks__/scooter-api";
import { ScooterMockRepo } from "../../repos/__mocks__/scooter-repo";
import { ScooterModelMockRepo } from "../../repos/__mocks__/scooter-model-repo";
import { PingMockRepo } from "../../repos/__mocks__/ping-repo";
import { Scooter } from "../../models/scooter";
import { ScooterModel, ScooterModelId } from "../../models/scooter-model";
import { ScooterManufacturerId } from "../../models/scooter-manufacturer";

import { ScooterService } from "../scooter";

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

  return {
    scooterApiGateway,
    scooterRepo,
    scooterModelRepo,
    pingRepo,
    scooterService,
  };
};

describe("beep", () => {
  it("Успешно отправляет запрос на сигнал", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.beep(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "BEEP");
  });
});

describe("unlock", () => {
  it("Успешно отправляет запрос на открытие замка", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.unlock(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "UNLOCK");
  });
});

describe("turnLightsOn", () => {
  it("Успешно отправляет запрос на включение фар", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.turnLightsOn(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "LIGHTS_ON");
  });
});

describe("turnLightsOff", () => {
  it("Успешно отправляет запрос на выключение фар", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.turnLightsOff(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "LIGHTS_OFF");
  });
});

describe("setSpeedLimit", () => {
  it("Успешно отправляет запрос на установление ограничения скорости", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.setSpeedLimit(scooter.id, 20);

    expect(spy).toHaveBeenCalledWith(scooter.id, "SPEED_LIMIT_ON", 20);
  });
});

describe("resetSpeedLimit", () => {
  it("Успешно отправляет запрос на сброс ограничения скорости", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.resetSpeedLimit(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "SPEED_LIMIT_OFF");
  });
});

describe("prepareForRide", () => {
  it("Успешно подготавливает самокат к поездке", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.prepareForRide(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "DISPLAY_ON");
    expect(spy).toHaveBeenCalledWith(scooter.id, "UNLOCK");
  });

  it("Включает фары в темное время суток", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");
    jest.useFakeTimers({ now: new Date("2022-01-01T22:00:00") });

    await scooterService.prepareForRide(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "DISPLAY_ON");
    expect(spy).toHaveBeenCalledWith(scooter.id, "LIGHTS_ON");
    expect(spy).toHaveBeenCalledWith(scooter.id, "UNLOCK");
    jest.useRealTimers();
  });
});

describe("prepareForSleep", () => {
  it("Успешно подготавливает самокат ко сну", async () => {
    const { scooterApiGateway, scooterService, scooterRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    const spy = jest.spyOn(scooterApiGateway, "sendCommand");

    await scooterService.prepareForSleep(scooter.id);

    expect(spy).toHaveBeenCalledWith(scooter.id, "DISPLAY_OFF");
    expect(spy).toHaveBeenCalledWith(scooter.id, "LIGHTS_OFF");
    expect(spy).toHaveBeenCalledWith(scooter.id, "BEEP");
  });
});

describe("estimateDistance", () => {
  it("Оценивает расстояние, если уровень заряде ненулевой", async () => {
    const { scooterService, scooterRepo, pingRepo, scooterModelRepo } =
      getMocks();
    const scooterModel = new ScooterModel({
      id: scooterModelRepo.nextId(),
      title: "XYZ",
      singleChargeMileage: 100,
      weight: 30,
      maxSpeed: 25,
      maxLoad: 100,
      manufacturerId: "1" as ScooterManufacturerId,
      year: 2020,
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: scooterModel.id,
      number: "XYZ",
      status: "enabled",
    });
    await scooterModelRepo.save(scooterModel);
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 50,
    });

    const distance = await scooterService.estimateDistance(scooter.id);

    expect(distance).toBe(50);
  });

  it("Возвращает 0, если уровень заряде нулевой", async () => {
    const { scooterService, scooterRepo, pingRepo, scooterModelRepo } =
      getMocks();
    const scooterModel = new ScooterModel({
      id: scooterModelRepo.nextId(),
      title: "XYZ",
      singleChargeMileage: 100,
      weight: 30,
      maxSpeed: 25,
      maxLoad: 100,
      manufacturerId: "1" as ScooterManufacturerId,
      year: 2020,
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: scooterModel.id,
      number: "XYZ",
      status: "enabled",
    });
    await scooterModelRepo.save(scooterModel);
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 0,
    });

    const distance = await scooterService.estimateDistance(scooter.id);

    expect(distance).toBe(0);
  });
});

describe("estimateTime", () => {
  it("Оценивает время, если уровень заряде ненулевой", async () => {
    const { scooterService, scooterRepo, pingRepo, scooterModelRepo } =
      getMocks();
    const scooterModel = new ScooterModel({
      id: scooterModelRepo.nextId(),
      title: "XYZ",
      singleChargeMileage: 100,
      weight: 30,
      maxSpeed: 25,
      maxLoad: 100,
      manufacturerId: "1" as ScooterManufacturerId,
      year: 2020,
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: scooterModel.id,
      number: "XYZ",
      status: "enabled",
    });
    await scooterModelRepo.save(scooterModel);
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 50,
    });

    const time = await scooterService.estimateTime(scooter.id);

    expect(time).toBe(120);
  });

  it("Возвращает 0, если уровень заряде нулевой", async () => {
    const { scooterService, scooterRepo, pingRepo, scooterModelRepo } =
      getMocks();
    const scooterModel = new ScooterModel({
      id: scooterModelRepo.nextId(),
      title: "XYZ",
      singleChargeMileage: 100,
      weight: 30,
      maxSpeed: 25,
      maxLoad: 100,
      manufacturerId: "1" as ScooterManufacturerId,
      year: 2020,
    });
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: scooterModel.id,
      number: "XYZ",
      status: "enabled",
    });
    await scooterModelRepo.save(scooterModel);
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 0,
    });

    const time = await scooterService.estimateTime(scooter.id);

    expect(time).toBe(0);
  });
});

describe("isDischarged", () => {
  it("Возвращает истину, если самокат разряжен", async () => {
    const { scooterService, scooterRepo, pingRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 0,
    });

    await expect(scooterService.isDischarged(scooter.id)).resolves.toBe(true);
  });

  it("Возвращает ложь, если самокат заряжен", async () => {
    const { scooterService, scooterRepo, pingRepo } = getMocks();
    const scooter = new Scooter({
      id: scooterRepo.nextId(),
      modelId: "1" as ScooterModelId,
      number: "XYZ",
      status: "enabled",
    });
    await scooterRepo.save(scooter);
    await pingRepo.save({
      scooterId: scooter.id,
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
      location: { latitude: 0, longitude: 0 },
      batteryLevel: 10,
    });

    await expect(scooterService.isDischarged(scooter.id)).resolves.toBe(false);
  });
});
