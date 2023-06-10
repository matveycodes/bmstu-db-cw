import NiceModal from "@ebay/nice-modal-react";
import { useToast } from "@chakra-ui/react";

import { handleErrors, useMutation } from "features/api";
import { useInvalidateScooters } from "features/scooters";
import { SubscriptionsModalController } from "features/subscriptions";

import { formatPrice } from "utils/price";

import { useActiveRentals } from "../hooks/useActiveRentals";
import { useInvalidateRentals } from "../hooks/useInvalidateRentals";

import { finishRental } from "../api/rentals";

import { Rental } from "../types/rental";

import { ActiveRentalsCard } from "../views/ActiveRentalsCard";

import { CurrentUserRentalsHistoryModal } from "./CurrentUserRentalsHistoryModal";

const CurrentUserActiveRentalsController = () => {
  const toast = useToast();

  const { data: rentals = [] } = useActiveRentals({
    refetchInterval: 1000 * 30,
  });

  const { invalidateRentals } = useInvalidateRentals();
  const { invalidateScooters } = useInvalidateScooters();

  const finishMutation = useMutation({
    mutationFn: (rental: Rental) => finishRental(rental.id),
    onSuccess: async (_, rental) => {
      await invalidateRentals();

      const price = formatPrice(rental.total_price);
      toast({
        title: `Аренда успешно завершена, списано ${price}`,
        status: "success",
      });

      await invalidateScooters();
    },
    onError: (error) =>
      handleErrors(error, (title) => toast({ title, status: "error" })),
  });

  return (
    <ActiveRentalsCard
      rentals={rentals}
      onFinish={finishMutation.mutate}
      onHistoryClick={onHistoryClick}
      onSubscriptionsClick={onSubscriptionsClick}
    />
  );
};

const onHistoryClick = () => {
  void NiceModal.show(CurrentUserRentalsHistoryModal);
};

const onSubscriptionsClick = () => {
  void NiceModal.show(SubscriptionsModalController);
};

export { CurrentUserActiveRentalsController };
