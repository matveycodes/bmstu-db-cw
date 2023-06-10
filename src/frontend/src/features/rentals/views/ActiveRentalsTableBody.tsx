import { ComponentProps, FC } from "react";
import { TableBodyProps, Tbody } from "@chakra-ui/react";

import { Rental } from "../types/rental";

import { ActiveRentalsTableRow } from "./ActiveRentalsTableRow";

interface Props extends Omit<TableBodyProps, "children"> {
  rentals: Rental[];
  onFinish?: ComponentProps<typeof ActiveRentalsTableRow>["onFinish"];
}

const ActiveRentalsTableBody: FC<Props> = ({ rentals, onFinish, ...props }) => {
  return (
    <Tbody {...props}>
      {rentals.map((rental) => (
        <ActiveRentalsTableRow
          rental={rental}
          key={rental.id}
          onFinish={onFinish}
        />
      ))}
    </Tbody>
  );
};

export { ActiveRentalsTableBody };
