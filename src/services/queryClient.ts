import { QueryClient } from "@tanstack/react-query";
import { CACHE_CONFIG } from "../constants";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.QUERY_STALE_TIME, // 5 minutes
      gcTime: CACHE_CONFIG.QUERY_CACHE_TIME, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
