import { FC } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

const LoginButton: FC<ButtonProps> = (props) => {
  return (
    <Button colorScheme="blue" leftIcon={<LockIcon />} {...props}>
      Войти
    </Button>
  );
};

export { LoginButton };
