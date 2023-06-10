import { PathOptions } from "leaflet";

import { RestrictedZone } from "features/restricted-zones";

const getRestrictedZonePathOptions = (
  restrictedZone: RestrictedZone
): PathOptions => {
  if (restrictedZone.speed_limit === 0) {
    return { fill: true, fillColor: "red", color: "red" };
  }

  if (restrictedZone.speed_limit < 25) {
    return { fill: true, fillColor: "gray", color: "gray" };
  }

  return {};
};

export { getRestrictedZonePathOptions };
