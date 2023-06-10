import { useCallback, useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { Bounds } from "../types/map";

const useBounds = () => {
  const map = useMap();

  const getBounds = useCallback(() => {
    const mapBounds = map.getBounds();

    const bottomLeft = mapBounds.getSouthWest();
    const topRight = mapBounds.getNorthEast();

    return {
      min_latitude: bottomLeft.lat,
      min_longitude: bottomLeft.lng,
      max_latitude: topRight.lat,
      max_longitude: topRight.lng,
    } as Bounds;
  }, [map]);

  const [bounds, setBounds] = useState<Bounds>(getBounds);

  const updateBounds = useCallback(() => {
    setBounds(getBounds());
  }, [getBounds]);

  useMapEvents({ moveend: updateBounds });

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  return bounds;
};

export { useBounds };
