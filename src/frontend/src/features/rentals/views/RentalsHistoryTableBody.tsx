import { FC } from "react";
import { TableBodyProps, Tbody } from "@chakra-ui/react";

import { Rental } from "../types/rental";

import { RentalsHistoryTableRow } from "./RentalsHistoryTableRow";

interface Props extends Omit<TableBodyProps, "children"> {
  rentals: Rental[];
}

const RentalsHistoryTableBody: FC<Props> = ({ rentals, ...props }) => {
  return (
    <Tbody {...props}>
      {rentals.map((rental) => (
        <RentalsHistoryTableRow rental={rental} key={rental.id} />
      ))}
    </Tbody>
  );
};

export { RentalsHistoryTableBody };
