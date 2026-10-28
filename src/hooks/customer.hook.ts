import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerProfile,
  getCustomerDashboard,
  getMyInvoices,
  getMyPayments,
  getMyRequests,
  getMyRequest,
  getMyVisits,
  getMyWorkOrders,
  getMyFeedback,
  getTechnicianApplication,
  applyAsTechnician,
  updateServiceRequest,
  deleteServiceRequest,
  startInvoicePayment,
  submitFeedback,
  updateCustomerProfile,
} from "@/api/customer.api";

export const customerKeys = {
  dashboard: ["customer", "dashboard"] as const,
  requests: (page = 1, limit = 10) =>
    ["customer", "requests", page, limit] as const,
  request: (requestId: string) => ["customer", "request", requestId] as const,
  workOrders: ["customer", "work-orders"] as const,
  visits: ["customer", "visits"] as const,
  invoices: ["customer", "invoices"] as const,
  payments: ["customer", "payments"] as const,
  profile: ["customer", "profile"] as const,
  feedback: ["customer", "feedback"] as const,
  technicianApplication: ["customer", "technician-application"] as const,
};

export const useCustomerDashboard = () =>
  useQuery({ queryKey: customerKeys.dashboard, queryFn: getCustomerDashboard });
export const useMyRequests = (page = 1, limit = 10) =>
  useQuery({
    queryKey: customerKeys.requests(page, limit),
    queryFn: () => getMyRequests(page, limit),
  });
export const useMyRequest = (requestId: string) =>
  useQuery({
    queryKey: customerKeys.request(requestId),
    queryFn: () => getMyRequest(requestId),
    enabled: Boolean(requestId),
  });
export const useMyWorkOrders = () =>
  useQuery({ queryKey: customerKeys.workOrders, queryFn: getMyWorkOrders });
export const useMyVisits = () =>
  useQuery({ queryKey: customerKeys.visits, queryFn: getMyVisits });
export const useMyInvoices = () =>
  useQuery({ queryKey: customerKeys.invoices, queryFn: getMyInvoices });
export const useMyPayments = () =>
  useQuery({ queryKey: customerKeys.payments, queryFn: getMyPayments });
export const useCustomerProfile = () =>
  useQuery({ queryKey: customerKeys.profile, queryFn: getCustomerProfile });
export const useMyFeedback = () =>
  useQuery({ queryKey: customerKeys.feedback, queryFn: getMyFeedback });
export const useTechnicianApplication = () =>
  useQuery({
    queryKey: customerKeys.technicianApplication,
    queryFn: getTechnicianApplication,
  });

export function useApplyAsTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyAsTechnician,
    onSuccess: async (response) => {
      queryClient.setQueryData(customerKeys.technicianApplication, response);
      await queryClient.invalidateQueries({ queryKey: customerKeys.technicianApplication });
      await queryClient.invalidateQueries({ queryKey: customerKeys.profile });
    },
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: (response) =>
      queryClient.setQueryData(customerKeys.profile, response),
  });
}

export function useStartInvoicePayment() {
  return useMutation({ mutationFn: startInvoicePayment });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.feedback });
      void queryClient.invalidateQueries({ queryKey: customerKeys.workOrders });
    },
  });
}

export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer", "requests"] }),
        queryClient.invalidateQueries({ queryKey: customerKeys.dashboard }),
      ]);
    },
  });
}

export function useDeleteServiceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServiceRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["customer", "requests"] }),
        queryClient.invalidateQueries({ queryKey: customerKeys.dashboard }),
      ]);
    },
  });
}
