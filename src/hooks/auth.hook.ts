import { authLogin, authRegister } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";


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