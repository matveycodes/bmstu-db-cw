import { ComponentProps, FC } from "react";
import { Table, TableContainer } from "@chakra-ui/react";

import { User } from "features/user";

import { UsersTableHead } from "./UsersTableHead";
import { UsersTableBody } from "./UsersTableBody";
import { UsersTableRow } from "./UsersTableRow";

interface Props {
  users: User[];
  onBlock?: ComponentProps<typeof UsersTableRow>["onBlock"];
}

const UsersTable: FC<Props> = ({ users, onBlock }) => {
  return (
    <TableContainer>
      <Table>
        <UsersTableHead />
        <UsersTableBody users={users} onBlock={onBlock} />
      </Table>
    </TableContainer>
  );
};

export { UsersTable };
