export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
export type InvoiceItemCategory = "MATERIAL" | "LABOR" | "TRANSPORT" | "OTHER";

export interface InvoicePageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvoiceWorkOrder {
  id: string;
  workOrderNumber: string;
  requestId: string;
  customerId: string;
  technicianId: string | null;
  title: string;
  description: string;
  status: string;
  estimatedCost: string | number | null;
  actualCost: string | number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCustomer {
  id: string;
  userId?: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  user?: { name?: string; email?: string; phone?: string | null } | null;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  title: string;
  category: InvoiceItemCategory;
  amount: string | number;
  addedById?: string | null;
  createdAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerId: string;
  amount: string | number;
  status: InvoiceStatus;
  issuedAt: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  workOrder?: InvoiceWorkOrder | null;
  customer?: InvoiceCustomer | null;
  items: InvoiceItem[];
}

export interface InvoiceListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invoice[];
  meta: InvoicePageMeta;
}

export interface InvoiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invoice;
}

export interface InvoiceListParams {
  page: number;
  limit: number;
  status?: InvoiceStatus;
  searchTerm?: string;
}

export interface CreateInvoicePayload {
  workOrderId: string;
  status: "DRAFT";
  dueDate: string | null;
}

export interface UpdateInvoicePayload {
  status?: InvoiceStatus;
  dueDate?: string | null;
}

export interface CreateInvoiceItemPayload {
  title: string;
  category: InvoiceItemCategory;
  amount: number;
}
