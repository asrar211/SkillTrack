import { useQuery } from "@tanstack/react-query";
import { dependenciesApi } from "../api/dependencies.api";

export function useSkillDependencies(skillId: string) {
  const prerequisites = useQuery({
    queryKey: ["skill-prerequisites", skillId],
    queryFn: () => dependenciesApi.getPrerequisites(skillId),
    enabled: Boolean(skillId),
  });

  const dependents = useQuery({
    queryKey: ["skill-dependents", skillId],
    queryFn: () => dependenciesApi.getDependents(skillId),
    enabled: Boolean(skillId),
  });

  return { prerequisites, dependents };
}
