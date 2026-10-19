import { getService, getServices, requestService } from "@/api/service.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const serviceKeys = {
  all: ["services"] as const,
  list: (page: number, limit: number) => ["services", "list", page, limit] as const,
  detail: (serviceId: string) => ["services", "detail", serviceId] as const,
};

export function useServices(page: number, limit = 9) {
  return useQuery({
    queryKey: serviceKeys.list(page, limit),
    queryFn: () => getServices(page, limit),
  });
}

export function useService(serviceId: string) {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => getService(serviceId),
    enabled: Boolean(serviceId),
  });
}

export function useRequestService() {
  return useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: string; payload: Parameters<typeof requestService>[1] }) =>
      requestService(serviceId, payload),
  });
}
