import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skills.api";

export function useSkill(id: string) {
  return useQuery({
    queryKey: ["skill", id],
    queryFn: () => skillsApi.getSkillById(id),
    enabled: Boolean(id),
  });
}