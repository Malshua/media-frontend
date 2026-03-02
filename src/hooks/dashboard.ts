import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import { serverRequest } from "@/utilities/serverRequest";

export const useGetDashStats = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/user-dashboard`;
  const query = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};
