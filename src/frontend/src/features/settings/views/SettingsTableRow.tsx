import { FC } from "react";
import { TableRowProps, Td, Tr } from "@chakra-ui/react";

import { Setting } from "../types/setting";

interface Props extends Omit<TableRowProps, "children"> {
  setting: Setting;
}

const SettingsTableRow: FC<Props> = ({ setting, ...props }) => {
  return (
    <Tr {...props}>
      <Td>{setting.name}</Td>
      <Td>{setting.value}</Td>
    </Tr>
  );
};

export { SettingsTableRow };
