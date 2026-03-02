"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { halfCircle } from "../../../../public/assets/icons";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Routes } from "@/utilities/routes";

const Page = () => {
  const router = useRouter();

  const { logout } = useAuthActions();

  useEffect(() => {
    const logOut = () => {
      logout();
      localStorage.removeItem("token");
      router.push(Routes.LOGIN);
    };

    logOut();
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center">
      <Image src={halfCircle} alt="spinner" height={20} width={20} />
    </div>
  );
};

export default Page;
