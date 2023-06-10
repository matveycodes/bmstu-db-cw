import NiceModal from "@ebay/nice-modal-react";

import { UsersCard } from "../views/UsersCard";

import { AdminUsersModalController } from "./AdminUsersModalController";

const AdminUsersCardController = () => {
  return <UsersCard onListClick={onListClick} />;
};

const onListClick = () => {
  void NiceModal.show(AdminUsersModalController);
};

export { AdminUsersCardController };
