import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  roadmapsApi,
  type ReorderRoadmapItem,
} from "../api/roadmaps.api";

interface ReorderVariables {
  roadmapId: string;
  items: ReorderRoadmapItem[];
}

export function useReorderRoadmapItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      items,
    }: ReorderVariables) =>
      roadmapsApi.reorderRoadmapItems(
        roadmapId,
        items
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