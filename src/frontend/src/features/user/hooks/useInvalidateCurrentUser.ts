import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateCurrentUser = () => {
  const queryClient = useQueryClient();

  const invalidateCurrentUser = useCallback(async () => {
    await queryClient.resetQueries({
      predicate: ({ queryKey }) =>
        queryKey.includes("user") && queryKey.includes("current"),
    });
  }, [queryClient]);

  return { invalidateCurrentUser };
};

export { useInvalidateCurrentUser };
