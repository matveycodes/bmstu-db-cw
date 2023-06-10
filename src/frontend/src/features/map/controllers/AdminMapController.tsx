import { Map } from "../views/Map";

import { ParkingsLayerController } from "./ParkingsLayerController";
import { RestrictedZonesLayerController } from "./RestrictedZonesLayerController";
import { RentableScootersLayerController } from "./RentableScootersLayerController";

const AdminMapController = () => {
  return (
    <Map>
      <ParkingsLayerController />
      <RestrictedZonesLayerController />
      <RentableScootersLayerController />
    </Map>
  );
};

export { AdminMapController };
