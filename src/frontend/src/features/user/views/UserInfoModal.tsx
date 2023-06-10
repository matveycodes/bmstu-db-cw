import { ComponentProps, FC } from "react";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";

import { formatPhone } from "utils/phone";

import { User } from "../types/user";

import { UserInfoForm } from "./UserInfoForm";
import { UserStatusBadge } from "./UserStatusBadge";

interface Props extends Omit<ModalProps, "children"> {
  user: User;
  onSubmit?: ComponentProps<typeof UserInfoForm>["onSubmit"];
}

const UserInfoModal: FC<Props> = ({ user, onSubmit, ...props }) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent maxW="min(600px, 90vw)">
        <ModalHeader display="flex" alignItems="center" gap={2}>
          {formatPhone(user.phone)} <UserStatusBadge user={user} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UserInfoForm user={user} onSubmit={onSubmit} />
        </ModalBody>
        <Box h={3} />
      </ModalContent>
    </Modal>
  );
};

export { UserInfoModal };
