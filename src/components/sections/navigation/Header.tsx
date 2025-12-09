"use client";
import React, { useEffect, useMemo } from "react";
import { extractFirstPath, getFirstWord } from "@/utilities/helpers";
import { useAuth, useAuthActions } from "@/hooks/useAuthActions";
import { BreadCrumbs } from "@/components/widgets";
import MobileNav from "./MobileNav";
import Image from "next/image";
import { BellIcon } from "../../../../public/assets/icons";
import { NotificationDialog } from "@/components/elements";

const Header = ({ heading }: { heading?: string }) => {
  const unread_notifs = [];

  return (
    <div className="bg-[#ffffff] pt-5">
      {/* Header Content */}
      <div className="flex justify-between items-start gap-2 px-5">
        <div className="flex-1">
          <BreadCrumbs />
        </div>

        <div className="hidden md:flex items-center gap-7 justify-end pr-5">
          <button className="relative">
            <NotificationDialog />

            {unread_notifs?.length > 0 && (
              <span className="block absolute bg-[#b314c5] top-0 right-0 rounded-full h-3 w-3 border-2 border-white" />
            )}
          </button>
        </div>

        <div className="block md:hidden">
          <MobileNav />
        </div>
      </div>

      {/* Bottom Line - visible only on lg+ screens */}
      <div
        className={`hidden md:block border-t-2 mt-3 border-[#cc6cd9] mx-20`}
      ></div>
    </div>
  );
};

export default Header;
