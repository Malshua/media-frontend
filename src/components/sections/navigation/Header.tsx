"use client";
import React, { useEffect, useMemo } from "react";
import { extractFirstPath, getFirstWord } from "@/utilities/helpers";
import { useAuth, useAuthActions } from "@/hooks/useAuthActions";
import { BreadCrumbs } from "@/components/widgets";
import MobileNav from "./MobileNav";
import Image from "next/image";
import { BellIcon } from "../../../../public/assets/icons";

const Header = ({ heading }: { heading?: string }) => {
  const unread_notifs = [];

  return (
    <div className="bg-[#ffffff] pt-5">
      {/* Header Content */}
      <div className="flex justify-between items-start gap-2 px-5">
        <div className="flex-1">
          <BreadCrumbs />
        </div>

        <div className="hidden lg:flex items-center gap-7 justify-end pr-5">
          <button className="relative">
            <Image
              src={BellIcon}
              alt="notification bell"
              width={22}
              height={24}
            />

            {unread_notifs?.length > 0 && (
              <span className="block absolute bg-[#002366] top-0 right-0 rounded-full h-3 w-3 border-2 border-white" />
            )}
          </button>
        </div>

        <div className="block lg:hidden">
          <MobileNav />
        </div>
      </div>

      {/* Bottom Line - visible only on lg+ screens */}
      <div
        className={`hidden lg:block border-t-2 mt-3 border-[#669AFF] mx-20`}
      ></div>
    </div>
  );
};

export default Header;
