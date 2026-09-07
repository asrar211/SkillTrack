import { useQuery } from "@tanstack/react-query";
import { skillsApi } from "../api/skills.api";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getSkills,
  });
}