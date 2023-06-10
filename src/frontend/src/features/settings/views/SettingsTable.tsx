import { FC } from "react";
import { Table, TableContainer } from "@chakra-ui/react";

import { Setting } from "../types/setting";

import { SettingsTableHead } from "./SettingsTableHead";
import { SettingsTableBody } from "./SettingsTableBody";

interface Props {
  settings: Setting[];
}

const SettingsTable: FC<Props> = ({ settings }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <SettingsTableHead />
        <SettingsTableBody settings={settings} />
      </Table>
    </TableContainer>
  );
};

export { SettingsTable };
