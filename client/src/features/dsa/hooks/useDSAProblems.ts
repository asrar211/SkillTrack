import { useQuery } from "@tanstack/react-query";

import { dsaApi } from "../api/dsa.api";

interface UseDSAProblemsParams {
  platform?: string;
  difficulty?: string;
  topic?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useDSAProblems(
  params: UseDSAProblemsParams
) {
  return useQuery({
    queryKey: ["dsa-problems", params],

    queryFn: () =>
      dsaApi.getProblems(params),
  });
}