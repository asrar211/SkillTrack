import apiClient from "@/api/client";

import type { TopicsResponse } from "../topics.types";

export const topicsApi = {
  getTopicsBySkill: async (
    skillId: string
  ): Promise<TopicsResponse> => {
    const response =
      await apiClient.get<TopicsResponse>(
        `/topics/skill/${skillId}`
      );

    return response.data;
  },
};