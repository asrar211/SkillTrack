import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dsaApi } from "../api/dsa.api";
import type { CreateDSAProblemPayload } from "../dsa.types";

export function useCreateDSAProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDSAProblemPayload) => dsaApi.createProblem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-summary"] });
    },
  });
}
