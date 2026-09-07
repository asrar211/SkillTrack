import { useQuery } from "@tanstack/react-query";

import { roadmapsApi } from "../api/roadmaps.api";

export function useRoadmapProgress(
  roadmapId: string
) {
  return useQuery({
    queryKey: ["roadmap-progress", roadmapId],
    queryFn: () =>
      roadmapsApi.getRoadmapProgress(roadmapId),
    enabled: Boolean(roadmapId),
  });
}