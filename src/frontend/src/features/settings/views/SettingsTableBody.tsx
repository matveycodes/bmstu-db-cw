import { FC } from "react";
import { TableBodyProps, Tbody } from "@chakra-ui/react";

import { Setting } from "../types/setting";

import { SettingsTableRow } from "./SettingsTableRow";

interface Props extends Omit<TableBodyProps, "children"> {
  settings: Setting[];
}

const SettingsTableBody: FC<Props> = ({ settings, ...props }) => {
  return (
    <Tbody {...props}>
      {settings.map((setting) => (
        <SettingsTableRow setting={setting} key={setting.name} />
      ))}
    </Tbody>
  );
};

export { SettingsTableBody };
