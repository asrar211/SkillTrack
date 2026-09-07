// src/features/goals/hooks/useCreateGoal.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "../api/goals.api";
import type { CreateDailyGoalPayload } from "../goals.types";

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateDailyGoalPayload
    ) => goalsApi.createGoal(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["daily-goal", "today"],
      });

      queryClient.invalidateQueries({
        queryKey: ["streak"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};