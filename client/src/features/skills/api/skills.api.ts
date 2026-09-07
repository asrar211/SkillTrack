import apiClient from "@/api/client";
import type {
  SkillResponse,
  SkillsResponse,
} from "../skills.types";

export const skillsApi = {
  getSkills: async (): Promise<SkillsResponse> => {
    const response = await apiClient.get<SkillsResponse>("/skills");

    return response.data;
  },

  getSkillById: async (
    id: string
  ): Promise<SkillResponse> => {
    const response = await apiClient.get<SkillResponse>(
      `/skills/${id}`
    );

    return response.data;
  },
};