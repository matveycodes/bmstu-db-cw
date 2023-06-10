import Countdown, { CountdownRendererFn, zeroPad } from "react-countdown";
import { ComponentProps, FC } from "react";
import { Text } from "@chakra-ui/react";

import { Booking } from "../types/booking";

interface Props extends Omit<ComponentProps<typeof Countdown>, "date"> {
  booking: Booking;
}

const BookingCountdown: FC<Props> = ({ booking, ...props }) => {
  return (
    <Countdown date={booking.date_finished} renderer={renderer} {...props} />
  );
};

const renderer: CountdownRendererFn = ({ minutes, seconds }) => (
  <Text>
    {zeroPad(minutes)}:{zeroPad(seconds)}
  </Text>
);

export { BookingCountdown };
