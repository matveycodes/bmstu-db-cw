/**
 * @group unit
 */

import { Location } from "../../types/location";
import { RestrictedZone, RestrictedZoneId } from "../restricted-zone";

describe("contains", () => {
  it("Возвращает истину, если точка находится внутри зоны", () => {
    const location: Location = { longitude: 1, latitude: 1 };
    const zone = new RestrictedZone({
      id: "1" as RestrictedZoneId,
      speedLimit: 100,
      polygon: [
        { longitude: 0, latitude: 0 },
        { longitude: 0, latitude: 2 },
        { longitude: 2, latitude: 2 },
        { longitude: 2, latitude: 0 },
      ],
    });

    expect(zone.contains(location)).toBe(true);
  });

  it("Возвращает ложь, если точка не находится внутри зоны", () => {
    const location: Location = { longitude: 3, latitude: 3 };
    const zone = new RestrictedZone({
      id: "1" as RestrictedZoneId,
      speedLimit: 100,
      polygon: [
        { longitude: 0, latitude: 0 },
        { longitude: 0, latitude: 2 },
        { longitude: 2, latitude: 2 },
        { longitude: 2, latitude: 0 },
      ],
    });

    expect(zone.contains(location)).toBe(false);
  });
});
