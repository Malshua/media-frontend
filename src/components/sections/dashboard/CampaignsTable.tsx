"use client";
import { Button, EmptyState, ProgressBar, Table } from "@/components/elements";
import { TableSkeleton } from "@/components/skeletons";
import { useGetCampaigns } from "@/hooks/campaignHooks";
import { moneyFormat } from "@/utilities/helpers";
import { Routes } from "@/utilities/routes";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

const CampaignsTable = () => {
  const { data: campaigns, isLoading } = useGetCampaigns();
  const { push } = useRouter();

  const info = useMemo(() => {
    return campaigns?.data?.campaigns;
  }, [campaigns]);

  const data = info?.slice(0, 3);

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
        return <div className="font-medium">₦{moneyFormat(budget)}</div>;
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
        const value = info?.row?.original;
        return (
          <Link
            href={`${Routes?.CAMPAIGNS}/${value?.id}`}
            className="text-[#A1238E] font-medium underline cursor-default hover:text-[#59044c]"
          >
            View Details
          </Link>
        );
      },
    }),
  ];

  return (
    <div className="bg-white p-5 shadow-sm rounded-lg px-3">
      <div className="flex items-center justify-between mb-5 md:px-4">
        <h1 className="font-bold text-base md:text-lg text-gray-700">
          Recent Campaigns
        </h1>
        <Link className="w-fit" href={Routes.CAMPAIGNS}>
          <Button
            className="bg-[#A1238E] text-sm md:text-base hover:bg-[#59044c] capitalize py-2.5 px-4 font-medium hover:underline text-white"
            text="View All"
          />
        </Link>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : info?.length < 1 ? (
        <EmptyState />
      ) : (
        <Table columns={columns} data={data} />
      )}
    </div>
  );
};

export default CampaignsTable;
