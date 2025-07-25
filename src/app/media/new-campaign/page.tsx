"use client";
import {
  Button,
  Input,
  Modal,
  SelectDropdown,
  SmoothSlider,
  TextArea,
} from "@/components/elements";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import SelectDate from "@/components/widgets/SelectDate";
import {
  formatDateAndTime,
  getDayDifference,
  sanitizePrice,
} from "@/utilities/helpers";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newCampaign } from "@/schema/newCampaignSchema";
import { toast } from "react-toastify";
import { useCreateCampaign } from "@/hooks/campaignHooks";
import { useRouter } from "next/navigation";
import { Routes } from "@/utilities/routes";
import { useInvalidateCampaigns } from "@/hooks/useInvalidateQueries";
import { DialogTitle } from "@/components/ui/dialog";

const mediaChannels = [
  {
    id: "SOCIAL_MEDIA",
    title: "Social Media",
    description:
      "Facebook, Instagram, Twitter, LinkedIn campaigns with targeting options.",
    price: "$1,500+",
    options: ["facebook", "instagram", "tiktok", "x", "youtube", "linkedin"],
  },
  {
    id: "SEARCH_ADS",
    title: "Search Ads",
    description: "Google Ads and Bing Ads to capture search intent.",
    price: "$1,200+",
    options: ["google_ads", "bing_ads"],
  },
  {
    id: "DISPLAY_ADVERTISING",
    title: "Display Advertising",
    description: "Banner ads on relevant websites and platforms.",
    price: "$1,800+",
    options: ["banner_ads"],
  },
  {
    id: "TELEVISION",
    title: "Television",
    description: "TV ads on local or national networks.",
    price: "$5,000+",
    options: [
      "AIT",
      "TVC",
      "channels",
      "NTA",
      "galaxy_tv",
      "silverbird_tv",
      "arise_tv",
      "wap_tv",
      "free_tv",
      "lagos_television",
    ],
  },
  {
    id: "RADIO",
    title: "Radio",
    description: "Radio spots on local or national stations.",
    price: "$2,500+",
    options: [
      "soundcity_radio",
      "inspiration_fm",
      "freedom_radio",
      "frcn",
      "lagos_talks",
      "classic_fm",
      "nigeria_info_fm",
      "cool_fm",
      "naija_fm",
      "the_beat_99_9_fm",
      "ray_power",
      "wazobia_fm",
    ],
  },
  {
    id: "PRINT_MEDIA",
    title: "Print Media",
    description: "Newspaper and magazine advertisements.",
    price: "$3,000+",
    options: [
      "the_punch",
      "the_guardian",
      "vanguard",
      "the_nation",
      "daily_trust",
      "the_sun",
      "thisday",
      "nigerian_tribune",
      "business_day",
      "alaroye",
      "aminiya",
    ],
  },
  {
    id: "OUTDOOR_BILLBOARD",
    title: "Outdoor/Billboards",
    description: "Billboards and outdoor advertising in key locations.",
    price: "$4,500+",
    options: [
      "outdoors_ng",
      "alternative_adverts_ltd",
      "signfix_industrial_limited",
      "optimus_billboards",
      "branditprintit",
      "alliance_media_nigeria",
      "vaad_media_ltd",
      "gizad_media_design",
      "bigtreebillboard",
    ],
  },
  {
    id: "EMAIL_MARKETING",
    title: "Email Marketing",
    description: "Targeted email campaigns to existing customers or prospects.",
    price: "$800+",
    options: [
      "adhang",
      "kong_marketing_agency",
      "wild_fusion",
      "odichi_solutions",
      "maildrip",
      "mailchimp",
      "getresponse",
      "moosend",
      "hubspot",
    ],
  },
];

