import { ComponentProps, FC } from "react";
import { Marker, Tooltip, Pane } from "react-leaflet";
import L from "leaflet";

import { Parking } from "features/parkings";

import marker from "assets/images/icons/parking.svg";

import { LAYERS_ORDER } from "../config/map";
import { Layer } from "../types/map";

interface Props extends Omit<ComponentProps<typeof Pane>, "name" | "children"> {
  parkings: Parking[];
}

const parkingIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [10, 10],
});

const ParkingsLayer: FC<Props> = ({ parkings, ...props }) => {
  return (
    <Pane
      name="parkings"
      style={{ zIndex: LAYERS_ORDER[Layer.Parkings] }}
      {...props}
    >
      {parkings.map(({ id, location }) => (
        <Marker
          icon={parkingIcon}
          key={id}
          position={[location.latitude, location.longitude]}
        >
          <Tooltip direction="top" pane="tooltipPane">
            Это парковка. Здесь можно оставить самокат.
          </Tooltip>
        </Marker>
      ))}
    </Pane>
  );
};

export { ParkingsLayer };
