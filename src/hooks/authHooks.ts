import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import { serverRequest } from "@/utilities/serverRequest";

export const useLogin = () => {
  const endpoint = `${process.env.BASE_URL}/api/login`;
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => serverRequest().post(endpoint, data),
  });

  return mutation;
};

export const useChangePassword = ({ token }: { token: string | null }) => {
  const endpoint = `${process.env.BASE_URL}/api/change-password`;
  const mutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (data) => serverRequest(token).post(endpoint, data),
  });

  return mutation;
};

export const useUserDetails = ({ token }: { token: string | null }) => {
  const endpoint = `${process.env.BASE_URL}/api/user-details`;
  const mutation = useMutation({
    mutationKey: ["user-details"],
    mutationFn: (data) => serverRequest(token).post(endpoint, data),
  });

  return mutation;
};
