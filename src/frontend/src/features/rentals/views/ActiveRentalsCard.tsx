import { ComponentProps, FC, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
  CardProps,
} from "@chakra-ui/react";
import plural from "plural-ru";

import { Rental } from "../types/rental";

import { ActiveRentalsTable } from "./ActiveRentalsTable";

interface Props extends Omit<CardProps, "children"> {
  rentals: Rental[];
  onHistoryClick?: () => void;
  onSubscriptionsClick?: () => void;
  onFinish?: ComponentProps<typeof ActiveRentalsTable>["onFinish"];
}

const ActiveRentalsCard: FC<Props> = ({
  rentals,
  onFinish,
  onHistoryClick,
  onSubscriptionsClick,
  ...props
}) => {
  const countFormatted = useMemo(() => {
    return plural(
      rentals.length,
      "%d активная аренда",
      "%d активных аренды",
      "%d активных аренд"
    );
  }, [rentals.length]);

  return (
    <Card {...props}>
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md">Аренды</Heading>

          <Text>На вашем аккаунте {countFormatted}.</Text>

          {rentals.length > 0 && (
            <ActiveRentalsTable rentals={rentals} onFinish={onFinish} />
          )}

          <Text>
            <Button variant="link" colorScheme="blue" onClick={onHistoryClick}>
              История поездок
            </Button>
          </Text>

          <Text>
            <Button
              variant="link"
              colorScheme="blue"
              onClick={onSubscriptionsClick}
            >
              Подписки
            </Button>
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export { ActiveRentalsCard };
