import apiClient from "@/lib/apiClient";
import type {
  ServiceListResponse,
  ServiceMutationResponse,
  ServiceDeleteResponse,
  ServicePayload,
  CreateServiceResponse,
  ServiceRequestPayload,
  ServiceRequestResponse,
  ServiceResponse,
} from "@/types/service.types";

export function getServices(page = 1, limit = 9) {
  return apiClient<ServiceListResponse>("/service/get-all", {
    query: { page, limit },
  });
}

export function createService(payload: ServicePayload) {
  return apiClient<CreateServiceResponse>("/service/create", {
    method: "POST",
    body: payload,
  });
}

export function updateService(serviceId: string, payload: ServicePayload) {
  return apiClient<ServiceMutationResponse>(
    `/service/update/${encodeURIComponent(serviceId)}`,
    { method: "PUT", body: payload },
  );
}

export function deleteService(serviceId: string) {
  return apiClient<ServiceDeleteResponse>(
    `/service/delete/${encodeURIComponent(serviceId)}`,
    { method: "DELETE" },
  );
}

export function getService(serviceId: string) {
  return apiClient<ServiceResponse>(
    `/service/get/${encodeURIComponent(serviceId)}`,
  );
}

export function requestService(
  serviceId: string,
  payload: ServiceRequestPayload,
) {
  return apiClient<ServiceRequestResponse>(
    `/request/service/${encodeURIComponent(serviceId)}`,
    { method: "POST", body: payload },
  );
}
