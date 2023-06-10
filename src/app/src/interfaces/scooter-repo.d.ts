import { Scooter, ScooterId } from "../models/scooter";

interface ScooterRepo {
  nextId(): ScooterId;
  get(): Promise<Scooter[]>;
  getById(id: ScooterId): Promise<Scooter>;
  save(scooter: Scooter): Promise<void>;
  remove(id: ScooterId): Promise<void>;
}

export { ScooterRepo };
