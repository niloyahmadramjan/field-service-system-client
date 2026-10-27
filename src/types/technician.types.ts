export type TechnicianStatus = "AVAILABLE" | "BUSY" | "OFFLINE";
export type TechnicianApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  userId: string;
  employeeId: string;
  status: TechnicianStatus;
  applicationStatus: TechnicianApplicationStatus;
  skills: string | null;
  bio: string | null;
  rejectedReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: TechnicianUser;
}

export interface TechnicianPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TechnicianListParams {
  page: number;
  limit: number;
  applicationStatus?: TechnicianApplicationStatus;
  searchTerm?: string;
}

export interface TechnicianListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Technician[];
  meta: TechnicianPageMeta;
}

export interface TechnicianDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Technician | Technician[];
}

export interface TechnicianActionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Technician | null;
}
