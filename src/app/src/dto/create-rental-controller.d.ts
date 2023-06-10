import { IRentalService } from "../interfaces/rental-service";
import { IScooterService } from "../interfaces/scooter-service";

interface CreateRentalControllerDto {
  rentalService: IRentalService;
  scooterService: IScooterService;
}

export { CreateRentalControllerDto };
