import { Center, Th, Thead, Tr, TableHeadProps } from "@chakra-ui/react";
import { FC } from "react";

type Props = Omit<TableHeadProps, "children">;

const BookingsTableHead: FC<Props> = (props) => {
  return (
    <Thead {...props}>
      <Tr>
        <Th>
          <Center>Самокат</Center>
        </Th>
        <Th>
          <Center>Осталось</Center>
        </Th>
        <Th />
      </Tr>
    </Thead>
  );
};

export { BookingsTableHead };
