import { FC } from "react";
import { Stack, StackProps, useRadioGroup } from "@chakra-ui/react";

import { Subscription } from "../types/subscription";

import { SubscriptionRadioCard } from "./SubscriptionRadioCard";

interface Props extends Omit<StackProps, "onSelect" | "selected"> {
  subscriptions: Subscription[];
  selected?: Subscription;
  onSelect?: (subscription: Subscription) => void;
}

const SubscriptionsList: FC<Props> = ({
  subscriptions,
  onSelect,
  selected,
  ...props
}) => {
  const { getRadioProps } = useRadioGroup({
    value: selected?.id,
    onChange: (id: string) =>
      onSelect?.(subscriptions.find((s) => s.id === id)!),
  });

  return (
    <Stack spacing={3} {...props}>
      {subscriptions.map((subscription) => {
        const radio = getRadioProps({ value: subscription.id });

        return (
          <SubscriptionRadioCard
            key={subscription.id}
            subscription={subscription}
            {...radio}
          />
        );
      })}
    </Stack>
  );
};

export { SubscriptionsList };
