import { ScooterModelId } from "../models/scooter-model";
import { ScooterManufacturerId } from "../models/scooter-manufacturer";

interface CreateScooterModelDto {
  id: ScooterModelId;
  title: string;
  singleChargeMileage: number;
  weight: number;
  maxSpeed: number;
  maxLoad: number;
  manufacturerId: ScooterManufacturerId;
  year: number;
}

export { CreateScooterModelDto };
