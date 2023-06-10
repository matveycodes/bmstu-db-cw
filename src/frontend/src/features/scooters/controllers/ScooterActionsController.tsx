import { FC, useMemo } from "react";
import pick from "lodash/pick";

import { Scooter } from "../types/scooter";
import { SCOOTER_ACTIONS } from "../config/scooter-actions";

import { ScooterActions } from "../views/ScooterActions";

interface Props {
  scooterId: Scooter["id"];
  visibleActions?: (keyof typeof SCOOTER_ACTIONS)[];
}

const ScooterActionsController: FC<Props> = ({
  scooterId,
  visibleActions = [],
}) => {
  const actions = useMemo(() => {
    const result = pick(SCOOTER_ACTIONS, visibleActions);

    return Object.entries(result).map(([key, { title, callback }]) => {
      return { key, title, props: { onClick: () => callback(scooterId) } };
    });
  }, [scooterId, visibleActions]);

  return <ScooterActions actions={actions} />;
};

export { ScooterActionsController };
