import apiClient from "@/api/client";
import type {
  CreateDailyGoalPayload,
  UpdateDailyGoalProgressPayload,
  DailyGoalResponse,
  StreakResponse,
} from "../goals.types";

export const goalsApi = {
  getTodayGoal: async (): Promise<DailyGoalResponse> => {
    const response = await apiClient.get(
      "/daily-goals/today"
    );

    return response.data;
  },

  createGoal: async (
    payload: CreateDailyGoalPayload
  ): Promise<DailyGoalResponse> => {
    const response = await apiClient.post(
      "/daily-goals",
      payload
    );

    return response.data;
  },

  updateGoalProgress: async (
    payload: UpdateDailyGoalProgressPayload
  ): Promise<DailyGoalResponse> => {
    const response = await apiClient.put(
      "/daily-goals/today/progress",
      payload
    );

    return response.data;
  },

  getStreak: async (): Promise<StreakResponse> => {
    const response = await apiClient.get(
      "/daily-goals/streak"
    );

    return response.data;
  },
};