"use client";
import { PasswordSchema } from "@/schema/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { media_logo } from "../../../../public/assets/images";
import { Button, Input } from "@/components/elements";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/authHooks";
import { toast } from "react-toastify";
import { Routes } from "@/utilities/routes";

const ResetPassword = () => {
  const [show, setShow] = useState(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get("token");

  const { mutate: resetPassword } = useResetPassword({ token });

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PasswordSchema),
  });

  const handleReset = handleSubmit((data) => {
    const payload: any = {
      password: data?.password,
    };

    setIsSubmitting(true);
    resetPassword(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast.success(response?.data?.message);
        push(Routes?.LOGIN);
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
          Enter your new password
        </h2>

        <div className="mt-5 flex flex-col gap-6">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="New Password"
                type={show ? "text" : "password"}
                error={errors?.password?.message}
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
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                error={errors?.confirm_password?.message}
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

          <Button
            className="w-full bg-[#A1238E] hover:bg-[#59044c] capitalize py-2.5 font-medium text-white"
            loading={isSubmitting}
            onClick={handleReset}
            text="Reset password"
          />
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
