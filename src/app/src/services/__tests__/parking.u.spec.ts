/**
 * @group unit
 */

import { ParkingMockRepo } from "../../repos/__mocks__/parking-repo";
import { PingMockRepo } from "../../repos/__mocks__/ping-repo";
import { ScooterId } from "../../models/scooter";
import { Parking } from "../../models/parking";

import { ParkingService } from "../parking";

const getMocks = () => {
  const parkingRepo = new ParkingMockRepo();
  const pingRepo = new PingMockRepo();
  const parkingService = new ParkingService({ pingRepo, parkingRepo });

  return { parkingService, parkingRepo, pingRepo };
};

describe("isScooterNearParking", () => {
  it("Возвращает истину, если самокат находится рядом с парковкой", async () => {
    const { pingRepo, parkingRepo, parkingService } = getMocks();
    await pingRepo.save({
      scooterId: "1" as ScooterId,
      batteryLevel: 10,
      location: { latitude: 40.741883342230636, longitude: -73.98922282254605 },
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
    });
    await parkingRepo.save(
      new Parking({
        id: parkingRepo.nextId(),
        location: {
          latitude: 40.741877941304956,
          longitude: -73.98919631564799,
        },
      })
    );

    await expect(
      parkingService.isScooterNearParking("1" as ScooterId)
    ).resolves.toBe(true);
  });

  it("Возвращает ложь, если самокат не находится рядом с парковкой", async () => {
    const { pingRepo, parkingRepo, parkingService } = getMocks();
    await pingRepo.save({
      scooterId: "1" as ScooterId,
      batteryLevel: 10,
      location: { latitude: 40.741883342230636, longitude: -73.98922282254605 },
      lockState: "locked",
      lightsState: "off",
      date: new Date(),
    });
    await parkingRepo.save(
      new Parking({
        id: parkingRepo.nextId(),
        location: {
          latitude: 40.741877941304956,
          longitude: -73.88919631564799,
        },
      })
    );

    await expect(
      parkingService.isScooterNearParking("1" as ScooterId)
    ).resolves.toBe(false);
  });
});
