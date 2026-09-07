import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roadmapsApi } from "../api/roadmaps.api";

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapId: string) => roadmapsApi.deleteRoadmap(roadmapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
}
