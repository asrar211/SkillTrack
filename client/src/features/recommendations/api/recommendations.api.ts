import apiClient from "@/api/client";
import type {
  AIRecommendationsResponse,
  RecommendationsResponse,
} from "../recommendations.types";

export const recommendationsApi = {
  getRecommendations: async (): Promise<RecommendationsResponse> => {
    const response = await apiClient.get<RecommendationsResponse>("/recommendations");
    return response.data;
  },
  getAIRecommendations: async (): Promise<AIRecommendationsResponse> => {
    const response = await apiClient.get<AIRecommendationsResponse>("/ai/recommendations");
    return response.data;
  },
};
