import { FC, Key } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuProps,
  Text,
} from "@chakra-ui/react";

interface Action {
  key: Key;
  title: string;
  props?: MenuItemProps;
}

interface Props extends Omit<MenuProps, "children"> {
  actions?: Action[];
}

const ScooterActions: FC<Props> = ({ actions = [], ...props }) => {
  return (
    <Menu placement="top" {...props}>
      <MenuButton as={Button} variant="link" size="sm">
        <Text fontWeight={600}>Управлять</Text>
      </MenuButton>
      <MenuList>
        {actions.map((action) => (
          <MenuItem key={action.key} {...action.props}>
            {action.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export { ScooterActions };
