"use client";
import { Button, Input, SelectDropdown } from "@/components/elements";
import { useUpdateDetails, useUpdatePassword } from "@/hooks/profileHooks";
import { useAuth, useAuthActions } from "@/hooks/useAuthActions";
import { changePasswordSchema, userSchema } from "@/schema/profileSchema";
import { getFirstLetters } from "@/utilities/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const name_initials = getFirstLetters(user?.name);
  const { updateUser } = useAuthActions();
  const [show, setShow] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: updatePassword } = useUpdatePassword();

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
    | "campaignUpdates"
    | "weeklyReports"
    | "budgetAlerts"
    | "marketingTips";

  const [preferences, setPreferences] = useState<{
    campaignUpdates: boolean;
    weeklyReports: boolean;
    budgetAlerts: boolean;
    marketingTips: boolean;
  }>({
    campaignUpdates: true,
    weeklyReports: true,
    budgetAlerts: true,
    marketingTips: false,
  });

  const togglePreference = (key: PreferenceKey) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      position: user?.position,
      companyName: user?.companyName,
      industry: {
        label: user?.industry,
        value: user?.industry,
      },
      companyAddress: user?.companyAddress,
    });
  }, [user, reset]);

  const { mutate: update } = useUpdateDetails();

  const handleUpdate = handleSubmit((data) => {
    const payload: any = {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      position: data?.position,
      companyName: data?.companyName,
      companyAddress: data?.companyAddress,
      industry: data?.industry?.value,
    };

    setUpdating(true);
    update(payload, {
      onSuccess: (response) => {
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
  });

  return (
    <div className="p-4 md:p-8 bg-[#f5f8fc]">
      <div className="flex md:items-center flex-col md:flex-row justify-between mb-6 gap-5">
        <div className="text-gray-800 space-y-1">
          <h1 className="text-xl md:text-3xl font-bold">Your Profile</h1>
          <p className="text-xs md:text-sm font-medium">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="w-fit">
          <Button
            className="bg-purple-500 hover:bg-purple-600 capitalize py-2.5 px-4 font-medium text-white text-xs md:text-sm"
            text="Save Changes"
            onClick={handleUpdate}
            loading={updating}
          />
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full mt-5 md:mt-10">
        <div className="flex items-center space-x-5 ">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
            {name_initials}
          </div>

          {/* Info and Button */}
          <div>
            <div className="text-gray-900 font-semibold text-lg">
              {user?.name}
            </div>
            <div className="text-gray-500 text-sm mb-1.5">
              {user?.companyName}
            </div>
            <button className="text-purple-600 border border-purple-500 px-4 py-2.5 rounded-sm text-sm hover:bg-purple-50 transition">
              Change Photo
            </button>
          </div>
        </div>
        <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-14">
          Personal Information
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <Input
                type="text"
                placeholder="(555) 123-4567"
                label="Phone Number"
                error={errors?.phone?.message}
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

        <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-14">
          Company Information
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <h3 className="text-xl font-bold border-b border-gray-200 pb-3 mt-14">
          Notification Preferences
        </h3>
        <div className="space-y-5 text-sm text-gray-700 mt-5">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.campaignUpdates}
              onChange={() => togglePreference("campaignUpdates")}
              className="accent-purple-600 h-4 w-4"
            />
            <span>Campaign status updates</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.weeklyReports}
              onChange={() => togglePreference("weeklyReports")}
              className="accent-purple-600 h-4 w-4"
            />
            <span>Weekly analytics reports</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.budgetAlerts}
              onChange={() => togglePreference("budgetAlerts")}
              className="accent-purple-600 h-4 w-4"
            />
            <span>Budget alerts</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.marketingTips}
              onChange={() => togglePreference("marketingTips")}
              className="accent-purple-600 h-4 w-4"
            />
            <span>Marketing tips and best practices</span>
          </label>
        </div>

        <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-14">
          Security
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <BsEyeFill onClick={() => setShowConfirm(!showConfirm)} />
                  )
                }
                {...field}
              />
            )}
          />
          <div className="h-fit mt-auto">
            <Button
              className="bg-purple-500 hover:bg-purple-600 capitalize py-3 px-4 font-medium text-white text-xs md:text-sm"
              text="Save password"
              onClick={handlePasswordChange}
              loading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
