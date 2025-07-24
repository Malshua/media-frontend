import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateCampaigns = () => {
  const queryClient = useQueryClient();

  const RefetchCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  };

  return { RefetchCampaigns };
};
