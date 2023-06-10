import { ComponentProps, FC } from "react";
import { Box, useRadio } from "@chakra-ui/react";

import { SubscriptionCard } from "./SubscriptionCard";

type Props = ComponentProps<typeof SubscriptionCard>;

const SubscriptionRadioCard: FC<Props> = ({ subscription, ...props }) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <SubscriptionCard subscription={subscription} {...checkbox} />
    </Box>
  );
};

export { SubscriptionRadioCard };
