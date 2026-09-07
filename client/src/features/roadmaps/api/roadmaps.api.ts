import apiClient from "@/api/client";

import type {
  CreateRoadmapPayload,
  RoadmapProgressResponse,
  RoadmapResponse,
  RoadmapsResponse,
  RoadmapPriority,
} from "../roadmaps.types";

export interface UpdateRoadmapItemPayload {
  priority?: RoadmapPriority;
  estimatedMinutes?: number;
  targetDate?: string | null;
  notes?: string;
}

export interface ReorderRoadmapItem {
  itemId: string;
  order: number;
}

export interface AddRoadmapItemPayload {
  skillId: string;
  topicId?: string;
  priority?: RoadmapPriority;
  estimatedMinutes?: number;
  targetDate?: string;
  notes?: string;
}

interface DeleteRoadmapResponse {
  success: boolean;
  message: string;
}

export const roadmapsApi = {
  getRoadmaps: async (): Promise<RoadmapsResponse> => {
    const response = await apiClient.get<RoadmapsResponse>("/roadmaps");
    return response.data;
  },

  getRoadmapById: async (id: string): Promise<RoadmapResponse> => {
    const response = await apiClient.get<RoadmapResponse>(
      `/roadmaps/${id}`
    );
    return response.data;
  },

  getRoadmapProgress: async (
    id: string
  ): Promise<RoadmapProgressResponse> => {
    const response = await apiClient.get<RoadmapProgressResponse>(
      `/roadmaps/${id}/progress`
    );
    return response.data;
  },

  createRoadmap: async (
    payload: CreateRoadmapPayload
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.post<RoadmapResponse>(
      "/roadmaps",
      payload
    );
    return response.data;
  },

  deleteRoadmap: async (id: string): Promise<DeleteRoadmapResponse> => {
    const response = await apiClient.delete<DeleteRoadmapResponse>(`/roadmaps/${id}`);
    return response.data;
  },

  updateRoadmapItem: async (
    roadmapId: string,
    itemId: string,
    payload: UpdateRoadmapItemPayload
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.patch<RoadmapResponse>(
      `/roadmaps/${roadmapId}/items/${itemId}`,
      payload
    );

    return response.data;
  },

  removeRoadmapItem: async (
    roadmapId: string,
    itemId: string
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.delete<RoadmapResponse>(
      `/roadmaps/${roadmapId}/items/${itemId}`
    );

    return response.data;
  },

  reorderRoadmapItems: async (
    roadmapId: string,
    items: ReorderRoadmapItem[]
  ): Promise<RoadmapResponse> => {
    const response = await apiClient.patch<RoadmapResponse>(
      `/roadmaps/${roadmapId}/items/reorder`,
      { items }
    );

    return response.data;
  },
  
  addRoadmapItem: async (
  roadmapId: string,
  payload: AddRoadmapItemPayload
): Promise<RoadmapResponse> => {
  const response = await apiClient.post<RoadmapResponse>(
    `/roadmaps/${roadmapId}/items`,
    payload
  );

  return response.data;
},
};
