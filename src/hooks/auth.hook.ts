import { authLogin, authLogout, authRegister, getMe, updateMe } from "@/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUserProfile } from "@/types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: authLogin,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authRegister,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authLogout,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.setQueryData(["user"], (current: { data: IUserProfile } | undefined) =>
        current ? { ...current, data: response.data } : response,
      );
    },
  });
}

