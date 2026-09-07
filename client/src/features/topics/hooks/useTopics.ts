import { useQuery } from "@tanstack/react-query";

import { topicsApi } from "../api/topics.api";

export function useTopics(skillId: string) {
  return useQuery({
    queryKey: ["topics", skillId],
    queryFn: () =>
      topicsApi.getTopicsBySkill(skillId),
    enabled: Boolean(skillId),
  });
}