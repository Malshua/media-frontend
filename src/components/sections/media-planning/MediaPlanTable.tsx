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
import { motion } from "framer-motion";
import {
  MoreVertical,
  ChevronRight,
  FileText,
  Megaphone,
  Rocket,
  ShoppingBag,
  CalendarHeart,
  Target,
} from "lucide-react";

const campaignTypeIcon: Record<string, React.ElementType> = {
  brand_awareness: Megaphone,
  product_launch: Rocket,
  promotion_sales: ShoppingBag,
  event_marketing: CalendarHeart,
  lead_generation: Target,
};

const campaignTypeColor: Record<string, string> = {
  brand_awareness:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
  product_launch:
    "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  promotion_sales:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
  event_marketing:
    "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300",
  lead_generation:
    "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
};

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
    <>
      {/* Desktop: Table inside card */}
      <div className="hidden md:block bg-card p-5 shadow-sm rounded-2xl overflow-hidden">
        <div className="mb-5 px-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            All Plans
          </h2>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : info?.all?.length < 1 ? (
          <EmptyState />
        ) : (
          <Table columns={columns} data={info?.all} />
        )}
      </div>

      {/* Mobile: Card list */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : !info?.all?.length ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <FileText size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              No media plans yet
            </p>
            <Link href={Routes.NEW_CAMPAIGN}>
              <div className="px-4 py-2 rounded-lg bg-[#A1238E] text-white text-xs font-medium active:scale-95 transition-transform">
                Create a campaign
              </div>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {info?.all.map((ro: any, i: number) => {
              const Icon =
                campaignTypeIcon[ro?.campaignType] || FileText;
              const iconColor =
                campaignTypeColor[ro?.campaignType] ||
                "bg-muted text-muted-foreground";

              return (
                <motion.div
                  key={ro?.campaignId || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: i * 0.04,
                  }}
                >
                  <Link
                    href={`${Routes?.MEDIA_PLANNING}/${ro?.campaignId}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card active:bg-muted/60 transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {ro?.campaignName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {ro?.campaignType?.replace(/_/g, " ")} ·{" "}
                        <span className="font-medium text-foreground">
                          ₦{moneyFormat(ro?.budget)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <GetStatusBadge
                        status={
                          ro?.adminApprovalStatus === "approved"
                            ? "active"
                            : ro?.adminApprovalStatus === "rejected"
                            ? "rejected"
                            : "pending"
                        }
                      />
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default MediaPlanTable;
