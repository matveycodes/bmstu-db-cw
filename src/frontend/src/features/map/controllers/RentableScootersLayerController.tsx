import { ComponentProps, FC } from "react";
import NiceModal from "@ebay/nice-modal-react";

import {
  RentableScooterInfoModalController,
  Scooter,
  useRentableScooters,
} from "features/scooters";

import { useZoom } from "../hooks/useZoom";
import { useBounds } from "../hooks/useBounds";

import { ScootersLayer } from "../views/ScootersLayer";

type Props = Omit<
  ComponentProps<typeof ScootersLayer>,
  "scooters" | "onScooterClick"
>;

const RentableScootersLayerController: FC<Props> = (props) => {
  const zoom = useZoom();
  const bounds = useBounds();

  const shouldShowMarkers = zoom > 13;

  const { data: rentableScooters = [] } = useRentableScooters(bounds, {
    enabled: shouldShowMarkers,
    keepPreviousData: true,
  });

  if (!shouldShowMarkers) {
    return null;
  }

  return (
    <ScootersLayer
      scooters={rentableScooters}
      onScooterClick={onScooterClick}
      {...props}
    />
  );
};

const onScooterClick = (scooter: Scooter) => {
  void NiceModal.show(RentableScooterInfoModalController, { scooter });
};

export { RentableScootersLayerController };
