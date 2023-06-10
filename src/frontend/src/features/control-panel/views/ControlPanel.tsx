import { FC } from "react";
import { Stack, StackProps } from "@chakra-ui/react";

const ControlPanel: FC<StackProps> = ({ children, ...props }) => {
  return (
    <Stack spacing={3} alignItems="flex-start" p={5} overflow="auto" {...props}>
      {children}
    </Stack>
  );
};

export { ControlPanel };
