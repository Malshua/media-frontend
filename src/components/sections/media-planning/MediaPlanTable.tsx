"use client";
import { EmptyState, ProgressBar, Table } from "@/components/elements";
import { TableSkeleton } from "@/components/skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { GetStatusBadge } from "@/components/widgets";
import { useGetMediaPlans } from "@/hooks/mediaHooks";
import { moneyFormat, truncateText } from "@/utilities/helpers";
import { Routes } from "@/utilities/routes";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import React, { useMemo } from "react";
import { MoreVertical } from "lucide-react";

function MediaPlanTable() {
  const { data: mediaPlans, isLoading } = useGetMediaPlans();

  const info = useMemo(() => {
    return mediaPlans?.data?.data;
  }, [mediaPlans]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor((row: any) => row?.campaignName, {
      id: "campaign name",
      header: () => <span>Campaign Name</span>,
      cell: (info: any) => {
        const value = info?.row?.original;
        return (
          <div className="font-medium">
            {truncateText(value?.campaignName, 40)}
          </div>
        );
      },
    }),

    columnHelper.accessor((row: any) => "", {
      id: "status",
      header: () => <span>Status</span>,
      cell: (info: any) => {
        const status = info?.row?.original?.adminApprovalStatus;
        return <div>{<GetStatusBadge status={status} />}</div>;
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

    columnHelper.accessor((row: any) => "", {
      id: "type",
      header: () => <span>Campaign type</span>,
      cell: (info: any) => {
        const value = info?.row?.original;
        return <div>{value?.campaignType.replace(/_/g, " ")}</div>;
      },
    }),

    columnHelper.accessor((row: any) => "", {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: (info: any) => {
        const value = info?.row?.original;
        return (
          <Link
            href={`${Routes?.MEDIA_PLANNING}/${value?.campaignId}`}
            className="text-[#A1238E] font-medium underline cursor-default hover:text-[#59044c]"
          >
            View Details
          </Link>
        );
      },
    }),
  ];

  return (
    <div className="bg-white p-5 shadow-sm rounded-lg px-3 mx-4">
      <div className=" mb-5 md:px-4">
        <h1 className="font-bold text-base md:text-lg text-gray-700">
          Media Plans
        </h1>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : info?.all?.length < 1 ? (
        <EmptyState />
      ) : (
        <div>
          <div className="hidden md:block">
            <Table columns={columns} data={info?.all} />
          </div>
          <div className="block md:hidden">
            {info?.all.map((ro: any, i: number) => {
              return (
                <div
                  key={i}
                  className="border px-2 py-4 rounded-md flex items-start justify-between"
                >
                  <div className="">
                    <div className="flex flex-col gap-1">
                      <div className="font-semibold text-lg">
                        {ro?.campaignName}
                      </div>

                      <div className="whitespace-nowrap capitalize text-green-800 font-medium">
                        {ro?.campaignType.replace(/_/g, " ")}
                      </div>

                      <div className="w-fit py-1 flex items-center gap-2 rounded-2xl capitalize">
                        ₦{moneyFormat(ro?.budget)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-10">
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link
                            href={`${Routes?.MEDIA_PLANNING}/${ro?.campaignId}`}
                            className="text-[#A1238E] font-medium underline cursor-default hover:text-[#59044c]"
                          >
                            <DropdownMenuItem>View details</DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                    <div className="pr-2">
                      {
                        <GetStatusBadge
                          status={
                            ro?.adminApprovalStatus ? "active" : "inactive"
                          }
                        />
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaPlanTable;
