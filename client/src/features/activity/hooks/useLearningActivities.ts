// src/features/activity/hooks/useLearningActivities.ts

import { useQuery } from "@tanstack/react-query";
import { activityApi } from "../api/activity.api";

export const useLearningActivities = (limit = 20) => {
  return useQuery({
    queryKey: ["learning-activities", limit],
    queryFn: () => activityApi.getActivities(limit),
  });
};
