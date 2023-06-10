import { useQuery, UseQueryOptions } from "features/api";

import { getTariff } from "../api/tariff";

import { Tariff } from "../types/tariff";

type UseTariffOptions = Omit<UseQueryOptions<Tariff>, "queryKey" | "queryFn">;

const useTariff = (options?: UseTariffOptions) => {
  return useQuery({
    queryKey: ["tariff"],
    queryFn: ({ signal }) => getTariff({ signal }),
    ...options,
  });
};

export { useTariff };
