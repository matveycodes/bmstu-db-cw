import { Scooter, ScooterId } from "../models/scooter";

import { Bounds } from "../types/bounds";

interface IScooterService {
  get(): Promise<Scooter[]>;
  getById(id: ScooterId): Promise<Scooter>;
  getDischargedWithinBounds(bounds: Bounds): Promise<Scooter[]>;
  isDischarged(id: ScooterId): Promise<boolean>;
  estimateTime(id: ScooterId): Promise<number>;
  estimateDistance(id: ScooterId): Promise<number>;
  prepareForSleep(id: ScooterId): Promise<void>;
  prepareForRide(id: ScooterId): Promise<void>;
  resetSpeedLimit(id: ScooterId): Promise<void>;
  setSpeedLimit(id: ScooterId, value: number): Promise<void>;
  turnLightsOff(id: ScooterId): Promise<void>;
  turnLightsOn(id: ScooterId): Promise<void>;
  unlock(id: ScooterId): Promise<void>;
  beep(id: ScooterId): Promise<void>;
}

export { IScooterService };
