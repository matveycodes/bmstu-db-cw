import { UserId } from "../models/user";
import { Booking, BookingId } from "../models/booking";
import { ScooterId } from "../models/scooter";

interface IBookingService {
  getActiveBookings(userId: UserId): Promise<Booking[]>;
  cancelBooking(userId: UserId, id: BookingId): Promise<void>;
  bookScooter(userId: UserId, scooterId: ScooterId): Promise<void>;
  isScooterBooked(scooterId: ScooterId, userId?: UserId): Promise<boolean>;
}

export { IBookingService };
