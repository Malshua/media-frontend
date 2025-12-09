"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import {
  serverRequest,
  serverRequestFormData,
} from "@/utilities/serverRequest";

export const useGetMediaPlans = () => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/media-plans`;
  const query = useQuery({
    queryKey: ["media-plans"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

export const useGetMediaPlan = ({
  mediaPlanId,
}: {
  mediaPlanId: string | string[] | undefined;
}) => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/media-plans/${mediaPlanId}`;
  const query = useQuery({
    queryKey: ["single-plan"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

export const useGetPlan = ({
  campaignId,
}: {
  campaignId: string | string[] | undefined;
}) => {
  const { token } = useAuth();

  const endpoint = `${process.env.BASE_URL}/api/campaigns/${campaignId}/media-plan`;
  const query = useQuery({
    queryKey: ["campaign-plan"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

export const useApproveMediaPlan = ({
  mediaPlanId,
  campaignId,
}: {
  mediaPlanId: string | string[] | undefined;
  campaignId: string | string[] | undefined;
}) => {
  const { token } = useAuth();
  const endpoint = `${process.env.BASE_URL}/api/campaigns/${campaignId}/media-plans/${mediaPlanId}/approve`;
  const mutation = useMutation({
    mutationFn: (data) => serverRequest(token).post(endpoint, data),
  });

  return mutation;
};

export const useRequestRevision = ({
  mediaPlanId,
  campaignId,
}: {
  mediaPlanId: string | string[] | undefined;
  campaignId: string | string[] | undefined;
}) => {
  const { token } = useAuth();
  const endpoint = `${process.env.BASE_URL}/api/campaigns/${campaignId}/media-plans/${mediaPlanId}/request-revision`;
  const mutation = useMutation({
    mutationFn: (data) => serverRequest(token).post(endpoint, data),
  });

  return mutation;
};
