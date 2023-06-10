import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateUsers = () => {
  const queryClient = useQueryClient();

  const invalidateUsers = useCallback(async () => {
    await queryClient.resetQueries({
      predicate: ({ queryKey }) => queryKey.includes("user"),
    });
  }, [queryClient]);

  return { invalidateUsers };
};

export { useInvalidateUsers };
