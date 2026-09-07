import { useQuery } from "@tanstack/react-query";

import { dsaApi } from "../api/dsa.api";

export function useDSAProgress() {
  return useQuery({
    queryKey: ["dsa-progress"],
    queryFn: dsaApi.getProgress,
  });
}