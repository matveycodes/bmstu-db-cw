import { ScooterAPIGateway } from "../interfaces/scooter-api-gateway";
import { ScooterRepo } from "../interfaces/scooter-repo";
import { ScooterModelRepo } from "../interfaces/scooter-model-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { Logger } from "../interfaces/logger";

interface CreateScooterServiceDto {
  scooterApiGateway: ScooterAPIGateway;
  scooterRepo: ScooterRepo;
  scooterModelRepo: ScooterModelRepo;
  pingRepo: PingRepo;
  logger?: Logger;
}

export { CreateScooterServiceDto };
