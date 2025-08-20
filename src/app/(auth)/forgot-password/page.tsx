"use client";
import { ForgotSchema } from "@/schema/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { media_logo } from "../../../../public/assets/images";
import { Button, Input } from "@/components/elements";
import { useForgotPassword } from "@/hooks/authHooks";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotSchema),
  });

  console.log(errors);

  const { mutate: ForgotPassword } = useForgotPassword();

  const handleForgot = handleSubmit((data) => {
    const payload: any = data;

    setIsSubmitting(false);
    ForgotPassword(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        reset({
          email: "",
        });
        toast?.success("Check your email for link to reset password");
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message);
      },
    });
  });

  return (
    <section className="h-full flex items-center justify-center">
      <div className="w-11/12">
        <div className="text-center">
          <div className={`flex items-center justify-center `}>
            <Image src={media_logo} alt="logo" height={100} width={100} />
          </div>
          <p className="text-gray-800 text-sm md:text-base font-medium mt-1">
            AI-Powered Campaign Management
          </p>
        </div>
        <h2 className="text-[#A1238E] font-bold text-center mt-5">
          Enter email linked to your account
        </h2>

        <div className="mt-5 flex flex-col gap-6">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                type="email"
                placeholder="email address..."
                error={errors.email?.message}
                {...field}
              />
            )}
          />

          <Button
            className="w-full bg-[#A1238E] hover:bg-[#59044c] capitalize py-2.5 font-medium text-white"
            loading={isSubmitting}
            onClick={handleForgot}
            text="Send Link"
          />
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
