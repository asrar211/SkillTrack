import { useQuery } from "@tanstack/react-query";
import { dsaApi } from "../api/dsa.api";

export const useDSAProblem = (problemId: string) => {
  return useQuery({
    queryKey: ["dsa-problem", problemId],
    queryFn: () => dsaApi.getProblemById(problemId),
    enabled: Boolean(problemId),
  });
};