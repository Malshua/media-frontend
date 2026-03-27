"use client";
import {
  Button,
  CustomAmountInput,
  DurationSelector,
  Input,
  Modal,
  SelectDropdown,
  SmoothSlider,
  TextArea,
} from "@/components/elements";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Megaphone,
  MessageSquare,
  Palette,
  Upload as UploadIcon,
  Share2,
  Search,
  Monitor,
  Tv2,
  Radio as RadioIcon,
  Newspaper,
  MapPin,
  Mail,
  Check,
  Image as ImageIcon,
  Music,
  Video,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import SelectDate from "@/components/widgets/SelectDate";
import {
  createFormData,
  formatDateAndTime,
  getDayDifference,
  sanitizePrice,
} from "@/utilities/helpers";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newCampaign } from "@/schema/newCampaignSchema";
import { toast } from "react-toastify";
import { useCreateCampaign, useUploadMedia } from "@/hooks/campaignHooks";
import { useRouter } from "next/navigation";
import { Routes } from "@/utilities/routes";
import { useInvalidateCampaigns } from "@/hooks/useInvalidateQueries";
import { DialogTitle } from "@/components/ui/dialog";
import DragnDropMulti, {
  FileMetadata,
} from "@/components/widgets/DragnDropMulti";
import { handleFormattedNumber } from "@/components/elements/CustomAmountInput";

