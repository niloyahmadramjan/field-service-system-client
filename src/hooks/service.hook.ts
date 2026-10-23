import { createService, deleteService, getService, getServices, requestService, updateService } from "@/api/service.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: string; payload: Parameters<typeof requestService>[1] }) =>
      requestService(serviceId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer", "dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["customer", "requests"] }),
      ]);
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: string; payload: Parameters<typeof updateService>[1] }) =>
      updateService(serviceId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
        queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.serviceId) }),
      ]);
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}
