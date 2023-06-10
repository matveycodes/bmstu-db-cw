import { ComponentProps, FC } from "react";

import { useRestrictedZones } from "features/restricted-zones";

import { RestrictedZonesLayer } from "../views/RestrictedZonesLayer";

type Props = Omit<
  ComponentProps<typeof RestrictedZonesLayer>,
  "restrictedZones"
>;

const RestrictedZonesLayerController: FC<Props> = (props) => {
  const { data: restrictedZones = [] } = useRestrictedZones();

  return <RestrictedZonesLayer restrictedZones={restrictedZones} {...props} />;
};

export { RestrictedZonesLayerController };
