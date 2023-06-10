import { FC, useEffect, useState } from "react";
import {
  HStack,
  PinInput,
  PinInputField,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";

interface Props extends Omit<StackProps, "children"> {
  phone: string;
  onFill?: (code: number) => void;
  isDisabled?: boolean;
}

const CodeForm: FC<Props> = ({ phone, onFill, isDisabled, ...props }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value.length === 6) {
      onFill?.(+value);
    }
  }, [value]);

  return (
    <Stack spacing={3} {...props}>
      <Text>
        На <Text as="strong">{phone}</Text> было отправлено сообщение с коротким
        кодом. Введите его в поле ниже.
      </Text>

      <HStack>
        <PinInput otp value={value} onChange={setValue} isDisabled={isDisabled}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
    </Stack>
  );
};

export { CodeForm };
