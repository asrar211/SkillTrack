import apiClient from "@/api/client";

import type { DashboardResponse } from "../dashboard.types";

export const dashboardApi = {
    getDashboard: async (): Promise<DashboardResponse> => {
        const response =
            await apiClient.get<DashboardResponse>(
                "/dashboard"
            );

        return response.data;
    },
};