import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateRentals = () => {
  const queryClient = useQueryClient();

  const invalidateRentals = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: ({ queryKey }) => queryKey.includes("rental"),
    });
  }, [queryClient]);

  return { invalidateRentals };
};

export { useInvalidateRentals };
