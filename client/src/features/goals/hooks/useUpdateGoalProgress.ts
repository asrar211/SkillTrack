// src/features/goals/hooks/useUpdateGoalProgress.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "../api/goals.api";
import type {
  UpdateDailyGoalProgressPayload,
} from "../goals.types";

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateDailyGoalProgressPayload
    ) => goalsApi.updateGoalProgress(payload),

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