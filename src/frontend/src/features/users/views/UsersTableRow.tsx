import { FC, useMemo } from "react";
import { Button, Center, TableRowProps, Td, Tr } from "@chakra-ui/react";
import plural from "plural-ru";

import { User, UserStatusBadge } from "features/user";

import { formatDate } from "utils/time";
import { formatPhone } from "utils/phone";

interface Props extends Omit<TableRowProps, "children"> {
  user: User;
  onBlock?: (user: User) => void;
}

const UsersTableRow: FC<Props> = ({ user, onBlock, ...props }) => {
  const ageFormatted = useMemo(() => {
    if (!user.age) {
      return undefined;
    }

    return plural(user.age, "%d год", "%d года", "%d лет");
  }, [user.age]);

  return (
    <Tr {...props}>
      <Td>
        <Center>{user.first_name ?? "—"}</Center>
      </Td>
      <Td>
        <Center>{user.last_name ?? "—"}</Center>
      </Td>
      <Td>
        <Center>{user.middle_name ?? "—"}</Center>
      </Td>
      <Td>
        <Center>{formatPhone(user.phone)}</Center>
      </Td>
      <Td>
        <Center>
          <UserStatusBadge user={user} />
        </Center>
      </Td>
      <Td>
        <Center>
          {user.birthdate
            ? `${formatDate(user.birthdate, false)} (${ageFormatted})`
            : "—"}
        </Center>
      </Td>
      <Td>
        <Center>{user.email ?? "—"}</Center>
      </Td>
      <Td>
        <Button
          variant="link"
          colorScheme="red"
          onClick={() => onBlock?.(user)}
        >
          Заблокировать
        </Button>
      </Td>
    </Tr>
  );
};

export { UsersTableRow };
