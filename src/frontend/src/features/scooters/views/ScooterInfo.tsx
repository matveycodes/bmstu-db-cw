import {
  SimpleGrid,
  SimpleGridProps,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { formatDuration } from "utils/time";

import { Scooter } from "../types/scooter";

interface Props extends Omit<SimpleGridProps, "children"> {
  scooter: Scooter;
}

const ScooterInfo: FC<Props> = ({ scooter, ...props }) => {
  const humanDuration = useMemo(() => {
    return formatDuration(scooter.estimates.time * 60);
  }, [scooter.estimates.time]);

  return (
    <SimpleGrid columns={2} spacing={3} {...props}>
      <Stat>
        <StatLabel>Хватит на</StatLabel>
        <StatNumber>{humanDuration}</StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Можно проехать</StatLabel>
        <StatNumber>{scooter.estimates.distance} км</StatNumber>
        <StatHelpText>с учётом уровня заряда</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
};

export { ScooterInfo };
