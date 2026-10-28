import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyWorkOrder, getMyWorkOrders, updateMyWorkOrderStatus } from "@/api/technician-work-order.api";
import type { TechnicianWorkOrderListParams } from "@/types/technician-work-order.types";
import type { WorkOrderStatus } from "@/types/work-order.types";

export const technicianWorkOrderKeys = {
  all: ["technician", "work-orders"] as const,
  list: (params: TechnicianWorkOrderListParams) => ["technician", "work-orders", "list", params] as const,
  detail: (workOrderId: string) => ["technician", "work-orders", "detail", workOrderId] as const,
};

export function useMyWorkOrders(params: TechnicianWorkOrderListParams) {
  return useQuery({
    queryKey: technicianWorkOrderKeys.list(params),
    queryFn: () => getMyWorkOrders(params),
  });
}

export function useMyWorkOrder(workOrderId: string) {
  return useQuery({
    queryKey: technicianWorkOrderKeys.detail(workOrderId),
    queryFn: () => getMyWorkOrder(workOrderId),
    enabled: Boolean(workOrderId),
  });
}

export function useUpdateMyWorkOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workOrderId, status }: { workOrderId: string; status: WorkOrderStatus }) =>
      updateMyWorkOrderStatus(workOrderId, { status }),
    onSuccess: async (_response, { workOrderId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: technicianWorkOrderKeys.all }),
        queryClient.invalidateQueries({ queryKey: technicianWorkOrderKeys.detail(workOrderId) }),
      ]);
    },
  });
}
