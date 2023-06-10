import { RestrictedZone, RestrictedZoneId } from "../models/restricted-zone";

import { Location } from "../types/location";

interface RestrictedZoneRepo {
  nextId(): RestrictedZoneId;
  save(restrictedZone: RestrictedZone): Promise<void>;
  get(): Promise<RestrictedZone[]>;
  getByLocation(location: Location): Promise<RestrictedZone[]>;
  remove(id: RestrictedZoneId): Promise<void>;
}

export { RestrictedZoneRepo };
