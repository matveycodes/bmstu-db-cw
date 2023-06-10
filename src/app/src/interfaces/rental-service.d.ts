import { UserId } from "../models/user";
import { Rental, RentalId } from "../models/rental";
import { Scooter, ScooterId } from "../models/scooter";

import { Bounds } from "../types/bounds";

interface IRentalService {
  getRentableScooters(userId: UserId): Promise<Scooter[]>;
  getRentableScootersWithinBounds(
    userId: UserId,
    bounds: Bounds
  ): Promise<Scooter[]>;
  getActiveRentals(userId: UserId): Promise<Rental[]>;
  getFinishedRentals(userId: UserId): Promise<Rental[]>;
  isScooterRented(scooterId: ScooterId, userId?: UserId): Promise<boolean>;
  finishRental(userId: UserId, id: RentalId): Promise<void>;
  startRental(userId: UserId, scooterId: ScooterId): Promise<void>;
}

export { IRentalService };
