import { Parking, ParkingId } from "../models/parking";

import { Location } from "../types/location";
import { Bounds } from "../types/bounds";

interface ParkingRepo {
  nextId(): ParkingId;
  save(parking: Parking): Promise<void>;
  get(): Promise<Parking[]>;
  getNear(location: Location): Promise<Parking[]>;
  getWithin(bounds: Bounds): Promise<Parking[]>;
  remove(id: ParkingId): Promise<void>;
}

export { ParkingRepo };
