import { ComponentProps, FC } from "react";
import { Pane, Polygon, Tooltip } from "react-leaflet";

import { RestrictedZone } from "features/restricted-zones";

import { getRestrictedZonePathOptions } from "../utils/restricted-zone";

import { LAYERS_ORDER } from "../config/map";
import { Layer } from "../types/map";

interface Props extends Omit<ComponentProps<typeof Pane>, "name" | "children"> {
  restrictedZones: RestrictedZone[];
}

const RestrictedZonesLayer: FC<Props> = ({ restrictedZones, ...props }) => {
  return (
    <Pane
      name="restricted-zones"
      style={{ zIndex: LAYERS_ORDER[Layer.RestrictedZones] }}
      {...props}
    >
      {restrictedZones.map((restrictedZone) => {
        const positions = restrictedZone.polygon.map((p) => {
          return { lat: p.latitude, lng: p.longitude };
        });

        return (
          <Polygon
            pathOptions={getRestrictedZonePathOptions(restrictedZone)}
            key={restrictedZone.id}
            positions={positions}
            opacity={0.4}
          >
            <Tooltip direction="top" pane="tooltipPane">
              В этой зоне максимальная скорость ограничена до{" "}
              {restrictedZone.speed_limit} км/ч.
            </Tooltip>
          </Polygon>
        );
      })}
    </Pane>
  );
};

export { RestrictedZonesLayer };
