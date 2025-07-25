"use client";
import { Button, CustomInput } from "@/components/elements";
import Input from "@/components/elements/Input";
import { useLogin } from "@/hooks/authHooks";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Routes } from "@/utilities/routes";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { media_logo } from "../../../../public/assets/images";
import Image from "next/image";

interface LoginTypes {
  email: string;
  password: string;
}

const Page = () => {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: loginUser } = useLogin();
  const { login } = useAuthActions();
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>();

  const handleLogin = handleSubmit((data) => {
    const payload: any = {
      email: data?.email,
      password: data?.password,
    };

    setIsSubmitting(true);
    loginUser(payload, {
      onSuccess: (response) => {
        setIsSubmitting(false);
        const token = response.data.data?.token;
        const user = response.data.data?.userDetails;
        const details: any = token ? jwtDecode(token) : {};

        if (!details?.password_changed) {
          toast.info("Update your password to proceed");
          // Store token in localStorage
          if (token) {
            localStorage.setItem("token", token);
          }
          push(`${Routes?.NEW_PASSWORD}?email=${details?.email}`);
          return;
        }

        if (!details?.details_submitted) {
          toast.info(response?.data?.message);
          // Store token in localStorage
          if (token) {
            localStorage.setItem("token", token);
          }
          push(`${Routes?.USER_DETAILS}`);
          return;
        }

        const login_data = {
          token: response.data.data?.token,
          user: {
            id: details?.id,
            name: user?.fullName,
            email: details?.email,
            phone: user?.phoneNumber,
            companyAddress: user?.companyAddress,
            companyName: user?.companyName,
            industry: user?.industry,
            position: user?.position,
            picture: user?.picture,
          },
          isAuthenticated: true,
        };

        login(login_data);
        push(Routes?.DASHBOARD);
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
            <div className={`flex items-center justify-center `}>
              <Image src={media_logo} alt="logo" height={100} width={100} />
            </div>
            <p className="text-gray-800 text-sm md:text-base font-medium mt-1">
              AI-Powered Campaign Management
            </p>
          </div>
          <h2 className="md:text-xl text-purple-600 font-bold text-center mt-5">
            Login to Your Account
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

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  label="Password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password here"
                  error={errors.password?.message}
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

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 capitalize py-2.5 font-medium text-white"
              loading={isSubmitting}
              onClick={handleLogin}
              text="Login"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
