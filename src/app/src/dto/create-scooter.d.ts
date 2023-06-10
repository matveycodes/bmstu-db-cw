import { ScooterId, ScooterStatus } from "../models/scooter";
import { ScooterModelId } from "../models/scooter-model";

interface CreateScooterDto {
  id: ScooterId;
  status: ScooterStatus;
  number: string;
  modelId: ScooterModelId;
}

export { CreateScooterDto };
