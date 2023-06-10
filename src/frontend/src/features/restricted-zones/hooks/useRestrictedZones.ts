import { useQuery } from "features/api";

import { getRestrictedZones } from "../api/restricted-zones";

const useRestrictedZones = () => {
  return useQuery({
    queryKey: ["restricted-zone", "list"],
    queryFn: ({ signal }) => getRestrictedZones({ signal }),
  });
};

export { useRestrictedZones };
