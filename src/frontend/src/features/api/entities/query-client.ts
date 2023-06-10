import { QueryClient } from "@tanstack/react-query";

import { QUERY_CLIENT_CONFIG } from "../config/react-query";

const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

export { queryClient };
