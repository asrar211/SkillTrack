import { useQuery } from "@tanstack/react-query";

import { progressApi } from "../api/progress.api";

export function useSkillProgress(skillId: string) {
  return useQuery({
    queryKey: ["skill-progress", skillId],
    queryFn: () => progressApi.getSkillProgress(skillId),
    enabled: Boolean(skillId),
  });
}