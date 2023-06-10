import { Rental, RentalId } from "../models/rental";
import { UserId } from "../models/user";
import { ScooterId } from "../models/scooter";

interface RentalRepo {
  nextId(): RentalId;
  get(): Promise<Rental[]>;
  getById(id: RentalId): Promise<Rental>;
  getFinishedByUser(userId: UserId): Promise<Rental[]>;
  getActiveByUser(userId: UserId): Promise<Rental[]>;
  getActiveByScooter(scooterId: ScooterId): Promise<Rental[]>;
  isScooterRented(scooterId: ScooterId, userId?: UserId): Promise<boolean>;
  save(rental: Rental): Promise<void>;
  remove(id: RentalId): Promise<void>;
}

export { RentalRepo };
