import { useQuery } from "@tanstack/react-query";

import { dsaApi } from "../api/dsa.api";

export function useDSATopics() {
  return useQuery({
    queryKey: ["dsa-topics"],
    queryFn: dsaApi.getTopics,
  });
}