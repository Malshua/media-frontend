"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuthActions";
import { getFirstLetters, truncateText } from "@/utilities/helpers";
import { Routes } from "@/utilities/routes";
import { usePathname } from "next/navigation";
import { media_logo } from "../../../../public/assets/images";

const MobileNav = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const firstRoute = pathname.split("/")[1] || "";

  const name = user?.name || "";
  const email = user?.email || "";

  const name_initials = getFirstLetters(name);

  const handleMenu = () => {
    setOpen((prev) => !prev);
  };

  const nav_items = [
    {
      href: Routes.DASHBOARD,
      label: "Dashboard",
    },
    {
      href: Routes.CAMPAIGNS,
      label: "Campaigns",
    },
    {
      href: Routes.NEW_CAMPAIGN,
      label: "New Campaigns",
    },
    {
      href: Routes.MEDIA_PLANNING,
      label: "Media Planning",
    },

    {
      href: Routes.ANALYTICS,
      label: "Analytics",
    },
    {
      href: Routes.PROFILE,
      label: "Profile",
    },
    {
      href: Routes.LOGOUT,
      label: "Logout",
    },
  ];

  return (
    <nav>
      <div
        className={`fixed z-20 top-0 left-0 right-0 w-full flex justify-between items-center px-3 py-3 all__trans bg-background`}
      >
        <div className="flex items-center">
          <Image src={media_logo} alt="logo" height={36} width={36} />
        </div>

        <div className="mr-2 flex items-center">
          <button
            onClick={handleMenu}
            className={`text-foreground inline-flex items-center justify-center rounded-md text-2xl`}
          >
            {open === true ? "" : <FaBars />}
          </button>
        </div>
      </div>

      <div
        className={`p-5 fixed z-[800] top-0 bottom-0 w-80 bg-background transition-all ease-in-out duration-300 flex flex-col gap-y-10 ${
          open ? "left-0" : "-left-96"
        }`}
      >
        <div>
          <div className="flex justify-end">
            <button
              onClick={handleMenu}
              className="text-foreground text-4xl font-normal"
            >
              <IoCloseSharp />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-card text-[#A1238E] dark:text-purple-300 flex items-center justify-center uppercase font-semibold border border-[#A1238E] dark:border-purple-300">
              {name_initials}
            </div>
            <div className="flex flex-col leading-5">
              <span className="text-sm text-[#A1238E] font-semibold capitalize">
                {name}
              </span>
              <span className="text-xs text-muted-foreground">
                {truncateText(email, 20)}
              </span>
            </div>
          </div>
        </div>

        <ul className="text-foreground flex flex-col gap-5">
          {nav_items?.map((item, index) => (
            <li
              key={index}
              onClick={handleMenu}
              className={`text-lg ${
                pathname.includes(item?.href)
                  ? "text-[#A1238E] dark:text-purple-300 font-semibold"
                  : "font-light text-muted-foreground hover:text-secondary-default"
              }`}
            >
              <Link href={item?.href}>{item?.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div
          onClick={handleMenu}
          className="fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/40"
        />
      )}
    </nav>
  );
};

export default MobileNav;
