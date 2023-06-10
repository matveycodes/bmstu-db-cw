/**
 * @group integration
 */

import { Parking } from "../../../models/parking";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { ParkingRepo } from "../../../interfaces/parking-repo";

import { ParkingMongoRepo } from "../parking-repo";

let mongoConnection: MongoConnection;

let parkingRepo: ParkingRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  parkingRepo = new ParkingMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("parkings").deleteMany();
});

it("Сохраняет парковку", async () => {
  const parking = new Parking({
    location: { longitude: 37.68508, latitude: 55.76592 },
    id: parkingRepo.nextId(),
  });

  await parkingRepo.save(parking);
});

it("Возвращает парковку для точки рядом", async () => {
  const parking = new Parking({
    location: { longitude: 37.68508, latitude: 55.76592 },
    id: parkingRepo.nextId(),
  });
  await parkingRepo.save(parking);

  const nearbyParkings = await parkingRepo.getNear({
    longitude: 37.685148569388794,
    latitude: 55.76589448464554,
  });

  expect(nearbyParkings).toHaveLength(1);
  expect(nearbyParkings[0]).toHaveProperty("id", parking.id);
});
