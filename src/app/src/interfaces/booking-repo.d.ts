import { Booking, BookingId } from "../models/booking";
import { UserId } from "../models/user";
import { ScooterId } from "../models/scooter";

interface BookingRepo {
  nextId(): BookingId;
  get(): Promise<Booking[]>;
  getById(id: BookingId): Promise<Booking>;
  getActiveByUser(userId: UserId): Promise<Booking[]>;
  getActiveByScooter(scooterId: ScooterId): Promise<Booking[]>;
  isScooterBooked(scooterId: ScooterId, userId?: UserId): Promise<boolean>;
  save(booking: Booking): Promise<void>;
  remove(id: BookingId): Promise<void>;
}

export { BookingRepo };
