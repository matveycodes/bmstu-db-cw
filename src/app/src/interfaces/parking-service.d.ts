import { Parking } from "../models/parking";
import { ScooterId } from "../models/scooter";

import { Bounds } from "../types/bounds";

interface IParkingService {
  getWithinBounds(bounds: Bounds): Promise<Parking[]>;
  isScooterNearParking(scooterId: ScooterId): Promise<boolean>;
}

export { IParkingService };
