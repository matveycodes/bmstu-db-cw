import { ComponentProps, FC } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { MAP_CONFIG, TILES_URL } from "../config/map";

type Props = ComponentProps<typeof MapContainer>;

const Map: FC<Props> = ({ children, ...props }) => {
  return (
    <MapContainer
      {...MAP_CONFIG}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
      preferCanvas
      minZoom={12}
      zoomControl={false}
      {...props}
    >
      {children}
      <TileLayer url={TILES_URL} />
    </MapContainer>
  );
};

export { Map };
