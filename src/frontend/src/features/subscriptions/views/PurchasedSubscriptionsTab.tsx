import { FC } from "react";
import { Box, BoxProps, Center, Spinner, Text } from "@chakra-ui/react";

import { PurchasedSubscription } from "../types/purchased-subscription";

import { PurchasedSubscriptionsList } from "./PurchasedSubscriptionsList";

interface Props extends Omit<BoxProps, "children"> {
  purchasedSubscriptions: PurchasedSubscription[];
  isLoading?: boolean;
}

const PurchasedSubscriptionsTab: FC<Props> = ({
  purchasedSubscriptions,
  isLoading,
  ...props
}) => {
  return (
    <Box {...props}>
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!isLoading && purchasedSubscriptions.length === 0 && (
        <Text>Нет купленных подписок.</Text>
      )}

      {purchasedSubscriptions.length > 0 && (
        <PurchasedSubscriptionsList
          purchasedSubscriptions={purchasedSubscriptions}
        />
      )}
    </Box>
  );
};

export { PurchasedSubscriptionsTab };
