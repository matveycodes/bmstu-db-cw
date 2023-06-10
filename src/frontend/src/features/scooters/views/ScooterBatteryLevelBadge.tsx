import { FC, useMemo } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";

import { Scooter } from "../types/scooter";

import { getBatteryLevelColor } from "../utils/battery-level";

interface Props extends Omit<BadgeProps, "children"> {
  scooter: Scooter;
}

const ScooterBatteryLevelBadge: FC<Props> = ({ scooter, ...props }) => {
  const colorScheme = useMemo(() => {
    return getBatteryLevelColor(scooter.battery_level);
  }, [scooter.battery_level]);

  return (
    <Badge colorScheme={colorScheme} {...props}>
      {scooter.battery_level}%
    </Badge>
  );
};

export { ScooterBatteryLevelBadge };
