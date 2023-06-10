import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateActiveSubscriptions = () => {
  const queryClient = useQueryClient();

  const invalidateActiveSubscriptions = useCallback(async () => {
    await queryClient.resetQueries({
      predicate: ({ queryKey }) =>
        queryKey.includes("subscription") && queryKey.includes("active"),
    });
  }, [queryClient]);

  return { invalidateActiveSubscriptions };
};

export { useInvalidateActiveSubscriptions };
