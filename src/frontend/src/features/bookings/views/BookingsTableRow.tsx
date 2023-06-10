import { FC } from "react";
import { Button, Center, Stack, TableRowProps, Td, Tr } from "@chakra-ui/react";

import { Booking } from "../types/booking";
import { ScooterActionsController } from "features/scooters";

import { BookingCountdown } from "./BookingCountdown";

interface Props extends Omit<TableRowProps, "children"> {
  booking: Booking;
  onCancelClick?: (booking: Booking) => void;
  onBookingExpire?: (booking: Booking) => void;
}

const BookingsTableRow: FC<Props> = ({
  booking,
  onCancelClick,
  onBookingExpire,
  ...props
}) => {
  return (
    <Tr {...props}>
      <Td>
        <Center>{booking.scooter_number}</Center>
      </Td>
      <Td>
        <Center>
          <BookingCountdown
            booking={booking}
            onComplete={() => onBookingExpire?.(booking)}
          />
        </Center>
      </Td>
      <Td>
        <Stack>
          <ScooterActionsController
            scooterId={booking.scooter_id}
            visibleActions={["beep"]}
          />
          <Button
            variant="link"
            colorScheme="red"
            size="sm"
            onClick={() => onCancelClick?.(booking)}
          >
            Отменить
          </Button>
        </Stack>
      </Td>
    </Tr>
  );
};

export { BookingsTableRow };
