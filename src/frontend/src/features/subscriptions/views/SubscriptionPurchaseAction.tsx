import { FC } from "react";
import { Button, Stack, StackProps, Text } from "@chakra-ui/react";

interface Props extends StackProps {
  onPurchaseClick?: () => void;
  isPurchasing?: boolean;
  canPurchase?: boolean;
}

const SubscriptionPurchaseAction: FC<Props> = ({
  onPurchaseClick,
  isPurchasing,
  canPurchase,
  ...props
}) => {
  return (
    <Stack spacing={3} {...props}>
      <Button
        colorScheme="blue"
        isLoading={isPurchasing}
        isDisabled={!canPurchase}
        onClick={onPurchaseClick}
      >
        Купить
      </Button>

      <Text color="gray">
        Подписка начнёт действовать сразу после оплаты. При покупке нескольких
        подписок их срок действия складывается. Вернуть деньги за уже оплаченные
        периоды не получится.
      </Text>
    </Stack>
  );
};

export { SubscriptionPurchaseAction };
