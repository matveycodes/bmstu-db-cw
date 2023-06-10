import { FC } from "react";
import { Button, Center, Stack, TableRowProps, Td, Tr } from "@chakra-ui/react";

import { ScooterActionsController } from "features/scooters";

import { formatPrice } from "utils/price";

import { Rental } from "../types/rental";

import { ActiveRentalTimer } from "./ActiveRentalTimer";

interface Props extends Omit<TableRowProps, "children"> {
  rental: Rental;
  onFinish?: (rental: Rental) => void;
}

const ActiveRentalsTableRow: FC<Props> = ({ rental, onFinish, ...props }) => {
  return (
    <Tr {...props}>
      <Td>
        <Center>{rental.scooter_number}</Center>
      </Td>
      <Td>
        <Center>
          <ActiveRentalTimer rental={rental} />
        </Center>
      </Td>
      <Td>
        <Center>{formatPrice(rental.total_price)}</Center>
      </Td>
      <Td>
        <Stack>
          <ScooterActionsController
            scooterId={rental.scooter_id}
            visibleActions={["unlock", "turn-lights-on"]}
          />
          <Button
            variant="link"
            colorScheme="red"
            size="sm"
            onClick={() => onFinish?.(rental)}
          >
            Завершить
          </Button>
        </Stack>
      </Td>
    </Tr>
  );
};

export { ActiveRentalsTableRow };
