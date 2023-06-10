import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useToast } from "@chakra-ui/react";

import { handleErrors, useMutation } from "features/api";
import { useTariff } from "features/tariff";
import { createBooking, useInvalidateBookings } from "features/bookings";
import { startRental, useInvalidateRentals } from "features/rentals";

import { useInvalidateScooters } from "../hooks/useInvalidateScooters";

import { Scooter } from "../types/scooter";

import { RentableScooterInfoModal } from "../views/RentableScooterInfoModal";

interface Props {
  scooter: Scooter;
}

const RentableScooterInfoModalController = NiceModal.create<Props>(
  ({ scooter }) => {
    const modal = useModal();

    const toast = useToast();

    const { data: tariff } = useTariff();

    const { invalidateBookings } = useInvalidateBookings();
    const { invalidateScooters } = useInvalidateScooters();
    const { invalidateRentals } = useInvalidateRentals();

    const bookMutation = useMutation({
      mutationFn: () => createBooking({ scooter_id: scooter.id }),
      onSuccess: async () => {
        await invalidateBookings();
        toast({ title: "Самокат успешно забронирован", status: "success" });
        await invalidateScooters();
        void modal.hide();
      },
      onError: (error) =>
        handleErrors(error, (title) => toast({ title, status: "error" })),
    });

    const rentalMutation = useMutation({
      mutationFn: () => startRental({ scooter_id: scooter.id }),
      onSuccess: async () => {
        await invalidateRentals();
        toast({ title: "Самокат успешно арендован", status: "success" });
        await invalidateScooters();
        void modal.hide();
      },
      onError: (error) =>
        handleErrors(error, (title) => toast({ title, status: "error" })),
    });

    return (
      <RentableScooterInfoModal
        scooter={scooter}
        isOpen={modal.visible}
        onClose={modal.hide}
        onCloseComplete={modal.remove}
        onStartRental={rentalMutation.mutate}
        onBook={bookMutation.mutate}
        isStartingRental={rentalMutation.isLoading}
        isBooking={bookMutation.isLoading}
        tariff={tariff}
      />
    );
  }
);

export { RentableScooterInfoModalController };
