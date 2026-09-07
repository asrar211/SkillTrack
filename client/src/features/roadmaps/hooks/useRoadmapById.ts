import { useQuery } from "@tanstack/react-query";
import { roadmapsApi } from "../api/roadmaps.api";

export const useRoadmapById = (
  roadmapId: string
) => {
  return useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () =>
      roadmapsApi.getRoadmapById(roadmapId),
    enabled: Boolean(roadmapId),
  });
};