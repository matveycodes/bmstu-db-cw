import { FC } from "react";
import { Button, ButtonProps, Skeleton } from "@chakra-ui/react";

import { formatPhone, PHONE_FORMAT } from "utils/phone";

import { User } from "../types/user";

interface Props extends Omit<ButtonProps, "children"> {
  user: User | undefined;
}

const UserButton: FC<Props> = ({ user, ...props }) => {
  return (
    <Button colorScheme="blue" {...props}>
      <Skeleton isLoaded={!!user}>
        {user ? user.first_name ?? formatPhone(user.phone) : PHONE_FORMAT}
      </Skeleton>
    </Button>
  );
};

export { UserButton };
