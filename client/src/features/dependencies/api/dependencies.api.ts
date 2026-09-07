import apiClient from "@/api/client";
import type { SkillDependenciesResponse } from "../dependencies.types";

export const dependenciesApi = {
  getPrerequisites: async (skillId: string): Promise<SkillDependenciesResponse> => {
    const response = await apiClient.get<SkillDependenciesResponse>(
      `/skill-dependencies/${skillId}/prerequisites`
    );
    return response.data;
  },
  getDependents: async (skillId: string): Promise<SkillDependenciesResponse> => {
    const response = await apiClient.get<SkillDependenciesResponse>(
      `/skill-dependencies/${skillId}/dependents`
    );
    return response.data;
  },
};
