import { useState } from "react";
import { useToast } from "@chakra-ui/react";

import { useInvalidateTariff } from "features/tariff";
import { handleErrors, useMutation } from "features/api";

import { purchaseSubscription } from "../api/subscriptions";

import { useSubscriptions } from "../hooks/useSubscriptions";
import { useInvalidateActiveSubscriptions } from "../hooks/useInvalidateActiveSubscriptions";

import { SubscriptionsTab } from "../views/SubscriptionsTab";

import { Subscription } from "../types/subscription";

const SubscriptionsTabController = () => {
  const toast = useToast();

  const { data: subscriptions = [], isLoading } = useSubscriptions();

  const { invalidateActiveSubscriptions } = useInvalidateActiveSubscriptions();
  const { invalidateTariff } = useInvalidateTariff();

  const [selected, setSelected] = useState<Subscription>();

  const purchaseMutation = useMutation({
    mutationFn: () =>
      selected ? purchaseSubscription(selected.id) : Promise.reject(),
    onSuccess: async () => {
      await invalidateActiveSubscriptions();
      toast({ title: "Подписка успешно куплена", status: "success" });
      await invalidateTariff();
    },
    onError: (error) =>
      handleErrors(error, (title) => toast({ title, status: "error" })),
  });

  return (
    <SubscriptionsTab
      subscriptions={subscriptions}
      isLoading={isLoading}
      onPurchaseClick={purchaseMutation.mutate}
      selected={selected}
      onSelect={setSelected}
      canPurchase={!!selected}
      isPurchasing={purchaseMutation.isLoading}
    />
  );
};

export { SubscriptionsTabController };
