import { UserRepo } from "../interfaces/user-repo";
import { ScooterRepo } from "../interfaces/scooter-repo";
import { BookingRepo } from "../interfaces/booking-repo";
import { RentalRepo } from "../interfaces/rental-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { Logger } from "../interfaces/logger";

interface CreateBookingServiceDto {
  userRepo: UserRepo;
  scooterRepo: ScooterRepo;
  bookingRepo: BookingRepo;
  rentalRepo: RentalRepo;
  settingRepo: SettingRepo;
  pingRepo: PingRepo;
  logger?: Logger;
}

export { CreateBookingServiceDto };
