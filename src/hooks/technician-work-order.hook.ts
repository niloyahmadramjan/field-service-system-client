import { useQuery } from "@tanstack/react-query";
import { getMyWorkOrder, getMyWorkOrders } from "@/api/technician-work-order.api";
import type { TechnicianWorkOrderListParams } from "@/types/technician-work-order.types";

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
