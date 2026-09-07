import apiClient from "@/api/client";

import type {
  LearningProgressResponse,
  LearningProgressListResponse,
  ProgressSummaryResponse,
  SkillProgressResponse,
  TopicProgressResponse,
  UpdateLearningProgressPayload,
} from "../progress.types";

export const progressApi = {
  getLearningProgress: async (): Promise<LearningProgressListResponse> => {
    const response = await apiClient.get<LearningProgressListResponse>("/progress");
    return response.data;
  },

  getProgressSummary: async (): Promise<ProgressSummaryResponse> => {
    const response = await apiClient.get<ProgressSummaryResponse>("/progress/summary");
    return response.data;
  },
  updateProgress: async (
    payload: UpdateLearningProgressPayload
  ): Promise<LearningProgressResponse> => {
    const response =
      await apiClient.put<LearningProgressResponse>(
        "/progress",
        payload
      );

    return response.data;
  },

  getSkillProgress: async (
    skillId: string
  ): Promise<SkillProgressResponse> => {
    const response =
      await apiClient.get<SkillProgressResponse>(
        `/progress/skills/${skillId}`
      );

    return response.data;
  },

  getTopicProgress: async (
    skillId: string
  ): Promise<TopicProgressResponse> => {
    const response =
      await apiClient.get<TopicProgressResponse>(
        `/progress/skills/${skillId}/topics`
      );

    return response.data;
  },
};
