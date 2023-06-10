import { FC } from "react";
import { Center, TableHeadProps, Th, Thead, Tr } from "@chakra-ui/react";

type Props = Omit<TableHeadProps, "children">;

const RentalsHistoryTableHead: FC<Props> = (props) => {
  return (
    <Thead {...props}>
      <Tr>
        <Th>
          <Center>Самокат</Center>
        </Th>
        <Th>
          <Center>Дата</Center>
        </Th>
        <Th>
          <Center>Длительность</Center>
        </Th>
        <Th>
          <Center>Тариф</Center>
        </Th>
        <Th>
          <Center>Итого</Center>
        </Th>
      </Tr>
    </Thead>
  );
};

export { RentalsHistoryTableHead };
