import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignTechnician,
  getApprovedTechnicians,
  getWorkOrder,
  getWorkOrders,
  updateWorkOrderStatus,
} from "@/api/work-order.api";
import type {
  TechnicianListParams,
  WorkOrderListParams,
  WorkOrderStatus,
} from "@/types/work-order.types";

export const workOrderKeys = {
  all: ["admin", "work-orders"] as const,
  list: (params: WorkOrderListParams) => ["admin", "work-orders", "list", params] as const,
  detail: (id: string) => ["admin", "work-orders", "detail", id] as const,
  technicians: (params: TechnicianListParams) => ["admin", "work-orders", "technicians", params] as const,
};

export function useWorkOrders(params: WorkOrderListParams) {
  return useQuery({
    queryKey: workOrderKeys.list(params),
    queryFn: () => getWorkOrders(params),
  });
}

export function useWorkOrder(workOrderId: string) {
  return useQuery({
    queryKey: workOrderKeys.detail(workOrderId),
    queryFn: () => getWorkOrder(workOrderId),
    enabled: Boolean(workOrderId),
  });
}

export function useApprovedTechnicians(params: TechnicianListParams) {
  return useQuery({
    queryKey: workOrderKeys.technicians(params),
    queryFn: () => getApprovedTechnicians(params),
  });
}

export function useAssignTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTechnician,
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workOrderKeys.all }),
        queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(payload.workOrderId) }),
      ]);
    },
  });
}

export function useUpdateWorkOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workOrderId, status }: { workOrderId: string; status: WorkOrderStatus }) =>
      updateWorkOrderStatus(workOrderId, { status }),
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workOrderKeys.all }),
        queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(payload.workOrderId) }),
      ]);
    },
  });
}
