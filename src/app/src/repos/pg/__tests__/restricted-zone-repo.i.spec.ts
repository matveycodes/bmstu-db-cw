/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { RestrictedZone } from "../../../models/restricted-zone";

import { RestrictedZonePGRepo } from "../restricted-zone-repo";

const pgPool = createPgPool();

const restrictedZoneRepo = new RestrictedZonePGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE restricted_zones CASCADE");
});

it("Сохраняет зону ограничения скорости", async () => {
  const restrictedZone = new RestrictedZone({
    id: restrictedZoneRepo.nextId(),
    polygon: [
      { longitude: 37.693415914306684, latitude: 55.77259193369159 },
      { longitude: 37.69401298020545, latitude: 55.77231172996028 },
      { longitude: 37.691661947100854, latitude: 55.770052292431984 },
      { longitude: 37.68964389762488, latitude: 55.771312030239514 },
      { longitude: 37.693415914306684, latitude: 55.77259193369159 },
    ],
    speedLimit: 20,
  });

  await restrictedZoneRepo.save(restrictedZone);
});

it("Возвращает зону ограничения скорости для точки внутри", async () => {
  const restrictedZone = new RestrictedZone({
    id: restrictedZoneRepo.nextId(),
    polygon: [
      { longitude: 37.68404096922693, latitude: 55.76754173549086 },
      { longitude: 37.68761016197312, latitude: 55.76714023436864 },
      { longitude: 37.68562279969865, latitude: 55.76449026447673 },
      { longitude: 37.682537488453924, latitude: 55.76514539307464 },
      { longitude: 37.68404096922693, latitude: 55.76754173549086 },
    ],
    speedLimit: 20,
  });
  await restrictedZoneRepo.save(restrictedZone);

  const restrictedZones = await restrictedZoneRepo.getByLocation({
    longitude: 37.68508,
    latitude: 55.76592,
  });

  expect(restrictedZones).toHaveLength(1);
  expect(restrictedZones[0]).toHaveProperty("id", restrictedZone.id);
});
