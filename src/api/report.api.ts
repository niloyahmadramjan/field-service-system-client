import apiClient from "@/lib/apiClient";
import type {
  CreateInvoiceItemPayload,
  CreateInvoicePayload,
  InvoiceListParams,
  InvoiceListResponse,
  InvoiceResponse,
  UpdateInvoicePayload,
} from "@/types/report.types";

export function getInvoices(params: InvoiceListParams) {
  return apiClient<InvoiceListResponse>("/invoices", {
    query: {
      page: params.page,
      limit: params.limit,
      ...(params.status ? { status: params.status } : {}),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    },
  });
}

export function getInvoice(invoiceId: string) {
  return apiClient<InvoiceResponse>(`/invoices/${encodeURIComponent(invoiceId)}`);
}

export function createInvoice(payload: CreateInvoicePayload) {
  return apiClient<InvoiceResponse>("/invoices", { method: "POST", body: payload });
}

export function updateInvoice(invoiceId: string, payload: UpdateInvoicePayload) {
  return apiClient<InvoiceResponse>(`/invoices/${encodeURIComponent(invoiceId)}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteInvoice(invoiceId: string) {
  return apiClient<InvoiceResponse>(`/invoices/${encodeURIComponent(invoiceId)}`, {
    method: "DELETE",
  });
}

export function addInvoiceItem(invoiceId: string, payload: CreateInvoiceItemPayload) {
  return apiClient<InvoiceResponse>(
    `/invoices/${encodeURIComponent(invoiceId)}/items`,
    { method: "POST", body: payload },
  );
}
