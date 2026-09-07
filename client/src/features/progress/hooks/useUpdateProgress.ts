import { useMutation, useQueryClient } from "@tanstack/react-query";

import { progressApi } from "../api/progress.api";
import type { UpdateLearningProgressPayload } from "../progress.types";

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLearningProgressPayload) =>
      progressApi.updateProgress(payload),

    onSuccess: (_, variables) => {
      // Skill data
      queryClient.invalidateQueries({
        queryKey: ["skill", variables.skillId],
      });

      // Skill-level progress
      queryClient.invalidateQueries({
        queryKey: ["skill-progress", variables.skillId],
      });

      // Topic-level progress
      queryClient.invalidateQueries({
        queryKey: ["topic-progress", variables.skillId],
      });

      // Dashboard
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      // Roadmap list
      queryClient.invalidateQueries({
        queryKey: ["roadmaps"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["roadmap-progress"],
      });
    },
  });
}