// src/features/activity/api/activity.api.ts

import apiClient from "@/api/client";
import type {
  LearningActivityResponse,
} from "../activity.types";

export const activityApi = {
  getActivities: async (limit = 20): Promise<LearningActivityResponse> => {
    const response = await apiClient.get(
      "/activity",
      { params: { limit } }
    );

    return response.data;
  },
};
