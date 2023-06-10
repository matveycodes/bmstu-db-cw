import { RestrictedZoneId } from "../models/restricted-zone";

import { Location } from "../types/location";

interface CreateRestrictedZoneDto {
  id: RestrictedZoneId;
  polygon: Location[];
  speedLimit: number;
}

export { CreateRestrictedZoneDto };
