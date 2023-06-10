import { ComponentProps, FC } from "react";

import { useParkings } from "features/parkings";

import { useBounds } from "../hooks/useBounds";
import { useZoom } from "../hooks/useZoom";

import { ParkingsLayer } from "../views/ParkingsLayer";

type Props = Omit<ComponentProps<typeof ParkingsLayer>, "parkings">;

const ParkingsLayerController: FC<Props> = (props) => {
  const zoom = useZoom();
  const bounds = useBounds();

  const shouldShowMarkers = zoom > 13;

  const { data: parkings = [] } = useParkings(bounds, {
    keepPreviousData: true,
    enabled: shouldShowMarkers,
  });

  if (!shouldShowMarkers) {
    return null;
  }

  return <ParkingsLayer parkings={parkings} {...props} />;
};

export { ParkingsLayerController };
