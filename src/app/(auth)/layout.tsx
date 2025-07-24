"use client";
import { Wrapper } from "@/components/elements";
import Image from "next/image";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen bg-[#F5F8FF]">
      <section className=" h-screen overflow-y-auto">
        <Wrapper>
          <div className="flex flex-col gap-5">
            <form className="w-full sm:w-4/5 md:w-[526px] mt-7 mx-auto flex flex-col justify-center p-5 py-5 md:px-10 shadow-sm bg-white rounded-2xl transition-transform duration-300 hover:-translate-y-1">
              {children}
            </form>
          </div>
        </Wrapper>
      </section>
    </div>
  );
}
