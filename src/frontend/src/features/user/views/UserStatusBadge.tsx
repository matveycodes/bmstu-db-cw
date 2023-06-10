import { Badge } from "@chakra-ui/react";
import { FC } from "react";

import { User } from "../types/user";
import { USER_STATUS_COLOR, USER_STATUS_HUMAN_TITLE } from "../config/status";

interface Props {
  user: User;
}

const UserStatusBadge: FC<Props> = ({ user }) => {
  return (
    <Badge colorScheme={USER_STATUS_COLOR[user.status]}>
      {USER_STATUS_HUMAN_TITLE[user.status]}
    </Badge>
  );
};

export { UserStatusBadge };
