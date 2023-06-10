import { client, RequestConfig } from "features/api";

import { GetSettingsResponse } from "../types/api";
import { Setting } from "../types/setting";

const getSettings = async (
  config?: Omit<RequestConfig, "params">
): Promise<Setting[]> => {
  const { data } = await client.get<GetSettingsResponse>("/settings/", config);

  return data;
};

export { getSettings };
