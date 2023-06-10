import { FC } from "react";
import {
  Card,
  CardBody,
  CardProps,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { formatPrice } from "utils/price";

import { Subscription } from "../types/subscription";

interface Props extends CardProps {
  subscription: Subscription;
}

const SubscriptionCard: FC<Props> = ({ subscription, ...props }) => {
  return (
    <Card
      cursor="pointer"
      _checked={{ bg: "blue.500", color: "white" }}
      {...props}
    >
      <CardBody>
        <Flex gap={3} justifyContent="space-between" alignItems="center">
          <Stack>
            <Heading size="sm">{subscription.title}</Heading>
            <Text>Бесплатное начало поездок</Text>
          </Stack>
          <Heading size="sm">{formatPrice(subscription.price)}</Heading>
        </Flex>
      </CardBody>
    </Card>
  );
};

export { SubscriptionCard };
