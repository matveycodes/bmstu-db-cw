import { ComponentProps, FC } from "react";
import { TableBodyProps, Tbody } from "@chakra-ui/react";

import { User } from "features/user";

import { UsersTableRow } from "./UsersTableRow";

interface Props extends Omit<TableBodyProps, "children"> {
  users: User[];
  onBlock?: ComponentProps<typeof UsersTableRow>["onBlock"];
}

const UsersTableBody: FC<Props> = ({ users, onBlock, ...props }) => {
  return (
    <Tbody {...props}>
      {users.map((user) => (
        <UsersTableRow user={user} onBlock={onBlock} key={user.id} />
      ))}
    </Tbody>
  );
};

export { UsersTableBody };
