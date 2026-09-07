import apiClient from "@/api/client";

import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "../auth.types";

export const authApi = {
    login: async (
        payload: LoginPayload
    ): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            "/auth/login",
            payload
        );

        return response.data;
    },

    register: async (
        payload: RegisterPayload
    ): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            "/auth/register",
            payload
        );

        return response.data;
    },

    me: async (): Promise<AuthResponse> => {
        const response = await apiClient.get<AuthResponse>(
            "/auth/me"
        );

        return response.data;
    },

    logout: async(): Promise<void> => {
        await apiClient.post("/auth/logout");
    }
};