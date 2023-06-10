import { FC } from "react";
import {
  Card,
  CardBody,
  Heading,
  Stack,
  CardProps,
  Button,
} from "@chakra-ui/react";

interface Props extends Omit<CardProps, "children"> {
  onListClick?: () => void;
}

const UsersCard: FC<Props> = ({ onListClick, ...props }) => {
  return (
    <Card {...props}>
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md">Пользователи</Heading>

          <Button
            onClick={onListClick}
            colorScheme="blue"
            variant="link"
            size="sm"
          >
            Посмотреть пользователей
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export { UsersCard };
