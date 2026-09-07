import apiClient from "./client";

export interface HealthResponse {
    success: boolean;
    message: string
}

export const healthApi = async(): Promise<HealthResponse> => {
        const response = await apiClient.get<HealthResponse>("/health");

        return response.data;
    };