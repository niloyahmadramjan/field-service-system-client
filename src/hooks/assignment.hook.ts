import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptAssignment, getAssignment, getAssignments, rejectAssignment } from "@/api/assignment.api";
import { technicianWorkOrderKeys } from "@/hooks/technician-work-order.hook";
import type { AssignmentListParams } from "@/types/assignment.types";

export const assignmentKeys = {
  all: ["technician", "assignments"] as const,
  list: (params: AssignmentListParams) => ["technician", "assignments", "list", params] as const,
  detail: (id: string) => ["technician", "assignments", "detail", id] as const,
};

export function useAssignments(params: AssignmentListParams) {
  return useQuery({ queryKey: assignmentKeys.list(params), queryFn: () => getAssignments(params) });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: async () => {
      const response = await getAssignment(id);
      const data = Array.isArray(response.data) ? response.data.find((item) => item.id === id) ?? response.data[0] : response.data;
      return { ...response, data };
    },
    enabled: Boolean(id),
  });
}

function useAssignmentDecision(decide: typeof acceptAssignment) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: decide,
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: assignmentKeys.all }),
      client.invalidateQueries({ queryKey: technicianWorkOrderKeys.all }),
    ]),
  });
}

export const useAcceptAssignment = () => useAssignmentDecision(acceptAssignment);
export const useRejectAssignment = () => useAssignmentDecision(rejectAssignment);
