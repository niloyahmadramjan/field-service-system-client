import { authLogin, authLogout, authRegister, getMe } from "@/api/auth.api";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useLogin(){
    return useMutation({
        mutationFn: authLogin
    })
}


export function useRegister(){
    return useMutation({
        mutationFn: authRegister
    })
}

export function useGetMe(){
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
        retry: false
    })
}

export function useLogout(){
    return useMutation({
        mutationFn: authLogout
    })
}