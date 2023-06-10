import { ComponentProps, FC } from "react";
import { Table, TableContainer } from "@chakra-ui/react";

import { Rental } from "../types/rental";

import { ActiveRentalsTableHead } from "./ActiveRentalsTableHead";
import { ActiveRentalsTableBody } from "./ActiveRentalsTableBody";

interface Props {
  rentals: Rental[];
  onFinish?: ComponentProps<typeof ActiveRentalsTableBody>["onFinish"];
}

const ActiveRentalsTable: FC<Props> = ({ rentals, onFinish }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <ActiveRentalsTableHead />
        <ActiveRentalsTableBody rentals={rentals} onFinish={onFinish} />
      </Table>
    </TableContainer>
  );
};

export { ActiveRentalsTable };
