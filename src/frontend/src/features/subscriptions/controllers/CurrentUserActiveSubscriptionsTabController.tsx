import { useActiveSubscriptions } from "../hooks/useActiveSubscriptions";

import { PurchasedSubscriptionsTab } from "../views/PurchasedSubscriptionsTab";

const CurrentUserActiveSubscriptionsTabController = () => {
  const { data: activeSubscriptions = [], isLoading } =
    useActiveSubscriptions();

  return (
    <PurchasedSubscriptionsTab
      purchasedSubscriptions={activeSubscriptions}
      isLoading={isLoading}
    />
  );
};

export { CurrentUserActiveSubscriptionsTabController };
