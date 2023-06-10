import { ComponentProps, FC } from "react";
import { Marker, Pane, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Scooter } from "features/scooters";

import marker from "assets/images/icons/scooter.svg";

import { LAYERS_ORDER } from "../config/map";
import { Layer } from "../types/map";

interface Props extends Omit<ComponentProps<typeof Pane>, "name" | "children"> {
  scooters: Scooter[];
  onScooterClick?: (scooter: Scooter) => void;
}

const scooterIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [20, 23],
});

const ScootersLayer: FC<Props> = ({ scooters, onScooterClick, ...props }) => {
  const map = useMap();

  const onBeforeScooterClick = (scooter: Scooter) => {
    onScooterClick?.(scooter);

    setTimeout(() => {
      map.setView([scooter.location.latitude, scooter.location.longitude]);
    }, 500);
  };

  return (
    <Pane
      name="scooters"
      style={{ zIndex: LAYERS_ORDER[Layer.Scooters] }}
      {...props}
    >
      <MarkerClusterGroup chunkedLoading>
        {scooters.map((scooter) => (
          <Marker
            icon={scooterIcon}
            key={scooter.id}
            position={[scooter.location.latitude, scooter.location.longitude]}
            eventHandlers={{ click: () => onBeforeScooterClick(scooter) }}
          />
        ))}
      </MarkerClusterGroup>
    </Pane>
  );
};

export { ScootersLayer };
