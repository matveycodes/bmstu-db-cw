import { ThemeTypings } from "@chakra-ui/react";

import { User } from "../types/user";

const USER_STATUS_HUMAN_TITLE: Record<User["status"], string> = {
  active: "Активный",
  pending: "Неподтверждённый",
  blocked: "Заблокированный",
};

const USER_STATUS_COLOR: Record<User["status"], ThemeTypings["colorSchemes"]> =
  {
    active: "green",
    pending: "orange",
    blocked: "red",
  };

export { USER_STATUS_HUMAN_TITLE, USER_STATUS_COLOR };
