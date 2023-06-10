import { ComponentProps, FC } from "react";

import { removeAuthToken } from "features/api";
import { useInvalidateCurrentUser } from "features/user";

import { LogoutButton } from "../views/LogoutButton";

type Props = Omit<ComponentProps<typeof LogoutButton>, "onClick">;

const LogoutButtonController: FC<Props> = (props) => {
  const { invalidateCurrentUser } = useInvalidateCurrentUser();

  const onClick = async () => {
    removeAuthToken();
    await invalidateCurrentUser();
  };

  return <LogoutButton onClick={onClick} {...props} />;
};

export { LogoutButtonController };
