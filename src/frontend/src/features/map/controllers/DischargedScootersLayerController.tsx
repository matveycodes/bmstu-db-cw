import { ComponentProps, FC } from "react";
import NiceModal from "@ebay/nice-modal-react";

import {
  RentableScooterInfoModalController,
  Scooter,
  useDischargedScooters,
} from "features/scooters";

import { useBounds } from "../hooks/useBounds";

import { ScootersLayer } from "../views/ScootersLayer";

type Props = Omit<
  ComponentProps<typeof ScootersLayer>,
  "scooters" | "onScooterClick"
>;

const DischargedScootersLayerController: FC<Props> = (props) => {
  const bounds = useBounds();

  const { data: dischargedScooters = [] } = useDischargedScooters(bounds, {
    keepPreviousData: true,
  });

  return (
    <ScootersLayer
      scooters={dischargedScooters}
      onScooterClick={onScooterClick}
      {...props}
    />
  );
};

const onScooterClick = (scooter: Scooter) => {
  void NiceModal.show(RentableScooterInfoModalController, { scooter });
};

export { DischargedScootersLayerController };
