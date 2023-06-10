import { useCallback } from "react";

import { useQueryClient } from "features/api";

const useInvalidateTariff = () => {
  const queryClient = useQueryClient();

  const invalidateTariff = useCallback(async () => {
    await queryClient.resetQueries({
      predicate: ({ queryKey }) => queryKey.includes("tariff"),
    });
  }, [queryClient]);

  return { invalidateTariff };
};

export { useInvalidateTariff };
