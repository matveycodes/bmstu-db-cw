import { ScooterId } from "../models/scooter";

import { SavePingDto } from "../dto/save-ping";
import { Ping } from "../vo/ping";
import { Bounds } from "../types/bounds";

interface IPingService {
  save(savePingDto: SavePingDto): Promise<void>;
  getWithinBounds(bounds: Bounds): Promise<Ping[]>;
  getLatestByScooter(scooterId: ScooterId): Promise<Ping>;
}

export { IPingService };
