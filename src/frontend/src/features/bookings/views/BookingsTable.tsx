import { ComponentProps, FC } from "react";
import { Table, TableContainer, TableContainerProps } from "@chakra-ui/react";

import { Booking } from "../types/booking";

import { BookingsTableHead } from "./BookingsTableHead";
import { BookingsTableBody } from "./BookingsTableBody";

interface Props extends Omit<TableContainerProps, "children"> {
  bookings: Booking[];
  onCancelClick?: ComponentProps<typeof BookingsTableBody>["onCancelClick"];
  onBookingExpire?: ComponentProps<typeof BookingsTableBody>["onBookingExpire"];
}

const BookingsTable: FC<Props> = ({
  bookings,
  onCancelClick,
  onBookingExpire,
  ...props
}) => {
  return (
    <TableContainer {...props}>
      <Table size="sm">
        <BookingsTableHead />
        <BookingsTableBody
          bookings={bookings}
          onCancelClick={onCancelClick}
          onBookingExpire={onBookingExpire}
        />
      </Table>
    </TableContainer>
  );
};

export { BookingsTable };
