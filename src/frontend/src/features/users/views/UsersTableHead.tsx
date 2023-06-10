import { FC } from "react";
import { Center, TableHeadProps, Th, Thead, Tr } from "@chakra-ui/react";

type Props = Omit<TableHeadProps, "children">;

const UsersTableHead: FC<Props> = (props) => {
  return (
    <Thead {...props}>
      <Tr>
        <Th>
          <Center>Имя</Center>
        </Th>
        <Th>
          <Center>Фамилия</Center>
        </Th>
        <Th>
          <Center>Отчество</Center>
        </Th>
        <Th>
          <Center>Телефон</Center>
        </Th>
        <Th>
          <Center>Статус</Center>
        </Th>
        <Th>
          <Center>Дата рождения</Center>
        </Th>
        <Th>
          <Center>Почта</Center>
        </Th>
        <Th />
      </Tr>
    </Thead>
  );
};

export { UsersTableHead };
