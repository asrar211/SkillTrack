import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  roadmapsApi,
  type AddRoadmapItemPayload,
} from "../api/roadmaps.api";

interface AddRoadmapItemVariables {
  roadmapId: string;
  payload: AddRoadmapItemPayload;
}

export function useAddRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      payload,
    }: AddRoadmapItemVariables) =>
      roadmapsApi.addRoadmapItem(
        roadmapId,
        payload
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roadmaps"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "roadmap-progress",
          variables.roadmapId,
        ],
      });
    },
  });
}