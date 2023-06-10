import { IBookingService } from "../interfaces/booking-service";
import { IScooterService } from "../interfaces/scooter-service";

interface CreateBookingControllerDto {
  bookingService: IBookingService;
  scooterService: IScooterService;
}

export { CreateBookingControllerDto };
