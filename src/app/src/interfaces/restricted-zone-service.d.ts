import { RestrictedZone } from "../models/restricted-zone";

import { Location } from "../types/location";

interface IRestrictedZoneService {
  getAll(): Promise<RestrictedZone[]>;
  getByLocation(location: Location): Promise<RestrictedZone[]>;
  getSpeedLimitByLocation(location: Location): Promise<number>;
}

export { IRestrictedZoneService };
