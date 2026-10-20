export type IRegiserPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  TECHNICIAN = "TECHNICIAN",
  CUSTOMER = "CUSTOMER",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  avatarUrl: string | null;
}

export interface ICustomerProfile {
  id: string;
  userId: string;
  address: string;
  city: string;
  district: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProfile extends IUser {
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: ICustomerProfile | null;
  technician: unknown | null;
}

export interface IUpdateProfilePayload {
  name: string;
  phone: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
