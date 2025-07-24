import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import { serverRequest } from "@/utilities/serverRequest";

export const useGetDashStats = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/user-dashboard`;
  const query = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};
