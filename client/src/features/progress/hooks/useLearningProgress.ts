import { useQuery } from "@tanstack/react-query";
import { progressApi } from "../api/progress.api";

export function useLearningProgress() {
  return useQuery({
    queryKey: ["learning-progress"],
    queryFn: progressApi.getLearningProgress,
  });
}

export function useProgressSummary() {
  return useQuery({
    queryKey: ["progress-summary"],
    queryFn: progressApi.getProgressSummary,
  });
}
