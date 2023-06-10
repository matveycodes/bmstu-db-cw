import NiceModal from "@ebay/nice-modal-react";

import { useCurrentUser } from "../hooks/useCurrentUser";

import { UserButton } from "../views/UserButton";

import { CurrentUserInfoModalController } from "./CurrentUserInfoModalController";

const CurrentUserButtonController = () => {
  const { data: user } = useCurrentUser();

  return <UserButton user={user} onClick={onClick} />;
};

const onClick = () => {
  void NiceModal.show(CurrentUserInfoModalController);
};

export { CurrentUserButtonController };
