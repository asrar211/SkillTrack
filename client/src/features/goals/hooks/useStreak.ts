// src/features/goals/hooks/useStreak.ts

import { useQuery } from "@tanstack/react-query";
import { goalsApi } from "../api/goals.api";

export const useStreak = () => {
  return useQuery({
    queryKey: ["streak"],
    queryFn: () => goalsApi.getStreak(),
  });
};