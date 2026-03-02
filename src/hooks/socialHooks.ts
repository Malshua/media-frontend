"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuthActions";
import { serverRequest } from "@/utilities/serverRequest";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch all connected social accounts for the current user
export const useGetConnections = () => {
  const { token } = useAuth();

  const endpoint = `${API_URL}/api/oauth/connections`;
  const query = useQuery({
    queryKey: ["social-connections"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

// Initiate OAuth flow for a platform (returns authorization URL)
export const useInitiateOAuth = () => {
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: (platform: "facebook" | "instagram" | "tiktok") => {
      const endpoint = `${API_URL}/api/oauth/${platform}/authorize`;
      return serverRequest(token).get(endpoint);
    },
  });

  return mutation;
};

// Select an ad account when user has multiple accounts
export const useSelectAdAccount = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      platform,
      accountId,
      accountName,
    }: {
      platform: string;
      accountId: string;
      accountName: string;
    }) => {
      const endpoint = `${API_URL}/api/oauth/${platform}/select-account`;
      return serverRequest(token).post(endpoint, { accountId, accountName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-connections"] });
    },
  });

  return mutation;
};

// Disconnect a social platform
export const useDisconnectPlatform = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (platform: string) => {
      const endpoint = `${API_URL}/api/oauth/${platform}`;
      return serverRequest(token).delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-connections"] });
    },
  });

  return mutation;
};

// Fetch aggregated social metrics for the current user
export const useGetSocialMetrics = () => {
  const { token } = useAuth();

  const endpoint = `${API_URL}/api/social-metrics`;
  const query = useQuery({
    queryKey: ["social-metrics"],
    queryFn: () => serverRequest(token).get(endpoint),
  });

  return query;
};

// Seed mock metrics data into connected accounts (for testing)
export const useSeedMockMetrics = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const endpoint = `${API_URL}/api/social-metrics/seed-mock`;
      return serverRequest(token).post(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["social-connections"] });
    },
  });

  return mutation;
};

// Fetch AI-generated recommendations based on real metrics
export const useGetRecommendations = () => {
  const { token } = useAuth();

  const endpoint = `${API_URL}/api/social-metrics/recommendations`;
  const query = useQuery({
    queryKey: ["social-recommendations"],
    queryFn: () => serverRequest(token).get(endpoint),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes to avoid excessive GPT calls
    refetchOnWindowFocus: false,
  });

  return query;
};
