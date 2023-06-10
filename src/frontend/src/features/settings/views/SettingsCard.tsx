import { FC } from "react";
import { Card, CardBody, Heading, Stack, CardProps } from "@chakra-ui/react";

import { Setting } from "../types/setting";

import { SettingsTable } from "./SettingsTable";

interface Props extends Omit<CardProps, "children"> {
  settings: Setting[];
}

const SettingsCard: FC<Props> = ({ settings, ...props }) => {
  return (
    <Card {...props}>
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md">Настройки</Heading>

          <SettingsTable settings={settings} />
        </Stack>
      </CardBody>
    </Card>
  );
};

export { SettingsCard };
