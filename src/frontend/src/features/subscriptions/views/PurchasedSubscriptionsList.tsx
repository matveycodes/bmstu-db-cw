import { FC } from "react";
import { Stack, StackProps } from "@chakra-ui/react";

import { PurchasedSubscription } from "../types/purchased-subscription";

import { PurchasedSubscriptionCard } from "./PurchasedSubscriptionCard";

interface Props extends Omit<StackProps, "children>"> {
  purchasedSubscriptions: PurchasedSubscription[];
}

const PurchasedSubscriptionsList: FC<Props> = ({
  purchasedSubscriptions,
  ...props
}) => {
  return (
    <Stack spacing={3} {...props}>
      {purchasedSubscriptions.map((purchasedSubscription, index) => (
        <PurchasedSubscriptionCard
          purchasedSubscription={purchasedSubscription}
          key={index}
        />
      ))}
    </Stack>
  );
};

export { PurchasedSubscriptionsList };
