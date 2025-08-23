import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import {
  serverRequest,
  serverRequestFormData,
} from "@/utilities/serverRequest";

export const useCreateCampaign = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/user-campaign`;
  const mutation = useMutation({
    mutationKey: ["create-campaign"],
    mutationFn: (data) => serverRequest(token).post(endpoint, data),
  });

  return mutation;
};

export const useGetCampaigns = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/campaigns`;
  const query = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

export const useGetSIngleCampaigns = ({
  campaign_id,
}: {
  campaign_id: string | string[] | undefined;
}) => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/campaign/${campaign_id}`;
  const query = useQuery({
    queryKey: ["single-campaign"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

//upload media
export const useUploadMedia = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/upload-file`;
  const mutation = useMutation({
    mutationFn: (data) => serverRequestFormData(token).put(endpoint, data),
  });

  return mutation;
};
