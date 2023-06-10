import { Button, ButtonProps } from "@chakra-ui/react";
import { FC } from "react";

const LogoutButton: FC<ButtonProps> = (props) => {
  return (
    <Button colorScheme="red" {...props}>
      Выйти
    </Button>
  );
};

export { LogoutButton };
