import { useFinishedSubscriptions } from "../hooks/useFinishedSubscriptions";

import { PurchasedSubscriptionsTab } from "../views/PurchasedSubscriptionsTab";

const CurrentUserFinishedSubscriptionsController = () => {
  const { data: finishedSubscriptions = [], isLoading } =
    useFinishedSubscriptions();

  return (
    <PurchasedSubscriptionsTab
      purchasedSubscriptions={finishedSubscriptions}
      isLoading={isLoading}
    />
  );
};

export { CurrentUserFinishedSubscriptionsController };
