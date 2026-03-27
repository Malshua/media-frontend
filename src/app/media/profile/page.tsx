"use client";

import {
  Button,
  Input,
  SelectDropdown,
  TelephoneInput,
} from "@/components/elements";
import { useUploadMedia } from "@/hooks/campaignHooks";
import { useUpdateDetails, useUpdatePassword } from "@/hooks/profileHooks";
import { useAuth, useAuthActions } from "@/hooks/useAuthActions";
import { changePasswordSchema, userSchema } from "@/schema/profileSchema";
import { getFirstLetters } from "@/utilities/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Bell,
  Shield,
  Camera,
  Mail,
  Briefcase,
  Palette,
  Save,
} from "lucide-react";

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: "spring" as const, stiffness: 280, damping: 26 },
  }),
};

const Profile = () => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const name_initials = getFirstLetters(user?.name);
  const { updateUser } = useAuthActions();
  const [show, setShow] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgFile, setImgFile] = useState<any>(null);
  const [imgSrc, setImgSrc] = useState<string>();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const { mutate: updatePassword } = useUpdatePassword();
  const { mutate: mediaUpload } = useUploadMedia();

  const uploadImg = (e: any) => {
    setImgFile(e?.target.files[0]);
    setImgSrc(URL?.createObjectURL(e.target.files[0]));
  };

  const {
    control: updateControl,
    handleSubmit: updateSubmit,
    reset: updateReset,
    formState: { errors: updateError },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const handlePasswordChange = updateSubmit((data) => {
    const password_payload: any = {
      currentPassword: data?.old_password,
      newPassword: data?.password,
      confirmNewPassword: data?.password,
      email: user?.email,
    };

    setIsSubmitting(true);

    updatePassword(password_payload, {
      onSuccess: () => {
        setIsSubmitting(false);
        updateReset({
          old_password: "",
          password: "",
          confirm_password: "",
        });
        toast.success("Password Updated!");
      },

      onError: (err: any) => {
        setIsSubmitting(false);
        toast.error(err?.response?.data?.message);
      },
    });
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  type PreferenceKey =
    | "campaignStatusUpdates"
    | "weeklyAnalyticsReports"
    | "budgetAlerts"
    | "marketingTipsBestPractices";

  const [preferences, setPreferences] = useState<{
    campaignStatusUpdates: boolean;
    weeklyAnalyticsReports: boolean;
    budgetAlerts: boolean;
    marketingTipsBestPractices: boolean;
  }>({
    campaignStatusUpdates: true,
    weeklyAnalyticsReports: true,
    budgetAlerts: true,
    marketingTipsBestPractices: false,
  });

  const togglePreference = (key: PreferenceKey) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      phone: user?.phone?.toString().startsWith("+")
        ? user.phone.toString()
        : `+${user?.phone}`,
      position: user?.position,
      companyName: user?.companyName,
      industry: {
        label: user?.industry,
        value: user?.industry,
      },
      companyAddress: user?.companyAddress,
    });
  }, [user, reset]);

  // update user profile
  const updateProfile = handleSubmit((data) => {
    if (imgFile) {
      const formData: any = new FormData();
      formData.append("files", imgFile);

      setUpdating(true);

      mediaUpload(formData, {
        onSuccess: (response) => {
          const img = response?.data;

          const payload: any = {
            picture: img?.fileName,
            fullName: data?.name,
            email: data?.email,
            phoneNumber: data?.phone,
            position: data?.position,
            companyName: data?.companyName,
            companyAddress: data?.companyAddress,
            industry: data?.industry?.value,
            notificationPreferences: preferences,
          };

          update(payload, {
            onSuccess: () => {
              setUpdating(false);
              toast.success("Update success!");
              const updateData = {
                name: data?.name,
                email: data?.email,
                phone: data?.phone,
                position: data?.position,
                companyName: data?.companyName,
                companyAddress: data?.companyAddress,
                industry: data?.industry?.value,
              };

              updateUser(updateData);
            },
            onError: (error: any) => {
              setUpdating(false);
              toast.error(error?.response?.data?.message);
            },
          });
        },
        onError: (error: any) => {
          setUpdating(false);
          toast.error(error.response?.data?.error);
        },
      });
    } else {
      const payload: any = {
        fullName: data?.name,
        email: data?.email,
        phoneNumber: data?.phone,
        position: data?.position,
        companyName: data?.companyName,
        companyAddress: data?.companyAddress,
        industry: data?.industry?.value,
        notificationPreferences: preferences,
      };

      setUpdating(true);

      update(payload, {
        onSuccess: () => {
          setUpdating(false);
          toast.success("Update success!");
          const updateData = {
            name: data?.name,
            email: data?.email,
            phone: data?.phone,
            position: data?.position,
            companyName: data?.companyName,
            companyAddress: data?.companyAddress,
            industry: data?.industry?.value,
          };

          updateUser(updateData);
        },
        onError: (error: any) => {
          setUpdating(false);
          toast.error(error?.response?.data?.message);
        },
      });
    }
  });

  const { mutate: update } = useUpdateDetails();

  const notificationItems: { key: PreferenceKey; label: string; desc: string }[] = [
    { key: "campaignStatusUpdates", label: "Campaign Updates", desc: "Get notified when campaign status changes" },
    { key: "weeklyAnalyticsReports", label: "Weekly Reports", desc: "Receive weekly analytics summaries" },
    { key: "budgetAlerts", label: "Budget Alerts", desc: "Alerts when budgets hit thresholds" },
    { key: "marketingTipsBestPractices", label: "Marketing Tips", desc: "Best practices & tips from our team" },
  ];

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ─── HERO PROFILE BANNER ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A1238E] via-[#7B1FA2] to-[#4A148C]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

        <div className="relative px-4 pt-5 pb-3 md:px-8 md:pt-10 md:pb-5">
          <div className="flex items-center gap-3.5 md:items-end md:gap-8">
            {/* Avatar with upload overlay */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative group shrink-0"
            >
              <div className="relative h-14 w-14 md:h-28 md:w-28 rounded-xl md:rounded-2xl overflow-hidden ring-2 md:ring-[3px] ring-white/20 shadow-2xl">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt="profile photo"
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-lg md:text-4xl uppercase font-bold">
                    {name_initials}
                  </div>
                )}

                {/* Tap/hover overlay for photo upload */}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <input
                    onChange={uploadImg}
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg"
                  />
                </label>
              </div>
            </motion.div>

            {/* Name & role */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              className="flex-1 min-w-0 text-white"
            >
              <h1 className="text-base md:text-3xl font-bold capitalize tracking-tight truncate leading-tight">
                {user?.name || "Your Name"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5 text-white/70 text-[11px] md:text-sm">
                {user?.position && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 shrink-0" />
                    <span className="truncate">{user.position}</span>
                  </span>
                )}
                {user?.companyName && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{user.companyName}</span>
                  </span>
                )}
              </div>
              {user?.email && (
                <span className="hidden md:flex items-center gap-1 mt-0.5 text-white/60 text-xs md:text-sm">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Tab pills — bottom of banner */}
        <div className="relative px-4 pb-4 md:px-8 md:pb-6 flex gap-2 mt-4 md:mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white/20 text-white backdrop-blur-sm shadow-lg shadow-black/10"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── CONTENT CARD ─── */}
      <div className="px-3 md:px-8 -mt-0 pt-4 md:pt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border/50"
        >

          {/* ─── TAB CONTENT ─── */}
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-8 space-y-8"
              >
                {/* ── Personal Information ── */}
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#A1238E]/10 dark:bg-purple-500/15">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#A1238E] dark:text-purple-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-foreground">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="John Doe"
                          label="Full Name"
                          error={errors.name?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="john.doe@acme.com"
                          label="Email Address"
                          error={errors?.email?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <TelephoneInput
                          label="Phone Number"
                          error={errors.phone?.message}
                          required
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="position"
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Marketing Director"
                          label="Position/Title"
                          error={errors?.position?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </motion.section>

                {/* ── Company Information ── */}
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={1}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#A1238E]/10 dark:bg-purple-500/15">
                      <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#A1238E] dark:text-purple-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-foreground">
                      Company Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Controller
                      control={control}
                      name="companyName"
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="Acme Inc."
                          label="Company Name"
                          error={errors?.companyName?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="industry"
                      render={({ field }) => (
                        <SelectDropdown
                          options={[
                            { label: "Technology", value: "technology" },
                            { label: "Retail", value: "retail" },
                            { label: "Healthcare", value: "healthcare" },
                            { label: "Finance", value: "finance" },
                            { label: "Education", value: "education" },
                            { label: "Other", value: "other" },
                          ]}
                          placeholder="select industry"
                          label="Industry"
                          error={
                            errors?.industry?.message || errors?.industry?.value?.message
                          }
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="companyAddress"
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="123 Business St, San Francisco, CA 94103"
                          label="Company Address"
                          error={errors?.companyAddress?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </motion.section>

                {/* ── Appearance (mobile only) ── */}
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={2}
                  className="block md:hidden"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#A1238E]/10 dark:bg-purple-500/15">
                      <Palette className="w-3.5 h-3.5 text-[#A1238E] dark:text-purple-400" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">
                      Appearance
                    </h2>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border/50">
                    <span className="text-sm text-muted-foreground">Dark mode</span>
                    <ThemeToggle />
                  </div>
                </motion.section>

                {/* ── Notification Preferences ── */}
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={3}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#A1238E]/10 dark:bg-purple-500/15">
                      <Bell className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#A1238E] dark:text-purple-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-foreground">
                      Notifications
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {notificationItems.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-3.5 md:p-4 rounded-xl bg-muted/50 border border-border/50 cursor-pointer hover:bg-muted/80 active:bg-muted/80 transition-colors"
                      >
                        <div className="pr-3 min-w-0">
                          <div className="text-sm font-medium text-foreground">
                            {item.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {item.desc}
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={preferences[item.key]}
                          onClick={() => togglePreference(item.key)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                            preferences[item.key]
                              ? "bg-[#A1238E] dark:bg-purple-500"
                              : "bg-muted-foreground/25"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                              preferences[item.key] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </motion.section>
              </motion.div>
            ) : (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-8"
              >
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={0}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#A1238E]/10 dark:bg-purple-500/15">
                      <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#A1238E] dark:text-purple-400" />
                    </div>
                    <h2 className="text-base md:text-lg font-semibold text-foreground">
                      Change Password
                    </h2>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-5 ml-9 md:ml-[42px]">
                    Keep your account secure with a strong password.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <Controller
                      control={updateControl}
                      name="old_password"
                      render={({ field }) => (
                        <Input
                          label="Current Password"
                          type={showOld ? "text" : "password"}
                          error={updateError.old_password?.message}
                          right_icon={
                            showOld ? (
                              <BsEyeSlashFill onClick={() => setShowOld(!showOld)} />
                            ) : (
                              <BsEyeFill onClick={() => setShowOld(!showOld)} />
                            )
                          }
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={updateControl}
                      name="password"
                      render={({ field }) => (
                        <Input
                          label="New Password"
                          type={show ? "text" : "password"}
                          error={updateError.password?.message}
                          right_icon={
                            show ? (
                              <BsEyeSlashFill onClick={() => setShow(!show)} />
                            ) : (
                              <BsEyeFill onClick={() => setShow(!show)} />
                            )
                          }
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={updateControl}
                      name="confirm_password"
                      render={({ field }) => (
                        <Input
                          label="Confirm Password"
                          type={showConfirm ? "text" : "password"}
                          error={updateError.confirm_password?.message}
                          right_icon={
                            showConfirm ? (
                              <BsEyeSlashFill
                                onClick={() => setShowConfirm(!showConfirm)}
                              />
                            ) : (
                              <BsEyeFill
                                onClick={() => setShowConfirm(!showConfirm)}
                              />
                            )
                          }
                          {...field}
                        />
                      )}
                    />

                    <div className="h-fit mt-auto">
                      <Button
                        className="bg-[#A1238E] hover:bg-[#59044c] capitalize py-3 px-6 font-semibold text-white text-sm shadow-lg shadow-[#A1238E]/20"
                        text="Update Password"
                        onClick={handlePasswordChange}
                        loading={isSubmitting}
                      />
                    </div>
                  </div>
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─── SAVE BUTTON ─── */}
      <div className="px-3 md:px-8 mt-6 pb-6">
        <Button
          className="w-full bg-[#A1238E] hover:bg-[#59044c] text-white font-semibold py-3.5 px-8 text-sm shadow-lg shadow-[#A1238E]/20 rounded-xl"
          text="Save Changes"
          onClick={updateProfile}
          loading={updating}
        />
      </div>
    </div>
  );
};

export default Profile;
