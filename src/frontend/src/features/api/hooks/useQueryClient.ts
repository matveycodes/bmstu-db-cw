import { useQueryClient as useReactQueryClient } from "@tanstack/react-query";

const useQueryClient: typeof useReactQueryClient = (options) => {
  return useReactQueryClient(options);
};

export { useQueryClient };
