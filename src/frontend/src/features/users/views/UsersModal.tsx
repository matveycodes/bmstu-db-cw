import { ComponentProps, FC } from "react";
import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { User } from "features/user";

import { UsersTable } from "./UsersTable";

interface Props extends Omit<ModalProps, "children"> {
  isLoading?: boolean;
  users: User[];
  onBlock?: ComponentProps<typeof UsersTable>["onBlock"];
}

const UsersModal: FC<Props> = ({ users, isLoading, onBlock, ...props }) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent maxW="min(1500px, 90vw)">
        <ModalHeader>Пользователи</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Center>
              <Spinner color="blue.500" />
            </Center>
          )}

          {!isLoading && users.length === 0 && <Text>Нет пользователей.</Text>}

          {users.length > 0 && <UsersTable users={users} onBlock={onBlock} />}
        </ModalBody>
        <Box h={3} />
      </ModalContent>
    </Modal>
  );
};

export { UsersModal };
