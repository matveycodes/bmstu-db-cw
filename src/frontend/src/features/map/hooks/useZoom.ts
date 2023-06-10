import { useMap, useMapEvent } from "react-leaflet";
import { useState } from "react";

const useZoom = () => {
  const map = useMap();

  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvent("zoomend", () => setZoom(map.getZoom()));

  return zoom;
};

export { useZoom };