const NewCampaign = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sliderValues, setSliderValues] = useState<{
    [key: string]: { amount: number; duration: number };
  }>({});
  const { push } = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<any>(null);
  const { RefetchCampaigns } = useInvalidateCampaigns();

  const totalAmount = selectedItems?.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newCampaign),
  });

  const start = formatDateAndTime(watch("startDate")).Date;
  const end = formatDateAndTime(watch("endDate")).Date;
  const total = watch("totalBudget");

  const days = getDayDifference(start, end);

  const { mutate: createcampaign } = useCreateCampaign();

  const sanitizePrice = (price: string) => {
    return price.replace(/[^\d]/g, "");
  };

  const openModalForChannel = (channel: any) => {
    setSelectedChannel(channel.id);
    setCurrentChannel(channel);
    setModalOpen(true);
  };

  const toggleOption = (channelId: string, option: string) => {
    const key = `${channelId}-${option}`;
    const exists = selectedItems.find(
      (item) => item.channel === channelId && item.option === option
    );

    if (exists) {
      setSelectedItems((prev) =>
        prev.filter(
          (item) => item.channel !== channelId || item.option !== option
        )
      );
      setSliderValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    } else {
      const channel = mediaChannels.find((ch) => ch.id === channelId);
      const sanitizedPrice = channel ? sanitizePrice(channel.price) : "0";

      // Initialize slider values for this option if not already set
      setSliderValues((prev) => ({
        ...prev,
        [key]: { amount: 0, duration: 0 },
      }));

      const baseData = {
        channel: channelId,
        option,
        duration: 0, // Will be updated by slider
        amount: 0, // Will be updated by slider
      };

      const isSocial = channelId === "SOCIAL_MEDIA";
      setSelectedItems((prev) => [
        ...prev,
        isSocial ? { ...baseData, userHandle: "" } : baseData,
      ]);
    }
  };

  const updateHandle = (channelId: string, option: string, handle: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.channel === channelId && item.option === option
          ? { ...item, userHandle: handle }
          : item
      )
    );
  };

  const updateSliderValue = (
    channelId: string,
    option: string,
    type: "amount" | "duration",
    value: number
  ) => {
    const key = `${channelId}-${option}`;
    setSliderValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value,
      },
    }));

    // Update selectedItems with the new slider value
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.channel === channelId && item.option === option
          ? {
              ...item,
              [type]:
                type === "amount"
                  ? Math.round((value / 100) * 1000000)
                  : Math.round((value / 100) * 30),
            }
          : item
      )
    );
  };

  const estimateReach = (amountValue: number, durationValue: number) => {
    const baseReach = 0;
    const amount = (amountValue / 100) * 1000000;
    const duration = (durationValue / 100) * 30;
    return Math.round((amount * duration) / 1000 + baseReach).toLocaleString();
  };

  const handleCreate = handleSubmit((data) => {
    if (selectedItems.length < 1) {
      toast.error("No media channels selected");
      return;
    }

    if (Number(total) !== totalAmount) {
      toast.error("Items you selected has to equal your total budget");
      return;
    }

    const payload: any = {
      campaignName: data?.campaignName,
      campaignType: data?.campaignType?.value,
      startDate: start,
      endDate: end,
      budget: data?.totalBudget,
      totalBudget: data?.totalBudget,
      campaignDescription: data?.campaignDescription,
      primaryGoal: data?.primaryGoal?.value,
      keyPerformanceIndicators: data?.keyPerformanceIndicators,
      targetAudience: data?.targetAudience?.value,
      preferredTimeline: data?.preferredTimeline,
      callToAction: data?.callToAction,
      instructionsRequirements: data?.instructionsRequirements,
      location: data?.location,
      mediaSelections: selectedItems,
    };

    setIsSubmitting(true);
    createcampaign(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast.success(response?.data?.message);
        RefetchCampaigns();
        push(Routes.CAMPAIGNS);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message);
      },
    });
  });

  return (
    <div className="p-5 md:p-8 bg-[#f5f8fc] text-gray-800">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <p className="font-medium text-sm">
          Fill in the details to start your next successful campaign.
        </p>
      </div>

      <div className="bg-white p-5 shadow-md rounded-lg mt-10">
        <h1 className="text-xl font-bold border-b border-gray-200 pb-3">
          Campaign Details
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            control={control}
            name="campaignName"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g Summer product launch"
                label="Campaign Name"
                error={errors?.campaignName?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="campaignType"
            render={({ field }) => (
              <SelectDropdown
                options={[
                  { label: "brand awareness", value: "brand_awareness" },
                  { label: "product launch", value: "product_launch" },
                  { label: "promotion/sale", value: "promotion_sales" },
                  { label: "event marketing", value: "event_marketing" },
                  { label: "lead generation", value: "lead_generation" },
                ]}
                placeholder="select campaign type"
                label="Campaign Type"
                error={
                  errors?.campaignType?.message ||
                  errors?.campaignType?.value?.message
                }
                {...field}
              />
            )}
          />

          <div className="w-full">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <SelectDate
                    selectedDate={field.value}
                    onChange={field.onChange}
                    error={errors.startDate?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <SelectDate
                  selectedDate={field.value}
                  onChange={field.onChange}
                  error={errors?.endDate?.message}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="callToAction"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="What actions do you want users to take?"
                label="Call to Action"
                error={errors?.totalBudget?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="campaignDescription"
            render={({ field }) => (
              <Input
                type="text"
                label="Campaign Description"
                placeholder="Describe your objectives, target audience, and key messages.."
                error={errors?.campaignDescription?.message}
                {...field}
              />
            )}
          />
        </div>

        <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-10">
          Budget and Goals
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            control={control}
            name="totalBudget"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g. 5000"
                label="Total Budget (USD)"
                error={errors?.totalBudget?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="primaryGoal"
            render={({ field }) => (
              <SelectDropdown
                options={[
                  { label: "brand awareness", value: "brand_awareness" },
                  { label: "website traffic", value: "website_traffic" },
                  { label: "sales conversions", value: "sales_conversions" },
                  { label: "engagement", value: "engagement" },
                  { label: "lead generation", value: "lead_generation" },
                ]}
                placeholder="select primary goal"
                label="Primary Goal"
                error={
                  errors?.primaryGoal?.message ||
                  errors?.primaryGoal?.value?.message
                }
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="targetAudience"
            render={({ field }) => (
              <SelectDropdown
                options={[
                  {
                    label: "young adults (18 - 24)",
                    value: "young_adults_18_24",
                  },
                  {
                    label: "adults (25 - 34)",
                    value: "adults_25_34",
                  },
                  {
                    label: "adults (35 - 44)",
                    value: "adults_35_44",
                  },
                  {
                    label: "adults (45 - 54)",
                    value: "adults_45_54",
                  },
                  {
                    label: "seniors (55+)",
                    value: "seniors_55_plus",
                  },
                  {
                    label: "Business Professionals",
                    value: "business_professionals",
                  },
                ]}
                placeholder="select primary audience"
                label="Target Audience"
                error={
                  errors?.targetAudience?.message ||
                  errors?.targetAudience?.value?.message
                }
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <Input
                type="text"
                placeholder="e.g. New York, Los Angeles"
                label="Target Locations"
                error={errors?.location?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="preferredTimeline"
            render={({ field }) => (
              <Input
                type="text"
                label="Preferred timeline"
                placeholder="Any specific deadlines or timeline requirements?"
                error={errors?.keyPerformanceIndicators?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="keyPerformanceIndicators"
            render={({ field }) => (
              <Input
                type="text"
                label="Key Performance Indicators (KPIs)"
                placeholder="List the specific metrics you want to track"
                error={errors?.keyPerformanceIndicators?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="mt-5">
          <h1 className="text-xl font-bold border-b border-gray-200 pb-3">
            Campaign Details
          </h1>
          <p className="text-sm md:text-base py-4">
            Select the media channels you want to include in your campaign:
          </p>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={clsx(
                    "flex flex-col rounded-lg border bg-white p-4 shadow-sm hover:shadow-md cursor-pointer",
                    selectedChannel === channel.id
                      ? "border-purple-600 ring-2 ring-purple-100"
                      : "border-gray-200"
                  )}
                  onClick={() => openModalForChannel(channel)}
                >
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {channel.description}
                  </p>
                  <span className="text-sm text-gray-500 italic">
                    {channel.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal for options */}
            <Modal
              open={modalOpen}
              openModal={() => setModalOpen(false)}
              closeBtn
            >
              {currentChannel && (
                <div className="space-y-4">
                  <DialogTitle>{currentChannel.title} Options</DialogTitle>

                  <p className="text-sm text-gray-600">
                    {currentChannel.description}
                  </p>

                  {currentChannel.options.map((option: string) => {
                    const key = `${currentChannel.id}-${option}`;
                    const isSelected = selectedItems.some(
                      (item) =>
                        item.channel === currentChannel.id &&
                        item.option === option
                    );
                    const sliderData = sliderValues[key] || {
                      amount: 0,
                      duration: 0,
                    };

                    return (
                      <div key={option} className="flex flex-col gap-1">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <input
                            className="h-4 w-4 accent-purple-600"
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleOption(currentChannel.id, option)
                            }
                          />
                          <span className="capitalize">
                            {option.replace(/_/g, " ")}
                          </span>
                        </label>

                        {currentChannel.id === "SOCIAL_MEDIA" && isSelected && (
                          <input
                            type="text"
                            placeholder="Enter your handle"
                            className="w-full rounded border p-2 text-sm mt-2"
                            onChange={(e) =>
                              updateHandle(
                                currentChannel.id,
                                option,
                                e.target.value
                              )
                            }
                          />
                        )}

                        {isSelected && (
                          <div className="pt-4 pl-6">
                            <label className="text-sm font-medium text-gray-700">
                              Amount
                            </label>
                            <SmoothSlider
                              value={sliderData.amount}
                              setValue={(value) =>
                                updateSliderValue(
                                  currentChannel.id,
                                  option,
                                  "amount",
                                  value
                                )
                              }
                              fullAmount={1000000}
                              type="amount"
                            />

                            <label className="text-sm font-medium text-gray-700 mt-4 block">
                              Duration (Days)
                            </label>
                            <SmoothSlider
                              value={sliderData.duration}
                              setValue={(value) =>
                                updateSliderValue(
                                  currentChannel.id,
                                  option,
                                  "duration",
                                  value
                                )
                              }
                              fullAmount={30}
                              type="duration"
                            />

                            <div className="text-purple-700 mt-2 font-medium text-sm">
                              Estimated Reach:{" "}
                              <span className="font-bold">
                                {estimateReach(
                                  sliderData.amount,
                                  sliderData.duration
                                )}{" "}
                                people
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Modal>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="text-xl font-bold border-b border-gray-200 pb-3">
            Additional Information
          </h1>

          <div className="mt-5">
            <Controller
              control={control}
              name="instructionsRequirements"
              render={({ field }) => (
                <TextArea
                  label="Special Instructions or Requirements"
                  placeholder="Any additional information we should know..."
                  error={errors?.instructionsRequirements?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="w-fit flex items-center justify-center mt-3">
          <Button
            className="bg-purple-600 hover:bg-purple-700 capitalize py-2.5 px-4 text-sm text-white font-medium"
            text="Create Campaign"
            onClick={handleCreate}
            loading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;
