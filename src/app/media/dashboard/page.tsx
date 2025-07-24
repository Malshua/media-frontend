"use client";
import { Button } from "@/components/elements";
import {
  CampaignsTable,
  GeneratedHighlights,
} from "@/components/sections/dashboard";
import { CardSkeleton2 } from "@/components/skeletons";
import { useGetDashStats } from "@/hooks/dashboard";
import { useAuth } from "@/hooks/useAuthActions";
import { Routes } from "@/utilities/routes";
import Link from "next/link";
import React, { useMemo } from "react";

const card_data = [
  { label: "Active Campaigns", value: "5" },
  { label: "Budget Utilized", value: "$24,500" },
  { label: "Total Reach", value: "140K" },
  { label: "Avg. Engagement", value: "24%" },
];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useGetDashStats();

  const info = useMemo(() => {
    return stats?.data?.data;
  }, [stats]);

  const card_data = [
    { label: "Active Campaigns", value: `${info?.totalCampaigns || 0}` },
    { label: "Budget Utilized", value: `$${info?.totalBudget || 0}` },
    { label: "Total Reach", value: "140K" },
    { label: "Avg. Engagement", value: "24%" },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#f5f8fc]">
      <div className="flex items-center justify-between mb-5">
        <p className="hidden md:block md:text-xl font-medium text-gray-800">
          Campaigns overview.
        </p>

        <Link href={Routes.NEW_CAMPAIGN} className="w-fit ml-auto">
          <Button
            className="bg-blue-600 text-xs md:text-base hover:bg-blue-700 capitalize py-2.5 px-4 font-medium text-white"
            text="+ New Campaign"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
        {isLoading ? (
          <CardSkeleton2 count={4} />
        ) : (
          card_data.map((item, i) => (
            <div
              key={i}
              className="bg-white flex flex-col gap-3 py-8 px-6 shadow-md items-center rounded-md"
            >
              <span className="text-blue-600 font-bold text-2xl">
                {item?.value}
              </span>
              <span className="text-gray-600">{item?.label}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-10">
        <CampaignsTable />
      </div>
      <div className="mt-10">
        <GeneratedHighlights />
      </div>
    </div>
  );
};

export default Dashboard;
