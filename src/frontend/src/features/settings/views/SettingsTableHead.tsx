import { FC } from "react";
import { TableHeadProps, Th, Thead, Tr } from "@chakra-ui/react";

type Props = Omit<TableHeadProps, "children">;

const SettingsTableHead: FC<Props> = (props) => {
  return (
    <Thead {...props}>
      <Tr>
        <Th>Название</Th>
        <Th>Значение</Th>
      </Tr>
    </Thead>
  );
};

export { SettingsTableHead };
