import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  roadmapsApi,
  type UpdateRoadmapItemPayload,
} from "../api/roadmaps.api";

interface UpdateVariables {
  roadmapId: string;
  itemId: string;
  payload: UpdateRoadmapItemPayload;
}

export function useUpdateRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      itemId,
      payload,
    }: UpdateVariables) =>
      roadmapsApi.updateRoadmapItem(
        roadmapId,
        itemId,
        payload
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