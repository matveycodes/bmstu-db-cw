import { FC, ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  ModalProps,
} from "@chakra-ui/react";

interface Props extends ModalProps {
  children: ReactNode;
}

const LoginModal: FC<Props> = ({ children, ...props }) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Авторизация</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <Box h={3} />
      </ModalContent>
    </Modal>
  );
};

export { LoginModal };
