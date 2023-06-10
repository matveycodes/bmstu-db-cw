import { BookingId } from "../models/booking";
import { UserId } from "../models/user";
import { ScooterId } from "../models/scooter";

interface CreateBookingDto {
  id: BookingId;
  userId: UserId;
  scooterId: ScooterId;
  dateStarted: Date;
  dateFinished: Date;
}

export { CreateBookingDto };
