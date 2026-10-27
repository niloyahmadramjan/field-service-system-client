import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveTechnician, deleteTechnician, getTechnician, getTechnicians, rejectTechnician } from "@/api/technician.api";
import type { TechnicianListParams } from "@/types/technician.types";

export const technicianKeys = {
  all: ["admin", "technicians"] as const,
  list: (params: TechnicianListParams) => ["admin", "technicians", "list", params] as const,
  detail: (technicianId: string) => ["admin", "technicians", "detail", technicianId] as const,
};

export function useTechnicians(params: TechnicianListParams) {
  return useQuery({ queryKey: technicianKeys.list(params), queryFn: () => getTechnicians(params) });
}

export function useTechnician(technicianId: string) {
  return useQuery({
    queryKey: technicianKeys.detail(technicianId),
    queryFn: () => getTechnician(technicianId),
    enabled: Boolean(technicianId),
    select: (response) => Array.isArray(response.data)
      ? response.data.find((technician) => technician.id === technicianId) ?? response.data[0]
      : response.data,
  });
}

function useTechnicianMutation(mutationFn: typeof approveTechnician | typeof rejectTechnician | typeof deleteTechnician) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async (_result, technicianId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: technicianKeys.all }),
        queryClient.invalidateQueries({ queryKey: technicianKeys.detail(technicianId) }),
      ]);
    },
  });
}

export function useApproveTechnician() {
  return useTechnicianMutation(approveTechnician);
}

export function useRejectTechnician() {
  return useTechnicianMutation(rejectTechnician);
}

export function useDeleteTechnician() {
  return useTechnicianMutation(deleteTechnician);
}
