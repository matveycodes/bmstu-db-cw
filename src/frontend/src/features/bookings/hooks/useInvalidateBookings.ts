import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateBookings = () => {
  const queryClient = useQueryClient();

  const invalidateBookings = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: ({ queryKey }) => queryKey.includes("booking"),
    });
  }, [queryClient]);

  return { invalidateBookings };
};

export { useInvalidateBookings };