const mediaChannels = [
  {
    id: "SOCIAL_MEDIA",
    title: "Social Media",
    description:
      "Facebook, Instagram, Twitter, LinkedIn campaigns with targeting options.",
    price: "₦2,250,000+",
    options: ["facebook", "instagram", "tiktok", "x", "youtube", "linkedin"],
  },
  {
    id: "SEARCH_ADS",
    title: "Search Ads",
    description: "Google Ads and Bing Ads to capture search intent.",
    price: "₦1,800,000+",
    options: ["google_ads", "bing_ads"],
  },
  {
    id: "DISPLAY_ADVERTISING",
    title: "Display Advertising",
    description: "Banner ads on relevant websites and platforms.",
    price: "₦2,700,000+",
    options: ["banner_ads"],
  },
  {
    id: "TELEVISION",
    title: "Television",
    description: "TV ads on local or national networks.",
    price: "₦7,500,000+",
    options: [
      "ait",
      "tvc",
      "channels",
      "nta",
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
    price: "₦3,750,000+",
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
    price: "₦4,500,000+",
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
    price: "₦6,750,000+",
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
    price: "₦1,200,000+",
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

const channelIcons: Record<string, React.ReactNode> = {
  SOCIAL_MEDIA: <Share2 size={20} />,
  SEARCH_ADS: <Search size={20} />,
  DISPLAY_ADVERTISING: <Monitor size={20} />,
  TELEVISION: <Tv2 size={20} />,
  RADIO: <RadioIcon size={20} />,
  PRINT_MEDIA: <Newspaper size={20} />,
  OUTDOOR_BILLBOARD: <MapPin size={20} />,
  EMAIL_MARKETING: <Mail size={20} />,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  }),
};

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
  const [files, setFiles] = useState<FileMetadata[]>([]);

  const handleChangePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files) as File[];

    const newFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadTime: formatDateAndTime(new Date().toLocaleString()).Time,
      uploadDate: formatDateAndTime(new Date().toLocaleString()).Date,
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeletePdf = (index: number) => {
    setFiles((prevFiles: any) =>
      prevFiles.filter((_: any, i: number) => i !== index)
    ); // Remove file by index
  };

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(newCampaign),
  });

  const watched = watch("targetAudience");

  const day = watched?.map((item: any) => item.value) || [];

  const start = formatDateAndTime(watch("startDate")).Date;
  const end = formatDateAndTime(watch("endDate")).Date;

  const days = getDayDifference(start, end);

  const { mutate: createcampaign } = useCreateCampaign();
  const { mutate: mediaUpload } = useUploadMedia();

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

      setSliderValues((prev) => ({
        ...prev,
        [key]: { amount: 10, duration: 0 },
      }));

      const baseData = {
        channel: channelId,
        option,
        duration: "0 days",
        amount: "₦15000",
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

    setSelectedItems((prev) =>
      prev.map((item) =>
        item.channel === channelId && item.option === option
          ? {
              ...item,
              [type]:
                type === "amount"
                  ? `${value * 1500}`
                  : `${Math.round((value / 100) * 30)} days`,
            }
          : item
      )
    );
  };

  const estimateReach = (amountValue: number, durationValue: number) => {
    const baseReach = 100;
    const amount = amountValue;
    const duration = (durationValue / 100) * 30;
    return Math.round((amount * duration) / 1000 + baseReach).toLocaleString();
  };

  const getChannelTotalAmount = (channelId: string) => {
    const channelItems = selectedItems.filter(
      (item) => item.channel === channelId
    );
    const total = channelItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace(/[^\d.]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return total.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    });
  };

  const [creativeDesigns, setCreativeDesigns] = useState({
    banner: false,
    audio: false,
    video: false,
  });

  const handleCreate = handleSubmit((data) => {
    if (files.length > 0) {
      const formData: any = createFormData(files);
      setIsSubmitting(true);

      mediaUpload(formData, {
        onSuccess: (res) => {
          const file = res?.data?.files;

          if (selectedItems.length < 1) {
            toast.error("No media channels selected");
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
            targetAudience: day,
            instructionsRequirements: data?.instructionsRequirements,
            location: data?.location,
            mediaSelections: selectedItems,
            designRequest: [
              ...(creativeDesigns?.banner ? ["banner"] : []),
              ...(creativeDesigns?.audio ? ["audio"] : []),
              ...(creativeDesigns?.video ? ["video"] : []),
            ],
            mediaUpload: file.map((f: any) => ({
              fileUrl: f.fileUrl,
              fileName: f.fileName,
              fileSize: f.fileSize,
              fileType: f.fileType,
              uploadedAt: new Date().toISOString(),
            })),
          };

          createcampaign(payload, {
            onSuccess: (response) => {
              setIsSubmitting(false);
              toast.success(response?.data?.message);
              RefetchCampaigns();
              push(Routes.CAMPAIGNS);
            },
            onError: (error: any) => {
              setIsSubmitting(false);
              toast.error(error?.response?.data?.details[0]?.message);
            },
          });
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error(err?.message);
        },
      });
    } else {
      if (selectedItems.length < 1) {
        toast.error("No media channels selected");
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
        targetAudience: day,
        instructionsRequirements: data?.instructionsRequirements,
        location: data?.location,
        mediaSelections: selectedItems,
        designRequest: [
          ...(creativeDesigns?.banner ? ["banner"] : []),
          ...(creativeDesigns?.audio ? ["audio"] : []),
          ...(creativeDesigns?.video ? ["video"] : []),
        ],
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
          toast.error(error?.response?.data?.details[0]?.message);
        },
      });
    }
  });

  const handleCreativeDesignChange = (type: string) => {
    setCreativeDesigns((prev: any) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h1 className="text-2xl font-bold text-foreground">
          Create New Campaign
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details to start your next successful campaign.
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {/* Section 1: Campaign Details */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
              <FileText
                size={18}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Campaign Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <TextArea
                  label="Call to Action"
                  placeholder="What action do you want users to take?"
                  error={errors?.callToAction?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="campaignDescription"
              render={({ field }) => (
                <TextArea
                  label="Campaign Description"
                  placeholder="Describe your objectives, target audience, and key messages.."
                  error={errors?.campaignDescription?.message}
                  {...field}
                />
              )}
            />
          </div>
        </motion.div>

        {/* Section 2: Budget & Goals */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <Target
                size={18}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Budget & Goals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              control={control}
              name="totalBudget"
              render={({ field: { onChange, value, ...field } }) => (
                <CustomAmountInput
                  label="Total Budget (NGN)"
                  type="text"
                  placeholder="e.g. ₦7,500,000"
                  value={value ? Number(value).toLocaleString() : ""}
                  onChange={(e) => handleFormattedNumber(e, onChange)}
                  error={errors.totalBudget?.message}
                  required
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
                    {
                      label: "sales conversions",
                      value: "sales_conversions",
                    },
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
                  multiSelect
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
                  error={errors?.targetAudience?.message}
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
                  placeholder="e.g. Lagos, Abuja"
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
                  label="Preferred Timeline"
                  placeholder="Any specific deadlines or timeline requirements?"
                  error={errors?.preferredTimeline?.message}
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
        </motion.div>

        {/* Section 3: Media Channels */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <Megaphone
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Media Channels
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Select the channels you want to include in your campaign
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {mediaChannels.map((channel) => {
              const selectedCount = selectedItems.filter(
                (item) => item.channel === channel.id
              ).length;
              const isActive = selectedCount > 0;
              return (
                <motion.div
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    "relative flex flex-col rounded-xl border p-3.5 cursor-pointer transition-colors",
                    isActive
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-500/60"
                      : "border-border bg-background hover:border-foreground/20"
                  )}
                  onClick={() => openModalForChannel(channel)}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div
                      className={clsx(
                        "p-2 rounded-lg",
                        isActive
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {channelIcons[channel.id]}
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
                        <Check size={12} /> {selectedCount}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {channel.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {channel.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      From {channel.price}
                    </span>
                    {isActive && (
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {getChannelTotalAmount(channel.id)}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Modal
            open={modalOpen}
            openModal={() => setModalOpen(false)}
            closeBtn
          >
            {currentChannel && (
              <div className="space-y-4">
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    {channelIcons[currentChannel.id]}
                  </div>
                  {currentChannel.title} Options
                </DialogTitle>

                <p className="text-sm text-muted-foreground">
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
                    amount: 10,
                    duration: 0,
                  };

                  return (
                    <div
                      key={option}
                      className={clsx(
                        "rounded-lg border p-3 transition-colors",
                        isSelected
                          ? "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/10"
                          : "border-border"
                      )}
                    >
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                        <input
                          className="h-4 w-4 accent-[#59044c]"
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
                          className="w-full mt-2 rounded-lg border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                        <div className="pt-3 pl-6 space-y-3">
                          <div>
                            <label className="text-sm font-medium text-foreground">
                              {currentChannel.id === "SOCIAL_MEDIA"
                                ? "Campaign Budget"
                                : "Amount"}
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
                              min={10}
                              max={100000}
                              step={10}
                              type="amount"
                            />
                          </div>

                          {currentChannel.id === "RADIO" ||
                          currentChannel.id === "TELEVISION" ? (
                            <DurationSelector
                              channelId={currentChannel.id}
                              option={option}
                              selectedItems={selectedItems}
                              setSelectedItems={setSelectedItems}
                              sliderValues={sliderValues}
                              setSliderValues={setSliderValues}
                              control={control}
                              name={`duration_${currentChannel.id}_${option}`}
                            />
                          ) : (
                            <div>
                              <label className="text-sm font-medium text-foreground block">
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
                                min={0}
                                max={100}
                                step={1}
                                type="duration"
                              />
                            </div>
                          )}

                          {currentChannel.id === "SOCIAL_MEDIA" && (
                            <div className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                              Estimated Reach:{" "}
                              <span className="font-bold">
                                {estimateReach(
                                  sliderData.amount,
                                  sliderData.duration
                                )}{" "}
                                people
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="mt-4 flex justify-end">
                  <Button
                    className="bg-[#A1238E] hover:bg-[#59044c] w-fit capitalize py-2 px-5 text-sm text-white font-medium rounded-lg"
                    text="Done"
                    onClick={() => setModalOpen(false)}
                  />
                </div>
              </div>
            )}
          </Modal>
        </motion.div>

        {/* Section 4: Additional Information */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <MessageSquare
                size={18}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Additional Information
            </h2>
          </div>

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
        </motion.div>

        {/* Section 5: Creative Designs */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/40">
              <Palette
                size={18}
                className="text-pink-600 dark:text-pink-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Request Creative Designs
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: "banner", label: "Banner", icon: ImageIcon },
              { key: "audio", label: "Audio", icon: Music },
              { key: "video", label: "Video", icon: Video },
            ].map((item) => {
              const Icon = item.icon;
              const isActive =
                creativeDesigns[
                  item.key as keyof typeof creativeDesigns
                ];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleCreativeDesignChange(item.key)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    isActive
                      ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500/60"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/20"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {isActive && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 6: Upload */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-card rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/40">
              <UploadIcon
                size={18}
                className="text-sky-600 dark:text-sky-400"
              />
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Upload Creative Designs
            </h2>
          </div>

          <DragnDropMulti
            title=""
            onChange={handleChangePdf}
            accept=".pdf,.docx,.jpeg,.png,.jpg,.JPG,.PNG,.JPEG"
            files={files}
            onDelete={handleDeletePdf}
          />
        </motion.div>

        {/* Submit */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Button
            className="w-full md:w-auto bg-[#A1238E] hover:bg-[#59044c] capitalize py-3 px-8 text-sm text-white font-semibold rounded-lg"
            text="Create Campaign"
            onClick={handleCreate}
            loading={isSubmitting}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NewCampaign;
