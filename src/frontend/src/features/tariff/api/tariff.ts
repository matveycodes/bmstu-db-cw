import { client, RequestConfig } from "features/api";

import { GetTariffResponse } from "../types/api";
import { Tariff } from "../types/tariff";

const getTariff = async (
  config?: Omit<RequestConfig, "params">
): Promise<Tariff> => {
  const { data } = await client.get<GetTariffResponse>("/tariff/", config);

  return data;
};

export { getTariff };
