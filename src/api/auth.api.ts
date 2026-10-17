import apiClient from "@/lib/apiClient";


export function authLogin(payload: {email: string, password: string}){
    return apiClient("/auth/login", {
        method: "POST",
        body: payload
    })
}