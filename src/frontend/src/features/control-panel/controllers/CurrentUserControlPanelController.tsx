import { ComponentProps, FC } from "react";
import { Flex } from "@chakra-ui/react";

import { CurrentUserButtonController, useCurrentUser } from "features/user";
import { CurrentUserActiveBookingsController } from "features/bookings";
import { CurrentUserActiveRentalsController } from "features/rentals";
import { LoginButtonController, LogoutButtonController } from "features/auth";
import { CurrentSettingsCardController } from "features/settings";
import { AdminUsersCardController } from "features/users";

import { ControlPanel } from "../views/ControlPanel";

type Props = Omit<ComponentProps<typeof ControlPanel>, "user" | "isLoading">;

const CurrentUserControlPanelController: FC<Props> = (props) => {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <ControlPanel {...props}>
      {isLoading ? null : user ? (
        <Flex gap={3}>
          <CurrentUserButtonController />
          <LogoutButtonController />
        </Flex>
      ) : (
        <LoginButtonController />
      )}

      {user?.role === "customer" && user?.is_active && (
        <CurrentUserActiveBookingsController />
      )}

      {user?.role === "customer" && user?.is_active && (
        <CurrentUserActiveRentalsController />
      )}

      {user?.role === "admin" && <CurrentSettingsCardController />}

      {user?.role === "admin" && <AdminUsersCardController />}
    </ControlPanel>
  );
};

export { CurrentUserControlPanelController };
