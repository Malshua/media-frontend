"use client";
import { Routes } from "@/utilities/routes";
import { Tooltip } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
            ? "border-l-4 border-blue-500 text-blue-600 font-semibold bg-blue-100"
            : " hover:bg-[#F0F6FF] text-gray-700"
        }`}
      >
        <div
          className={`flex items-center py-4 px-6 ${
            route.includes(href) ? "bg-blue-100/10" : ""
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
      className={`h-full scrollbar-hide flex flex-col bg-white shadow-md border-r w-64 relative py-10 duration-300`}
    >
      {/* profile */}
      <div className={`mb-10 w-fit rounded-lg flex px-6`}>
        <h1 className="text-xl lg:text-3xl font-bold">
          <span className="text-blue-600">Media</span>
          <span className="text-green-500">Flow</span>
        </h1>
      </div>

      {/* links */}
      <div className="border-t border-gray-200 ">
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
