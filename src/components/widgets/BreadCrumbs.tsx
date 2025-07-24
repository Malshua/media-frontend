"use client";
import { useAuth, useAuthActions } from "@/hooks/useAuthActions";
import { extractFirstPath, getFirstWord } from "@/utilities/helpers";
import { Routes } from "@/utilities/routes";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import UserBadge from "./UserBadge";
import { useParams, usePathname, useRouter } from "next/navigation";

const BreadCrumbs = () => {
  const { user } = useAuth();
  const { back } = useRouter();
  const pathname = usePathname();
  const { campaign_id } = useParams();

  const page = extractFirstPath(pathname);

  const [title, setTitle] = useState<string | string[] | undefined>("");
  const [description, setDescription] = useState("");
  const [pathnames, setPathnames] = useState<any>([]);

  const { updateUser } = useAuthActions();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let greeting;

    switch (true) {
      case currentHour >= 0 && currentHour < 12:
        greeting = "Good morning";
        break;
      case currentHour >= 12 && currentHour < 17:
        greeting = "Good afternoon";
        break;
      case currentHour >= 17 && currentHour <= 23:
        greeting = "Good evening";
        break;
      default:
        greeting = "Hello";
        break;
    }

    return greeting;
  };

  const time = getGreeting();

  useEffect(() => {
    switch (true) {
      // exact match
      case pathname === Routes.CAMPAIGNS:
        setTitle("Campaigns");
        setDescription("");
        setPathnames([""]);
        break;

      // dynamic campaign details route
      case pathname.startsWith("/media/campaigns/"):
        setTitle("Campaign details");
        setDescription("");
        setPathnames([
          { label: "campaigns", href: Routes.CAMPAIGNS },
          {
            label: "campaign details",
            href: Routes.CAMPAIGNS.replace(
              "[org_id]",
              typeof campaign_id === "string" ? campaign_id : ""
            ),
          },
        ]);
        break;

      // new campaign
      case pathname === Routes.NEW_CAMPAIGN:
        setTitle("New Campaign");
        setDescription("");
        setPathnames([""]);
        break;

      // media planning
      case pathname === Routes.MEDIA_PLANNING:
        setTitle("Media Planning");
        setDescription("");
        setPathnames([""]);
        break;

      // analytics
      case pathname === Routes.ANALYTICS:
        setTitle("Analytics");
        setDescription("");
        setPathnames([""]);
        break;

      // profile
      case pathname === Routes.PROFILE:
        setTitle("Profile");
        setDescription("");
        setPathnames([""]);
        break;

      // fallback / dashboard
      default:
        setTitle(
          pathname === Routes.DASHBOARD
            ? `${getGreeting()}, ${user?.name ?? "Invite"} ${
                time === "Good morning"
                  ? "🌅"
                  : time === "Good afternoon"
                  ? "🌞"
                  : time === "Good evening"
                  ? "🌙"
                  : ""
              }`
            : page
        );
        setDescription(pathname === Routes.DASHBOARD ? "Welcome back." : "");
        setPathnames([]);
        break;
    }
  }, [page, pathname, user?.name, time, campaign_id]);

  const generateBreadcrumbHref = (index: number) => {
    // Generate the href by joining the pathnames up to the current index
    return (
      "/" +
      pathnames
        .slice(0, index + 1)
        .join("/")
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  return (
    <div className="hidden flex-1 flex-col gap-1 lg:flex">
      <div className="flex items-center gap-2">
        {pathname == Routes.DASHBOARD ? <UserBadge /> : ""}
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold capitalize text-primary-default">
            {title}
          </span>
          <span className="text-sm text-[#808080]">{description}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm mt-2">
        {pathnames?.length > 1 && (
          <button
            onClick={back}
            className="mr-1 flex items-center gap-3 font-medium text-[#667185]"
          >
            <span className="rounded border p-0.5 text-lg">
              <IoIosArrowRoundBack />
            </span>
            <span>Go back</span>
          </button>
        )}

        <div className="flex gap-1">
          {pathnames?.map((crumb: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-1 capitalize text-[#98A2B3]"
            >
              {index !== 0 && <span>/</span>}
              {index === pathnames.length - 1 ? (
                <span className="font-medium text-blue-700 text-sm">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="all__trans hover:text-blue-500 text-sm"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
