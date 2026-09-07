// src/features/goals/hooks/useTodayGoal.ts

import { useQuery } from "@tanstack/react-query";
import { goalsApi } from "../api/goals.api";

export const useTodayGoal = () => {
  return useQuery({
    queryKey: ["daily-goal", "today"],
    queryFn: () => goalsApi.getTodayGoal(),
  });
};