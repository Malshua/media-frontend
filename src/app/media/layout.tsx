"use client";

import { Header, SideBar } from "@/components/sections/navigation";
import MobileBottomNav from "@/components/sections/navigation/MobileBottomNav";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import { media_logo } from "../../../public/assets/images";

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-background overflow-x-hidden">
      <div className="relative flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block relative">
          <SideBar open={open} setOpen={setOpen} />
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-background">
          {/* Mobile top bar — logo only */}
          <div className="fixed top-0 left-0 right-0 z-20 flex items-center px-4 py-3 bg-background/80 backdrop-blur-lg md:hidden">
            <Image src={media_logo} alt="Coceptual" height={36} width={36} />
          </div>

          {/* Desktop header */}
          <div className="hidden md:block">
            <Header />
          </div>

          {/* Main content with mobile safe spacing */}
          <div className="pt-14 pb-20 md:pt-0 md:pb-0">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DefaultLayout;
