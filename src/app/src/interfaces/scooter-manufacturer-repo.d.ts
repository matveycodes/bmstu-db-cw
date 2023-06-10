import {
  ScooterManufacturer,
  ScooterManufacturerId,
} from "../models/scooter-manufacturer";

interface ScooterManufacturerRepo {
  nextId(): ScooterManufacturerId;
  get(): Promise<ScooterManufacturer[]>;
  getById(id: ScooterManufacturerId): Promise<ScooterManufacturer>;
  save(scooterManufacturer: ScooterManufacturer): Promise<void>;
}

export { ScooterManufacturerRepo };
