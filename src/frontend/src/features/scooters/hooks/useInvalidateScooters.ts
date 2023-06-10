import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateScooters = () => {
  const queryClient = useQueryClient();

  const invalidateScooters = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: ({ queryKey }) => queryKey.includes("scooter"),
    });
  }, [queryClient]);

  return { invalidateScooters };
};

export { useInvalidateScooters };
