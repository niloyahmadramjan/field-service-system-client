import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addInvoiceItem, createInvoice, deleteInvoice, getInvoice, getInvoices, updateInvoice } from "@/api/report.api";
import { workOrderKeys } from "@/hooks/work-order.hook";
import type { InvoiceListParams } from "@/types/report.types";

export const invoiceKeys = {
  all: ["admin", "invoices"] as const,
  list: (params: InvoiceListParams) => ["admin", "invoices", "list", params] as const,
  detail: (invoiceId: string) => ["admin", "invoices", "detail", invoiceId] as const,
};

export function useInvoices(params: InvoiceListParams) {
  return useQuery({ queryKey: invoiceKeys.list(params), queryFn: () => getInvoices(params) });
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => getInvoice(invoiceId),
    enabled: Boolean(invoiceId),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: async (_result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
        queryClient.invalidateQueries({ queryKey: workOrderKeys.all }),
        queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(payload.workOrderId) }),
      ]);
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: { invoiceId: string; payload: Parameters<typeof updateInvoice>[1] }) => updateInvoice(invoiceId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
        queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(variables.invoiceId) }),
      ]);
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
  });
}

export function useAddInvoiceItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: { invoiceId: string; payload: Parameters<typeof addInvoiceItem>[1] }) => addInvoiceItem(invoiceId, payload),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
        queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(variables.invoiceId) }),
      ]);
    },
  });
}
