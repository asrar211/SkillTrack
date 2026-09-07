import { useQuery } from "@tanstack/react-query";

import { progressApi } from "../api/progress.api";

export function useTopicProgress(
  skillId: string
) {
  return useQuery({
    queryKey: ["topic-progress", skillId],
    queryFn: () =>
      progressApi.getTopicProgress(skillId),
    enabled: Boolean(skillId),
  });
}