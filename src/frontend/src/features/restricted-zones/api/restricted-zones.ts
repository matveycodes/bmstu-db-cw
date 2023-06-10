import { client, RequestConfig } from "features/api";

import { GetRestrictedZonesResponse } from "../types/api";
import { RestrictedZone } from "../types/restricted-zone";

const getRestrictedZones = async (
  config?: Omit<RequestConfig, "params">
): Promise<RestrictedZone[]> => {
  const { data } = await client.get<GetRestrictedZonesResponse>(
    "/restricted-zones/",
    config
  );

  return data;
};

export { getRestrictedZones };
