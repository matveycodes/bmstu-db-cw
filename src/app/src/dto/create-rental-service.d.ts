import { RentalRepo } from "../interfaces/rental-repo";
import { UserRepo } from "../interfaces/user-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { BookingRepo } from "../interfaces/booking-repo";
import { BillingGateway } from "../interfaces/billing-gateway";
import { IScooterService } from "../interfaces/scooter-service";
import { IParkingService } from "../interfaces/parking-service";
import { Logger } from "../interfaces/logger";
import { IPingService } from "../interfaces/ping-service";
import { ITariffService } from "../interfaces/tariff-service";

interface CreateRentalServiceDto {
  rentalRepo: RentalRepo;
  userRepo: UserRepo;
  scooterService: IScooterService;
  settingRepo: SettingRepo;
  bookingRepo: BookingRepo;
  billingGateway: BillingGateway;
  parkingService: IParkingService;
  tariffService: ITariffService;
  pingService: IPingService;
  logger?: Logger;
}

export { CreateRentalServiceDto };
