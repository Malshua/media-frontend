"use client";

import {
  Button,
  Input,
  SelectDropdown,
  TelephoneInput,
} from "@/components/elements";
import { useUserDetails } from "@/hooks/authHooks";
import { useAuthActions } from "@/hooks/useAuthActions";
import { userDetailsSchema } from "@/schema/authSchema";
import { Routes } from "@/utilities/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { media_logo } from "../../../../public/assets/images";
import { toast } from "react-toastify";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthActions();
  const { push } = useRouter();

  const {
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userDetailsSchema),
  });

  const token = localStorage.getItem("token");

  const { mutate: userDetails } = useUserDetails({ token });

  const handleUserDetails = handleSubmit((data) => {
    const payload: any = {
      fullName: data?.name,
      position: data?.position,
      companyName: data?.companyName,
      industry: data?.industry.label,
      companyAddress: data?.companyAddress,
      email: data?.email,
      phoneNumber: data?.phone,
    };

    setIsSubmitting(true);
    userDetails(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        const details = response?.data;

        const login_data = {
          token: token,
          user: {
            id: details?.user?.id,
            email: details?.user?.email,
            name: details?.userDetails?.fullName,
            phone: details?.userDetails?.phoneNumber,
            companyAddress: details?.userDetails?.companyAddress,
            companyName: details?.userDetails?.companyName,
            industry: details?.userDetails?.industry,
            position: details?.userDetails?.position,
            picture: details?.userDetails?.picture,
          },
          isAuthenticated: true,
        };

        login(login_data);
        push(Routes?.DASHBOARD);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        console.log(error);
        toast.error(error?.response?.data?.message);
      },
    });
  });

  return (
    <div>
      <div className="text-center">
        <div className={`flex items-center justify-center `}>
          <Image src={media_logo} alt="logo" height={100} width={100} />
        </div>
        <p className="text-gray-800 text-sm md:text-base font-medium mt-1">
          AI-Powered Campaign Management
        </p>
      </div>
      <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-10">
        Personal Information
      </h1>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
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
      <h1 className="text-xl font-bold border-b border-gray-200 pb-3 mt-10">
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

        <div className="md:col-span-2">
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
      </div>

      <Button
        className="w-full bg-[#A1238E] hover:bg-[#59044c] capitalize py-2.5 font-medium text-white mt-4"
        loading={isSubmitting}
        onClick={handleUserDetails}
        text="Submit"
      />
    </div>
  );
};

export default Page;
