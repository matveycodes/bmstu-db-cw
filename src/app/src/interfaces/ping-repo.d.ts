import { ScooterId } from "../models/scooter";

import { Ping } from "../vo/ping";
import { Bounds } from "../types/bounds";

interface PingRepo {
  save(ping: Ping): Promise<void>;
  get(): Promise<Ping[]>;
  getWithin(bounds: Bounds): Promise<Ping[]>;
  getLatestByScooter(scooterId: ScooterId): Promise<Ping>;
}

export { PingRepo };
