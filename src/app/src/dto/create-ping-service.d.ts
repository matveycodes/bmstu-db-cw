import { PingRepo } from "../interfaces/ping-repo";
import { Logger } from "../interfaces/logger";
import { IScooterService } from "../interfaces/scooter-service";
import { IRestrictedZoneService } from "../interfaces/restricted-zone-service";

interface CreatePingServiceDto {
  pingRepo: PingRepo;
  restrictedZoneService: IRestrictedZoneService;
  scooterService: IScooterService;
  logger?: Logger;
}

export { CreatePingServiceDto };
