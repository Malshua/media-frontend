"use client";

import { EmptyState, ProgressBar, Table } from "@/components/elements";
import { TableSkeleton } from "@/components/skeletons";
import { useGetCampaigns } from "@/hooks/campaignHooks";
import { Routes } from "@/utilities/routes";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import React, { useMemo } from "react";

const Campaigns = () => {
  const { data: campaigns, isLoading } = useGetCampaigns();

  const info = useMemo(() => {
    return campaigns?.data?.campaigns;
  }, [campaigns]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row: any) => row?.campaignName, {
      id: "campaign name",
      header: () => <span>Campaign Name</span>,
      cell: (info: any) => {
        const value = info?.row?.original;

        return <div>{value?.campaignName}</div>;
      },
    }),

    columnHelper.accessor((row: any) => row?.status, {
      id: "status",
      header: () => <span>Status</span>,
      cell: (info: any) => {
        const status = info?.getValue();
        return (
          <div
            className={`${
              status == "active"
                ? "bg-green-500"
                : status == "pending"
                ? "bg-amber-300"
                : status == "completed"
                ? "bg-red-500"
                : ""
            } py-1 px-2.5 text-white text-xs rounded w-fit`}
          >
            {status}
          </div>
        );
      },
    }),

    columnHelper.accessor((row: any) => row?.budget, {
      id: "budget",
      header: () => <span>Budget</span>,
      cell: (info: any) => {
        const budget = info?.getValue();
        return <div className="font-medium">${budget}</div>;
      },
    }),

    columnHelper.accessor((row: any) => row?.performance, {
      id: "performance",
      header: () => <span>Performance</span>,
      cell: (info: any) => {
        const value = info?.getValue();
        return (
          <div>
            <ProgressBar value={value} />
          </div>
        );
      },
    }),

    columnHelper.accessor((row: any) => "", {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: any) => {
        const value = info.row.original;
        return (
          <Link
            href={`${Routes?.CAMPAIGNS}/${value?.id}`}
            className="text-purple-500 font-medium underline cursor-default hover:text-purple-600"
          >
            View Details
          </Link>
        );
      },
    }),
  ];

  return (
    <div className="bg-white p-5 shadow-sm rounded-lg mx-4 mt-10">
      <div className="flex items-center justify-between mb-5 md:px-4">
        <h1 className="font-bold text-base md:text-lg text-gray-700">
          All Campaigns
        </h1>
        <div></div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : info?.length < 1 ? (
        <EmptyState />
      ) : (
        <Table columns={columns} data={info} />
      )}
    </div>
  );
};

export default Campaigns;
