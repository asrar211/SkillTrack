import type { LearningRecommendation } from "@/features/dashboard/dashboard.types";

export interface RecommendationsResponse {
  success: boolean;
  data: LearningRecommendation[];
}

export interface AIRecommendation {
  skill: string;
  why: string;
  nextStep: string;
}

export interface AIRecommendationsResponse {
  success: boolean;
  data: {
    recommendations: LearningRecommendation[];
    ai: {
      summary: string;
      recommendations: AIRecommendation[];
    };
  };
}
