import { ComponentProps, FC } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";

import { Scooter } from "../types/scooter";

import { ScooterBatteryLevelBadge } from "./ScooterBatteryLevelBadge";
import { ScooterInfo } from "./ScooterInfo";
import { ScooterInfoActions } from "./ScooterInfoActions";

interface Props
  extends Omit<ModalProps, "children">,
    Pick<
      ComponentProps<typeof ScooterInfoActions>,
      "onStartRental" | "isStartingRental" | "onBook" | "isBooking" | "tariff"
    > {
  scooter: Scooter;
}

const RentableScooterInfoModal: FC<Props> = ({
  scooter,
  onStartRental,
  onBook,
  tariff,
  isStartingRental,
  isBooking,
  ...props
}) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center" gap={2}>
          Самокат {scooter.number}
          <ScooterBatteryLevelBadge scooter={scooter} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ScooterInfo scooter={scooter} />
        </ModalBody>
        <ModalFooter>
          <ScooterInfoActions
            w="100%"
            onStartRental={onStartRental}
            onBook={onBook}
            tariff={tariff}
            scooter={scooter}
            isBooking={isBooking}
            isStartingRental={isStartingRental}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { RentableScooterInfoModal };
