import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateCampaigns = () => {
  const queryClient = useQueryClient();

  const RefetchCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
  };

  return { RefetchCampaigns };
};

export const useInvalidateMedia = () => {
  const queryClient = useQueryClient();

  const RefetchMedia = () => {
    queryClient.invalidateQueries({ queryKey: ["media-plans"] });
  };
  const RefetchSingleMedia = () => {
    queryClient.invalidateQueries({ queryKey: ["campaign-plan"] });
  };

  return { RefetchMedia, RefetchSingleMedia };
};
