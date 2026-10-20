import apiClient from "@/lib/apiClient";
import type { IApiResponse, IRegiserPayload, IUpdateProfilePayload, IUserProfile } from "@/types/auth.types";


export function authLogin(payload: {email: string, password: string}){
    return apiClient("/auth/login", {
        method: "POST",
        body: payload
    })
}


export function authRegister(payload: IRegiserPayload){
    return apiClient("/auth/register", {
        method: "POST",
        body: payload
    })
}

export function getMe(){
    return apiClient<IApiResponse<IUserProfile>>("/auth/me", {
        method: "GET"
    })
}

export function updateMe(payload: IUpdateProfilePayload) {
    return apiClient<IApiResponse<IUserProfile>>("/api/v1/users/me", {
        method: "PATCH",
        body: payload,
    });
}

export function authLogout (){
    return apiClient("/auth/logout")
}
