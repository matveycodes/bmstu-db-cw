import { useQuery, UseQueryOptions } from "features/api";

import { getSettings } from "../api/settings";

import { Setting } from "../types/setting";

type UseSettingsOptions = Omit<
  UseQueryOptions<Setting[]>,
  "queryKey" | "queryFn"
>;

const useSettings = (options?: UseSettingsOptions) => {
  return useQuery({
    queryKey: ["setting", "list"],
    queryFn: ({ signal }) => getSettings({ signal }),
    ...options,
  });
};

export { useSettings };
