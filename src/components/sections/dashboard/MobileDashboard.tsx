"use client";
import React, { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import Link from "next/link";
import { Routes } from "@/utilities/routes";
import { moneyFormat } from "@/utilities/helpers";
import { useGetCampaigns } from "@/hooks/campaignHooks";
import { GetStatusBadge } from "@/components/widgets";
import {
  Plus,
  LayoutDashboard,
  BarChart3,
  FileText,
  ChevronRight,
  Megaphone,
  Rocket,
  ShoppingBag,
  CalendarHeart,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Bell,
} from "lucide-react";
import { NotificationDialog } from "@/components/elements";

// ── Helpers ────────────────────────────────────────────────

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

// ── Card Data ──────────────────────────────────────────────

interface DashCard {
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
  icon: React.ElementType;
}

const buildCards = (info: any): DashCard[] => [
  {
    label: "Active Campaigns",
    value: `${info?.totalCampaigns || 0}`,
    subtitle: "Total campaigns created",
    gradient: "from-fuchsia-500 to-purple-600",
    icon: Megaphone,
  },
  {
    label: "Budget Utilized",
    value: `₦${moneyFormat(info?.totalBudget) || "0"}`,
    subtitle: "Across all campaigns",
    gradient: "from-orange-500 to-amber-600",
    icon: TrendingUp,
  },
  {
    label: "Total Reach",
    value: "...",
    subtitle: "Estimated audience reach",
    gradient: "from-teal-400 to-emerald-600",
    icon: Users,
  },
  {
    label: "Avg. Engagement",
    value: "..%",
    subtitle: "Campaign engagement rate",
    gradient: "from-blue-500 to-indigo-700",
    icon: Zap,
  },
];

// ── Quick Access ───────────────────────────────────────────

const quickActions = [
  {
    icon: Plus,
    label: "New Campaign",
    href: Routes.NEW_CAMPAIGN,
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
  },
  {
    icon: LayoutDashboard,
    label: "Campaigns",
    href: Routes.CAMPAIGNS,
    color:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: Routes.ANALYTICS,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  {
    icon: FileText,
    label: "Media Plans",
    href: Routes.MEDIA_PLANNING,
    color:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
  },
];

// ── Stacked Card Carousel ──────────────────────────────────

const SWIPE_THRESHOLD = 50;
const CARD_HEIGHT = 170;
const STACK_OFFSET = 18;
const SCALE_STEP = 0.05;

function CardCarousel({ cards }: { cards: DashCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = (_: any, panInfo: PanInfo) => {
    setDragging(false);
    if (panInfo.offset.x < -SWIPE_THRESHOLD) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    } else if (panInfo.offset.x > SWIPE_THRESHOLD) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  const sortedIndices = cards
    .map((_, i) => i)
    .sort((a, b) => {
      const offsetA = Math.abs(a - activeIndex);
      const offsetB = Math.abs(b - activeIndex);
      return offsetB - offsetA;
    });

  const containerHeight = CARD_HEIGHT + STACK_OFFSET * 2 + 28;

  return (
    <div className="relative w-full" style={{ height: containerHeight }}>
      {sortedIndices.map((i) => {
        const card = cards[i];
        let offset = i - activeIndex;
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < -cards.length / 2) offset += cards.length;

        const isActive = offset === 0;
        const absOffset = Math.abs(offset);

        if (absOffset > 2) return null;

        const CardIcon = card.icon;

        return (
          <motion.div
            key={card.label}
            className={`absolute left-0 right-0 mx-auto rounded-2xl bg-gradient-to-br ${card.gradient} text-white overflow-hidden`}
            style={{
              height: CARD_HEIGHT,
              cursor: isActive ? "grab" : "pointer",
              touchAction: isActive ? "pan-y" : "auto",
            }}
            animate={{
              y: absOffset * STACK_OFFSET,
              scale: 1 - absOffset * SCALE_STEP,
              zIndex: cards.length - absOffset,
              opacity: 1 - absOffset * 0.2,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            drag={isActive ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setDragging(true)}
            onDragEnd={isActive ? handleDragEnd : undefined}
            onTap={() => {
              if (!isActive && !dragging) setActiveIndex(i);
            }}
          >
            {/* Background glow icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.08]">
              <CardIcon size={120} strokeWidth={1} />
            </div>

            {/* Card content */}
            <motion.div
              className="p-6 h-full flex flex-col justify-between relative z-10"
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <CardIcon size={16} />
                  </div>
                  <p className="text-sm font-medium text-white/80">
                    {card.label}
                  </p>
                </div>
                <p className="text-4xl font-bold mt-3 tracking-tight">
                  {card.value}
                </p>
              </div>
              <p className="text-xs text-white/60">{card.subtitle}</p>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Dot indicators */}
      <div
        className="absolute left-0 right-0 flex justify-center gap-2"
        style={{ bottom: 0 }}
      >
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 h-2 bg-purple-500 dark:bg-purple-400"
                : "w-2 h-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Quick Access Grid ──────────────────────────────────────

function QuickAccess() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {quickActions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="flex flex-col items-center gap-2 py-1 active:scale-95 transition-transform"
        >
          <div className={`p-3.5 rounded-xl ${action.color}`}>
            <action.icon size={22} />
          </div>
          <span className="text-xs text-muted-foreground text-center leading-tight">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

// ── AI Insights Compact ────────────────────────────────────

const insights = [
  {
    title: "Optimization Tip",
    body: "High engagement on Instagram — consider increasing budget by 15%.",
  },
  {
    title: "Content Idea",
    body: "Short-form video under 30s with product demos boosts conversions.",
  },
  {
    title: "Budget Alert",
    body: "TV ad campaign is 5% over budget. Review media placements.",
  },
];

function AiInsightsCarousel() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="bg-card rounded-2xl p-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
          <Sparkles size={14} className="text-purple-600 dark:text-purple-300" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
      </div>

      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
          {insights[current].title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {insights[current].body}
        </p>
      </motion.div>

      {/* Dots */}
      <div className="flex gap-1.5 mt-3">
        {insights.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-4 h-1.5 bg-purple-500 dark:bg-purple-400"
                : "w-1.5 h-1.5 bg-muted-foreground/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Recent Campaigns List ──────────────────────────────────

function RecentCampaignsList() {
  const { data: campaigns, isLoading } = useGetCampaigns();
  const allCampaigns = campaigns?.data?.campaigns;
  const recent = allCampaigns?.slice(-5).reverse();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[68px] rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!allCampaigns?.length) {
    return (
      <div className="flex flex-col items-center py-10 gap-3">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <Megaphone size={24} className="text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          No campaigns yet
        </p>
        <Link href={Routes.NEW_CAMPAIGN}>
          <div className="px-4 py-2 rounded-lg bg-[#A1238E] text-white text-xs font-medium active:scale-95 transition-transform">
            Create your first campaign
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent?.map((campaign: any) => {
        const Icon = campaignTypeIcon[campaign.campaignType] || FileText;
        const iconColor =
          campaignTypeColor[campaign.campaignType] ||
          "bg-muted text-muted-foreground";

        return (
          <Link
            key={campaign.id}
            href={`${Routes.CAMPAIGNS}/${campaign.id}`}
            className="flex items-center justify-between p-3 rounded-xl bg-card active:bg-muted/60 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {campaign.campaignName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {campaign.campaignType?.replace(/_/g, " ")} · ₦
                  {moneyFormat(campaign.budget)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <GetStatusBadge
                status={
                  campaign.adminApprovalStatus === "approved"
                    ? "active"
                    : campaign.adminApprovalStatus === "rejected"
                    ? "rejected"
                    : "pending"
                }
              />
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── Main Mobile Dashboard ──────────────────────────────────

interface MobileDashboardProps {
  userName: string;
  dashStats: any;
  isLoading: boolean;
}

export default function MobileDashboard({
  userName,
  dashStats,
  isLoading,
}: MobileDashboardProps) {
  const cards = buildCards(dashStats);
  const firstName = userName?.split(" ")[0] || "there";

  if (isLoading) {
    return (
      <div className="px-4 pt-2 pb-8 space-y-6">
        {/* Greeting skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-3 w-44 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
        </div>
        {/* Card skeleton */}
        <div className="h-[170px] bg-muted animate-pulse rounded-2xl" />
        {/* Quick access skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
                <div className="h-3 w-14 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* AI Insights skeleton */}
        <div className="h-28 bg-muted animate-pulse rounded-2xl" />
        {/* Recent campaigns skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[68px] bg-muted animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-8 space-y-8">
      {/* Greeting + Notification */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Hi, {firstName} 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Here&apos;s your campaign overview
          </p>
        </div>
        <div className="relative">
          <NotificationDialog />
        </div>
      </div>

      {/* Stacked Card Carousel */}
      <CardCarousel cards={cards} />

      {/* Quick Access */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Access
        </h2>
        <QuickAccess />
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          AI Insights
        </h2>
        <AiInsightsCarousel />
      </div>

      {/* Recent Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Campaigns
          </h2>
          <Link
            href={Routes.CAMPAIGNS}
            className="text-xs font-medium text-purple-600 dark:text-purple-400"
          >
            View all
          </Link>
        </div>
        <RecentCampaignsList />
      </div>
    </div>
  );
}
