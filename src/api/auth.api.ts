import apiClient from "@/lib/apiClient";
import { IRegiserPayload } from "@/types/auth.types";


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