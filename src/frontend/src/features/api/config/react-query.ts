import { QueryClientConfig } from "@tanstack/react-query";

const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
};

export { QUERY_CLIENT_CONFIG };
