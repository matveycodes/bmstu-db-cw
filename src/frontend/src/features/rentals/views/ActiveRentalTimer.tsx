import { ComponentProps, FC } from "react";
import Countdown, { CountdownRendererFn, zeroPad } from "react-countdown";
import { Text } from "@chakra-ui/react";

import { Rental } from "../types/rental";

interface Props extends Omit<ComponentProps<typeof Countdown>, "date"> {
  rental: Rental;
}

const ActiveRentalTimer: FC<Props> = ({ rental, ...props }) => {
  return (
    <Countdown
      overtime
      date={rental.date_started}
      renderer={renderer}
      {...props}
    />
  );
};

const renderer: CountdownRendererFn = ({ hours, minutes, seconds }) => (
  <Text>
    {hours > 0 && `${zeroPad(hours)}:`}
    {zeroPad(minutes)}:{zeroPad(seconds)}
  </Text>
);

export { ActiveRentalTimer };
