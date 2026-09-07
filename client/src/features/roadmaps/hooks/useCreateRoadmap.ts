import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roadmapsApi } from "../api/roadmaps.api";
import type { CreateRoadmapPayload } from "../roadmaps.types";

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoadmapPayload) =>
      roadmapsApi.createRoadmap(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roadmaps"],
      });
    },
  });
}