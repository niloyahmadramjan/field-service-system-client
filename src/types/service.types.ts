export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServiceListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: { data: Service[]; meta: PaginationMeta };
}

export interface ServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Service;
}

export interface ServiceRequestPayload {
  title: string;
  description: string;
  preferredDate: string;
  address: string;
  city: string;
  district: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  serviceId: string;
  title: string;
  description: string;
  status: string;
  preferredDate: string;
  address: string;
  city: string;
  district: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ServiceRequestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ServiceRequest;
}
