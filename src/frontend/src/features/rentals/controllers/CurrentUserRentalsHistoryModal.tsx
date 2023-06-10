import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { useRentalsHistory } from "../hooks/useRentalsHistory";

import { RentalsHistoryModal } from "../views/RentalsHistoryModal";

const CurrentUserRentalsHistoryModal = NiceModal.create(() => {
  const modal = useModal();

  const { data: rentals = [], isLoading } = useRentalsHistory();

  return (
    <RentalsHistoryModal
      rentals={rentals}
      isLoading={isLoading}
      isOpen={modal.visible}
      onClose={modal.hide}
      onCloseComplete={modal.remove}
    />
  );
});

export { CurrentUserRentalsHistoryModal };
