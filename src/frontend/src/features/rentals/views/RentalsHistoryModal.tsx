import { FC } from "react";
import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { Rental } from "../types/rental";

import { RentalsHistoryTable } from "./RentalsHistoryTable";

interface Props extends Omit<ModalProps, "children"> {
  isLoading?: boolean;
  rentals: Rental[];
}

const RentalsHistoryModal: FC<Props> = ({ rentals, isLoading, ...props }) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent maxW="min(900px, 90vw)">
        <ModalHeader>История поездок</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Center>
              <Spinner color="blue.500" />
            </Center>
          )}

          {!isLoading && rentals.length === 0 && (
            <Text>В истории поездок нет записей.</Text>
          )}

          {rentals.length > 0 && <RentalsHistoryTable rentals={rentals} />}
        </ModalBody>
        <Box h={3} />
      </ModalContent>
    </Modal>
  );
};

export { RentalsHistoryModal };
