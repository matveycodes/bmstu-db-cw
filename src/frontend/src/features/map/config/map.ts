import { MapContainerProps } from "react-leaflet";

import { Layer } from "../types/map";

const MAP_CONFIG: MapContainerProps = {
  // Moscow
  center: [55.7558, 37.6173],
  zoom: 13,
};

const TILES_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const LAYERS_ORDER: Record<Layer, number> = {
  [Layer.Parkings]: 402,
  [Layer.RestrictedZones]: 402,
  [Layer.Scooters]: 403,
};

export { MAP_CONFIG, TILES_URL, LAYERS_ORDER };
