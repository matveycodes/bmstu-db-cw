import { Map } from "../views/Map";

import { ParkingsLayerController } from "./ParkingsLayerController";
import { RestrictedZonesLayerController } from "./RestrictedZonesLayerController";

const GuestMapController = () => {
  return (
    <Map>
      <ParkingsLayerController />
      <RestrictedZonesLayerController />
    </Map>
  );
};

export { GuestMapController };
