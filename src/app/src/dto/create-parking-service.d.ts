import { ParkingRepo } from "../interfaces/parking-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { Logger } from "../interfaces/logger";

interface CreateParkingServiceDto {
  parkingRepo: ParkingRepo;
  pingRepo: PingRepo;
  logger?: Logger;
}

export { CreateParkingServiceDto };
