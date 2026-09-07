import apiClient from "@/api/client";

import type {
  DSAProblemResponse,
  DSAProblemsResponse,
  DSAProgressListResponse,
  DSAProgressResponse,
  CreateDSAProblemPayload,
  DSASummaryResponse,
  DSATopicsResponse,
  UpdateDSAProgressPayload,
} from "../dsa.types";

interface GetDSAProblemsParams {
  platform?: string;
  difficulty?: string;
  topic?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const dsaApi = {
  createProblem: async (payload: CreateDSAProblemPayload): Promise<DSAProblemResponse> => {
    const response = await apiClient.post<DSAProblemResponse>("/dsa/problems", payload);
    return response.data;
  },
  getProblems: async (
    params?: GetDSAProblemsParams
  ): Promise<DSAProblemsResponse> => {
    const response =
      await apiClient.get<DSAProblemsResponse>(
        "/dsa/problems",
        {
          params,
        }
      );

    return response.data;
  },

  getProblemById: async (
    id: string
  ): Promise<DSAProblemResponse> => {
    const response =
      await apiClient.get<DSAProblemResponse>(
        `/dsa/problems/${id}`
      );

    return response.data;
  },

  getTopics: async (): Promise<DSATopicsResponse> => {
    const response =
      await apiClient.get<DSATopicsResponse>(
        "/dsa/topics"
      );

    return response.data;
  },

  getProgress: async (): Promise<DSAProgressListResponse> => {
    const response =
      await apiClient.get<DSAProgressListResponse>(
        "/dsa/progress"
      );

    return response.data;
  },

  getSummary: async (): Promise<DSASummaryResponse> => {
    const response =
      await apiClient.get<DSASummaryResponse>(
        "/dsa/progress/summary"
      );

    return response.data;
  },

  updateProgress: async (
    payload: UpdateDSAProgressPayload
  ): Promise<DSAProgressResponse> => {
    const response =
      await apiClient.put<DSAProgressResponse>(
        "/dsa/progress",
        payload
      );

    return response.data;
  },
};
