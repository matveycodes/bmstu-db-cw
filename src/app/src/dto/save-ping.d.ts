import { ScooterId } from "../models/scooter";

import { Location } from "../types/location";
import { LightsState, LockState } from "../vo/ping";

interface SavePingDto {
  scooterId: ScooterId;
  metaInfo?: Record<string, unknown>;
  location: Location;
  batteryLevel: number;
  lockState: LockState;
  lightsState: LightsState;
}

export { SavePingDto };
