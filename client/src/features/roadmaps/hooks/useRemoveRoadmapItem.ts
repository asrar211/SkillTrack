import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roadmapsApi } from "../api/roadmaps.api";

interface RemoveVariables {
  roadmapId: string;
  itemId: string;
}

export function useRemoveRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      itemId,
    }: RemoveVariables) =>
      roadmapsApi.removeRoadmapItem(
        roadmapId,
        itemId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roadmaps"],
      });

      queryClient.invalidateQueries({
        queryKey: ["roadmap-progress", variables.roadmapId],
      });
    },
  });
}