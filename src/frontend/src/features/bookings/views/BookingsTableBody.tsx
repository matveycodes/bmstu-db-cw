import { ComponentProps, FC } from "react";
import { TableBodyProps, Tbody } from "@chakra-ui/react";

import { Booking } from "../types/booking";

import { BookingsTableRow } from "./BookingsTableRow";

interface Props extends Omit<TableBodyProps, "children"> {
  bookings: Booking[];
  onCancelClick?: ComponentProps<typeof BookingsTableRow>["onCancelClick"];
  onBookingExpire?: ComponentProps<typeof BookingsTableRow>["onBookingExpire"];
}

const BookingsTableBody: FC<Props> = ({
  bookings,
  onCancelClick,
  onBookingExpire,
  ...props
}) => {
  return (
    <Tbody {...props}>
      {bookings.map((booking) => (
        <BookingsTableRow
          booking={booking}
          onCancelClick={onCancelClick}
          onBookingExpire={onBookingExpire}
          key={booking.id}
        />
      ))}
    </Tbody>
  );
};

export { BookingsTableBody };
