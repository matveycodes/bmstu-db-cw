import { ScooterModel, ScooterModelId } from "../models/scooter-model";

interface ScooterModelRepo {
  nextId(): ScooterModelId;
  get(): Promise<ScooterModel[]>;
  getById(id: ScooterModelId): Promise<ScooterModel>;
  save(scooterModel: ScooterModel): Promise<void>;
}

export { ScooterModelRepo };
