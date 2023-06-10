import { FC } from "react";
import { Center, TableHeadProps, Th, Thead, Tr } from "@chakra-ui/react";

type Props = Omit<TableHeadProps, "children">;

const ActiveRentalsTableHead: FC<Props> = (props) => {
  return (
    <Thead {...props}>
      <Tr>
        <Th>
          <Center>Самокат</Center>
        </Th>
        <Th>
          <Center>Длительность</Center>
        </Th>
        <Th>
          <Center>Итого</Center>
        </Th>
        <Th />
      </Tr>
    </Thead>
  );
};

export { ActiveRentalsTableHead };
