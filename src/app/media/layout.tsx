"use client";

import { Header, SideBar } from "@/components/sections/navigation";
import React, { ReactNode, useState } from "react";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-primary-soft">
      <div className="relative flex h-screen">
        <div className="hidden md:block relative">
          <SideBar open={open} setOpen={setOpen} />
        </div>

        <div className="flex-1 overflow-x-hidden mt-12 lg:mt-0 mb-20 lg:mb-0 bg-white">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
