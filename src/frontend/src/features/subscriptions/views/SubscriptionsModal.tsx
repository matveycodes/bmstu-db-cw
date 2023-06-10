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

import { SubscriptionsTabs } from "./SubscriptionsTabs";

type Props = Omit<ModalProps, "children"> &
  Pick<
    ComponentProps<typeof SubscriptionsTabs>,
    "subscriptionsTab" | "activeSubscriptionsTab" | "finishedSubscriptionsTab"
  >;

const SubscriptionsModal: FC<Props> = ({
  subscriptionsTab,
  activeSubscriptionsTab,
  finishedSubscriptionsTab,
  ...props
}) => {
  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent maxW="min(600px, 90vw)">
        <ModalHeader>Подписки</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SubscriptionsTabs
            subscriptionsTab={subscriptionsTab}
            activeSubscriptionsTab={activeSubscriptionsTab}
            finishedSubscriptionsTab={finishedSubscriptionsTab}
          />
        </ModalBody>
        <Box h={3} />
      </ModalContent>
    </Modal>
  );
};

export { SubscriptionsModal };
