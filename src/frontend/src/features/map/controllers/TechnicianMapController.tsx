import { Map } from "../views/Map";

import { DischargedScootersLayerController } from "./DischargedScootersLayerController";

const TechnicianMapController = () => {
  return (
    <Map>
      <DischargedScootersLayerController />
    </Map>
  );
};

export { TechnicianMapController };
