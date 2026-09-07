import { useQuery } from "@tanstack/react-query";

import { roadmapsApi } from "../api/roadmaps.api";

export function useRoadmaps() {
  return useQuery({
    queryKey: ["roadmaps"],
    queryFn: roadmapsApi.getRoadmaps,
  });
}