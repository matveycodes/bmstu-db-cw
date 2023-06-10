import { FC } from "react";
import { Center, TableRowProps, Td, Tr } from "@chakra-ui/react";

import { formatTariff } from "features/tariff";

import { formatPrice } from "utils/price";
import { formatDate, formatDuration } from "utils/time";

import { Rental } from "../types/rental";

interface Props extends Omit<TableRowProps, "children"> {
  rental: Rental;
}

const RentalsHistoryTableRow: FC<Props> = ({ rental, ...props }) => {
  return (
    <Tr {...props}>
      <Td>
        <Center>{rental.scooter_number}</Center>
      </Td>
      <Td>
        <Center>{formatDate(rental.date_started)}</Center>
      </Td>
      <Td>
        <Center>{formatDuration(rental.duration)}</Center>
      </Td>
      <Td>
        <Center>
          {formatTariff({
            start_price: rental.start_price,
            per_minute_price: rental.per_minute_price,
          })}
        </Center>
      </Td>
      <Td>
        <Center>{formatPrice(rental.total_price)}</Center>
      </Td>
    </Tr>
  );
};

export { RentalsHistoryTableRow };
