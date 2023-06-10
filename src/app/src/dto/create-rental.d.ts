import { RentalId } from "../models/rental";
import { UserId } from "../models/user";
import { ScooterId } from "../models/scooter";

interface CreateRentalDto {
  id: RentalId;
  userId: UserId;
  scooterId: ScooterId;
  startPrice: number;
  perMinutePrice: number;
  dateStarted: Date;
  dateFinished?: Date;
}

export { CreateRentalDto };
