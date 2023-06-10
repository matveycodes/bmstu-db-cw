import { IScooterService } from "../interfaces/scooter-service";
import { IPingService } from "../interfaces/ping-service";
import { IRentalService } from "../interfaces/rental-service";
import { IBookingService } from "../interfaces/booking-service";

interface CreateScooterControllerDto {
  scooterService: IScooterService;
  pingService: IPingService;
  rentalService: IRentalService;
  bookingService: IBookingService;
}

export { CreateScooterControllerDto };
