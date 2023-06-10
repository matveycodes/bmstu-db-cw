import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { SubscriptionsModal } from "../views/SubscriptionsModal";

import { SubscriptionsTabController } from "./SubscriptionsTabController";
import { CurrentUserActiveSubscriptionsTabController } from "./CurrentUserActiveSubscriptionsTabController";
import { CurrentUserFinishedSubscriptionsController } from "./CurrentUserFinishedSubscriptionsController";

const SubscriptionsModalController = NiceModal.create(() => {
  const modal = useModal();

  return (
    <SubscriptionsModal
      subscriptionsTab={<SubscriptionsTabController />}
      activeSubscriptionsTab={<CurrentUserActiveSubscriptionsTabController />}
      finishedSubscriptionsTab={<CurrentUserFinishedSubscriptionsController />}
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
    />
  );
});

export { SubscriptionsModalController };
