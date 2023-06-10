import { ScooterId } from "../models/scooter";
import { Location } from "../types/location";

type LockState = "locked" | "unlocked";

type LightsState = "on" | "off";

interface Ping {
  scooterId: ScooterId;
  date: Date;
  metaInfo?: Record<string, unknown>;
  location: Location;
  batteryLevel: number;
  lockState: LockState;
  lightsState: LightsState;
}

export { Ping, LockState, LightsState };
