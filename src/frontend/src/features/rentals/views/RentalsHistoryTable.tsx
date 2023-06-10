import { FC } from "react";
import { Table, TableContainer } from "@chakra-ui/react";

import { Rental } from "../types/rental";

import { RentalsHistoryTableHead } from "./RentalsHistoryTableHead";
import { RentalsHistoryTableBody } from "./RentalsHistoryTableBody";

interface Props {
  rentals: Rental[];
}

const RentalsHistoryTable: FC<Props> = ({ rentals }) => {
  return (
    <TableContainer>
      <Table>
        <RentalsHistoryTableHead />
        <RentalsHistoryTableBody rentals={rentals} />
      </Table>
    </TableContainer>
  );
};

export { RentalsHistoryTable };
