import { Location } from "features/map";

interface RestrictedZone {
  id: string;
  speed_limit: number;
  polygon: Location[];
}

export { RestrictedZone };
