import { ComponentProps, FC, useMemo } from "react";
import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
  CardProps,
} from "@chakra-ui/react";
import plural from "plural-ru";

import { Booking } from "../types/booking";

import { BookingsTable } from "./BookingsTable";

interface Props extends Omit<CardProps, "children"> {
  bookings: Booking[];
  onCancelClick?: ComponentProps<typeof BookingsTable>["onCancelClick"];
  onBookingExpire?: ComponentProps<typeof BookingsTable>["onBookingExpire"];
}

const BookingsCard: FC<Props> = ({
  bookings,
  onCancelClick,
  onBookingExpire,
  ...props
}) => {
  const countFormatted = useMemo(() => {
    return plural(
      bookings.length,
      "%d активное бронирование",
      "%d активных бронирования",
      "%d активных бронирований"
    );
  }, [bookings.length]);

  return (
    <Card {...props}>
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md">Бронирования</Heading>

          <Text>На вашем аккаунте {countFormatted}.</Text>

          {bookings.length > 0 && (
            <BookingsTable
              bookings={bookings}
              onCancelClick={onCancelClick}
              onBookingExpire={onBookingExpire}
            />
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export { BookingsCard };
