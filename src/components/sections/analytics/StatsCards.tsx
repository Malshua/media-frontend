"use client";

import React from "react";
import {
  Eye,
  Users,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

interface AggregatedMetrics {
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  totalSpend: number;
  totalConversions: number;
  conversionRate: number;
  roi: number;
}

interface StatsCardsProps {
  aggregated: AggregatedMetrics | null;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return String(Math.round(value));
}

const statConfig = [
  {
    key: "totalImpressions" as const,
    label: "Impressions",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    gradient: "from-blue-500/5 to-blue-500/0",
  },
  {
    key: "totalReach" as const,
    label: "Reach",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
    gradient: "from-purple-500/5 to-purple-500/0",
  },
  {
    key: "totalEngagement" as const,
    label: "Engagement",
    icon: MousePointerClick,
    color: "text-green-500",
    bgColor: "bg-green-500/10 dark:bg-green-500/20",
    gradient: "from-green-500/5 to-green-500/0",
  },
  {
    key: "totalClicks" as const,
    label: "Clicks",
    icon: TrendingUp,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    gradient: "from-amber-500/5 to-amber-500/0",
  },
  {
    key: "totalSpend" as const,
    label: "Spend",
    icon: DollarSign,
    color: "text-red-500",
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    gradient: "from-red-500/5 to-red-500/0",
    prefix: "$",
  },
  {
    key: "roi" as const,
    label: "ROI",
    icon: Target,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    gradient: "from-emerald-500/5 to-emerald-500/0",
    suffix: "%",
  },
];

function StatsCards({ aggregated }: StatsCardsProps) {
  const isEmpty =
    !aggregated ||
    (aggregated.totalImpressions === 0 &&
      aggregated.totalReach === 0 &&
      aggregated.totalEngagement === 0 &&
      aggregated.totalClicks === 0);

  if (!aggregated || isEmpty) {
    return (
      <>
        {/* Mobile: horizontal scroll skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:hidden">
          {statConfig.map((s) => (
            <div
              key={s.key}
              className="bg-card rounded-2xl p-4 min-w-[140px] animate-pulse shrink-0"
            >
              <div className="h-8 w-8 bg-muted rounded-lg mb-3" />
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-6 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
        {/* Desktop: grid skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statConfig.map((s) => (
            <div
              key={s.key}
              className="bg-card rounded-2xl p-4 animate-pulse"
            >
              <div className="h-8 w-8 bg-muted rounded-lg mb-3" />
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-6 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </>
    );
  }

  const cards = statConfig.map((s, i) => {
    const Icon = s.icon;
    const raw = aggregated[s.key];
    const display = s.prefix
      ? `${s.prefix}${formatNumber(raw)}`
      : s.suffix
      ? `${formatNumber(raw)}${s.suffix}`
      : formatNumber(raw);

    return (
      <motion.div
        key={s.key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="bg-card rounded-2xl p-4 min-w-[140px] shrink-0 bg-gradient-to-b"
      >
        <div className={`${s.bgColor} h-8 w-8 rounded-lg flex items-center justify-center mb-3`}>
          <Icon className={`w-4 h-4 ${s.color}`} />
        </div>
        <p className="text-xs text-muted-foreground">{s.label}</p>
        <p className="text-xl font-bold text-foreground mt-0.5">{display}</p>
      </motion.div>
    );
  });

  return (
    <>
      {/* Mobile: horizontal snap scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:hidden">
        {cards}
      </div>
      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards}
      </div>
    </>
  );
}

export default StatsCards;
