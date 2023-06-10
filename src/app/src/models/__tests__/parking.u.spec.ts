/**
 * @group unit
 */

import { Location } from "../../types/location";
import { Parking, ParkingId } from "../parking";

describe("isNear", () => {
  it("Возвращает истину, если точка находится рядом с местом парковки", () => {
    const location: Location = {
      latitude: 55.77151878598088,
      longitude: 37.692130857742086,
    };
    const parking = new Parking({
      location: { latitude: 55.7715031406395, longitude: 37.69214327399068 },
      id: "1" as ParkingId,
    });

    expect(parking.isNear(location)).toBe(true);
  });

  it("Возвращает ложь, если точка не находится рядом с местом парковки", () => {
    const location: Location = {
      latitude: 55.77151878598088,
      longitude: 37.692130857742086,
    };
    const parking = new Parking({
      location: { latitude: 54.7715031406395, longitude: 37.69214327399068 },
      id: "1" as ParkingId,
    });

    expect(parking.isNear(location)).toBe(false);
  });
});
