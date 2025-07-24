"use client";

import { Button, Input } from "@/components/elements";
import { useChangePassword } from "@/hooks/authHooks";
import { resetPasswordSchema } from "@/schema/authSchema";
import { Routes } from "@/utilities/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = searchParams.get("email");
  const token = localStorage.getItem("token");
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const { mutate: changePassword } = useChangePassword({ token });

  const handleChange = handleSubmit((data) => {
    const payload: any = {
      email: email,
      newPassword: data?.password,
      confirmPassword: data?.confirm_password,
    };

    setIsSubmitting(true);
    changePassword(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        toast.info(response?.data?.message);
        push(`${Routes?.USER_DETAILS}`);
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message);
      },
    });
  });

  return (
    <>
      <section className="h-full flex items-center justify-center">
        <div className="w-11/12">
          <div className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold">
              <span className="text-blue-600">Media</span>
              <span className="text-green-500">Flow</span>
            </h1>
            <p className="text-gray-800 text-sm md:text-base font-medium mt-1">
              AI-Powered Campaign Management
            </p>
          </div>
          <h2 className="md:text-xl text-blue-600 font-bold text-center mt-5">
            Change your password
          </h2>

          <div className="mt-5 flex flex-col gap-6">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  label="New Password"
                  type={show ? "text" : "password"}
                  placeholder="*********"
                  error={errors.password?.message}
                  required
                  right_icon={
                    show ? (
                      <BsEyeSlashFill onClick={() => setShow(!show)} />
                    ) : (
                      <BsEyeFill onClick={() => setShow(!show)} />
                    )
                  }
                  onChange={(e: any) => {
                    field.onChange(e); // Trigger React Hook Form's onChange
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <Input
                  label="Repeat Password"
                  type={show ? "text" : "password"}
                  placeholder="Type your new password again"
                  error={errors.confirm_password?.message}
                  right_icon={
                    show ? (
                      <BsEyeSlashFill onClick={() => setShow(!show)} />
                    ) : (
                      <BsEyeFill onClick={() => setShow(!show)} />
                    )
                  }
                  required
                  {...field}
                />
              )}
            />

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 capitalize py-2.5 font-medium text-white"
              loading={isSubmitting}
              onClick={handleChange}
              text="Submit"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
