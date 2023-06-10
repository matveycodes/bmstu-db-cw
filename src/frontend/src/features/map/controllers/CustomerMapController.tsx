import { Map } from "../views/Map";

import { ParkingsLayerController } from "./ParkingsLayerController";
import { RestrictedZonesLayerController } from "./RestrictedZonesLayerController";
import { RentableScootersLayerController } from "./RentableScootersLayerController";

const CustomerMapController = () => {
  return (
    <Map>
      <ParkingsLayerController />
      <RestrictedZonesLayerController />
      <RentableScootersLayerController />
    </Map>
  );
};

export { CustomerMapController };
