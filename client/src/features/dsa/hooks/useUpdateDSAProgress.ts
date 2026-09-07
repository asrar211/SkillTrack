import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dsaApi } from "../api/dsa.api";
import type { UpdateDSAProgressPayload } from "../dsa.types";

export const useUpdateDSAProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateDSAProgressPayload
    ) => dsaApi.updateProgress(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dsa-progress"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dsa-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "dsa-problem",
          variables.problemId,
        ],
      });
    },
  });
};