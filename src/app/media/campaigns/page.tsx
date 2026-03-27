"use client";

import { EmptyState, ProgressBar, Table } from "@/components/elements";
import { TableSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetStatusBadge } from "@/components/widgets";
import { useGetCampaigns } from "@/hooks/campaignHooks";
import { moneyFormat } from "@/utilities/helpers";
import { Routes } from "@/utilities/routes";
import { createColumnHelper } from "@tanstack/react-table";
import {
  MoreVertical,
  Plus,
  Megaphone,
  Rocket,
  ShoppingBag,
  CalendarHeart,
  Target,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Campaign type icon mapping ─────────────────────────────

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

// ── Status filter tabs ─────────────────────────────────────

const filterTabs = ["all", "active", "pending", "ended"] as const;
type FilterTab = (typeof filterTabs)[number];

// ── Mobile Campaign Card ───────────────────────────────────

function MobileCampaignCard({ campaign }: { campaign: any }) {
  const Icon =
    campaignTypeIcon[campaign.campaignType] || Megaphone;
  const colorClass =
    campaignTypeColor[campaign.campaignType] ||
    "bg-muted text-muted-foreground";

  const startDate = campaign.startDate
    ? new Date(campaign.startDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";
  const endDate = campaign.endDate
    ? new Date(campaign.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      })
    : "";

  return (
    <Link href={`${Routes.CAMPAIGNS}/${campaign.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-card rounded-2xl p-4 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
          >
            <Icon size={20} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {campaign.campaignName}
                </h3>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {campaign.campaignType?.replace(/_/g, " ")}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
                ₦{moneyFormat(campaign.budget)}
              </span>
              {startDate && (
                <span className="text-xs text-muted-foreground">
                  {startDate} – {endDate}
                </span>
              )}
            </div>

            {/* Status row */}
            <div className="flex items-center gap-2 mt-2.5">
              <GetStatusBadge
                status={
                  campaign.adminApprovalStatus === "approved"
                    ? "active"
                    : campaign.adminApprovalStatus === "rejected"
                    ? "rejected"
                    : "pending"
                }
              />
              {campaign.aiPlanStatus &&
                campaign.aiPlanStatus !== "not_generated" && (
                  <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">
                    AI Plan
                  </span>
                )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Mobile Campaigns View ──────────────────────────────────

function MobileCampaignsView({
  campaigns,
  isLoading,
}: {
  campaigns: any[];
  isLoading: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    let list = campaigns;

    // Filter by tab
    if (activeFilter !== "all") {
      list = list.filter((c: any) => {
        if (activeFilter === "active")
          return c.adminApprovalStatus === "approved";
        if (activeFilter === "pending")
          return c.adminApprovalStatus === "pending";
        if (activeFilter === "ended")
          return (
            c.status === "ended" || c.adminApprovalStatus === "rejected"
          );
        return true;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c: any) =>
        c.campaignName?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [campaigns, activeFilter, searchQuery]);

  // Count per tab
  const counts = useMemo(() => {
    if (!campaigns) return { all: 0, active: 0, pending: 0, ended: 0 };
    return {
      all: campaigns.length,
      active: campaigns.filter(
        (c: any) => c.adminApprovalStatus === "approved"
      ).length,
      pending: campaigns.filter(
        (c: any) => c.adminApprovalStatus === "pending"
      ).length,
      ended: campaigns.filter(
        (c: any) =>
          c.status === "ended" || c.adminApprovalStatus === "rejected"
      ).length,
    };
  }, [campaigns]);

  if (isLoading) {
    return (
      <div className="px-4 pt-2 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-36 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-10 bg-muted animate-pulse rounded-xl" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-muted animate-pulse rounded-full"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-foreground">Campaigns</h1>
          {campaigns?.length > 0 && (
            <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
              {campaigns.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <Search size={18} />
          </button>
          <Link href={Routes.NEW_CAMPAIGN}>
            <div className="h-10 w-10 rounded-xl bg-[#A1238E] flex items-center justify-center text-white active:scale-95 transition-transform">
              <Plus size={20} />
            </div>
          </Link>
        </div>
      </div>

      {/* Search bar (expandable) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full bg-muted rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-purple-500/30"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab;
          const count = counts[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium capitalize transition-colors ${
                isActive
                  ? "bg-[#A1238E] text-white"
                  : "bg-muted text-muted-foreground active:bg-muted/80"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] ${
                  isActive ? "text-white/70" : "text-muted-foreground/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Campaign list */}
      {filtered?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Megaphone size={28} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {searchQuery
              ? "No campaigns match your search"
              : activeFilter !== "all"
              ? `No ${activeFilter} campaigns`
              : "No campaigns yet"}
          </p>
          {!searchQuery && activeFilter === "all" && (
            <Link href={Routes.NEW_CAMPAIGN}>
              <div className="mt-1 px-4 py-2 rounded-lg bg-[#A1238E] text-white text-sm font-medium active:scale-95 transition-transform">
                Create Campaign
              </div>
            </Link>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map((campaign: any) => (
              <MobileCampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────

function Campaigns() {
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
        const value = info.row.original;
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
    <div className="bg-muted/50 mt-5 sm:mt-0 min-h-screen">
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileCampaignsView campaigns={info} isLoading={isLoading} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="bg-card p-3 md:p-5 shadow-sm rounded-lg mx-2 md:mx-4 mt-10 overflow-hidden">
          <div className="flex items-center justify-between mb-5 md:px-4">
            <h1 className="font-bold text-base md:text-lg text-foreground">
              All Campaigns
            </h1>
            <Link href={Routes.NEW_CAMPAIGN}>
              <Button className="bg-[#A1238E] text-sm hover:bg-[#59044c] capitalize py-2.5 px-4 font-medium text-white">
                + New Campaign
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <TableSkeleton />
          ) : info?.length < 1 ? (
            <EmptyState />
          ) : (
            <Table columns={columns} data={info} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
