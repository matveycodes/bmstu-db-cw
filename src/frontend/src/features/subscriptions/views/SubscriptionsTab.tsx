import { ComponentProps, FC } from "react";
import { Box, BoxProps, Center, Spinner, Stack, Text } from "@chakra-ui/react";

import { Subscription } from "../types/subscription";

import { SubscriptionsList } from "./SubscriptionsList";
import { SubscriptionPurchaseAction } from "./SubscriptionPurchaseAction";

interface Props extends Omit<BoxProps, "selected" | "onSelect"> {
  subscriptions: Subscription[];
  isLoading?: boolean;
  selected?: ComponentProps<typeof SubscriptionsList>["selected"];
  onSelect?: ComponentProps<typeof SubscriptionsList>["onSelect"];
  onPurchaseClick?: () => void;
  isPurchasing?: boolean;
  canPurchase?: boolean;
}

const SubscriptionsTab: FC<Props> = ({
  subscriptions,
  isLoading,
  selected,
  onSelect,
  onPurchaseClick,
  isPurchasing,
  canPurchase,
  ...props
}) => {
  return (
    <Box {...props}>
      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!isLoading && subscriptions.length === 0 && (
        <Text>Нет доступных к покупке подписок.</Text>
      )}

      {subscriptions.length > 0 && (
        <Stack spacing={5}>
          <SubscriptionsList
            subscriptions={subscriptions}
            selected={selected}
            onSelect={onSelect}
          />
          <SubscriptionPurchaseAction
            onPurchaseClick={onPurchaseClick}
            isPurchasing={isPurchasing}
            canPurchase={canPurchase}
          />
        </Stack>
      )}
    </Box>
  );
};

export { SubscriptionsTab };
