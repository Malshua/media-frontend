import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import { serverRequest } from "@/utilities/serverRequest";

export const useUpdateDetails = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/update-details`;
  const mutation = useMutation({
    mutationKey: ["update-details"],
    mutationFn: (data) => serverRequest(token).patch(endpoint, data),
  });

  return mutation;
};
export const useUpdatePassword = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/update-password`;
  const mutation = useMutation({
    mutationKey: ["update-password"],
    mutationFn: (data) => serverRequest(token).patch(endpoint, data),
  });

  return mutation;
};
