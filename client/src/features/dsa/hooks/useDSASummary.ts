import { useQuery } from "@tanstack/react-query";

import { dsaApi } from "../api/dsa.api";

export function useDSASummary() {
  return useQuery({
    queryKey: ["dsa-summary"],
    queryFn: dsaApi.getSummary,
  });
}