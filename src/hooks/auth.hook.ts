import { authLogin, authLogout, authRegister, getMe, updateMe } from "@/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
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

export function useDashboardLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        toast.add({
          title: "Logout successful",
          description: "You have been logged out.",
          type: "success",
        });
        router.replace("/login");
        router.refresh();
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Could not log you out. Please try again.",
          type: "error",
        });
      },
    });
  };

  return { logout, isLoggingOut: logoutMutation.isPending };
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

