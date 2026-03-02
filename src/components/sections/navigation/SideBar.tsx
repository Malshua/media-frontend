"use client";
import { Routes } from "@/utilities/routes";
import { Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { media_logo } from "../../../../public/assets/images";

interface navItemProps {
  href: string | any;
  open: boolean;
  title: string;
  base?: string;
}

const NavItem = ({ href, open, title }: navItemProps) => {
  const route = usePathname();

  return (
    <Link href={`${href}`} className="block mb-3">
      <li
        className={`all__trans ${
          route.includes(href)
            ? "border-l-4 border-[#A1238E] text-[#A1238E] dark:text-purple-300 font-semibold bg-purple-100 dark:bg-purple-900/30"
            : " hover:bg-purple-100 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300"
        }`}
      >
        <div
          className={`flex items-center py-4 px-6 ${
            route.includes(href) ? "bg-purple-100/10" : ""
          }`}
        >
          <span className={`ml-4 text-sm font-medium capitalize`}>{title}</span>
        </div>
      </li>
    </Link>
  );
};

const SideBar = ({ open, setOpen }: any) => {
  return (
    <div
      className={`h-full scrollbar-hide flex flex-col bg-background shadow-md border-r w-60 relative py-5 duration-300`}
    >
      {/* profile */}
      <div className={`flex flex-col items-center justify-center mb-5`}>
        <Image src={media_logo} alt="logo" height={100} width={100} />
        <span className="text-xs font-semibold text-[#59044c] dark:text-purple-300">
          Coceptual Media
        </span>
      </div>

      {/* links */}
      <div className="border-t border-border ">
        {/* main */}
        <ul className="pb-8 pt-5 border-b border-[#EDF2F7]/50">
          <NavItem href={Routes.DASHBOARD} open={open} title="Dashboard" />

          <>
            <NavItem href={Routes.CAMPAIGNS} open={open} title="Campaigns" />

            <NavItem
              href={Routes.NEW_CAMPAIGN}
              open={open}
              title="New Campaign"
            />

            <NavItem
              href={Routes.MEDIA_PLANNING}
              open={open}
              title="Media Planning"
            />

            <NavItem href={Routes.ANALYTICS} open={open} title="Analytics" />

            <NavItem href={Routes.PROFILE} open={open} title="Profile" />
            <div className="mt-10">
              <NavItem href={Routes.LOGOUT} open={open} title="Log Out" />
            </div>
          </>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
