import { useMutation, useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "../api/recommendations.api";

export const useRecommendations = () =>
  useQuery({
    queryKey: ["recommendations"],
    queryFn: recommendationsApi.getRecommendations,
  });

export const useAIRecommendations = () =>
  useMutation({ mutationFn: recommendationsApi.getAIRecommendations });
