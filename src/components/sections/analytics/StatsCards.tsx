"use client";

import React from "react";
import { Eye, Users, MousePointerClick, TrendingUp, DollarSign, Target } from "lucide-react";

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
    label: "Total Impressions",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    key: "totalReach" as const,
    label: "Total Reach",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    key: "totalEngagement" as const,
    label: "Engagement",
    icon: MousePointerClick,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    key: "totalClicks" as const,
    label: "Total Clicks",
    icon: TrendingUp,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    key: "totalSpend" as const,
    label: "Total Spend",
    icon: DollarSign,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    prefix: "$",
  },
  {
    key: "roi" as const,
    label: "ROI",
    icon: Target,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    suffix: "%",
  },
];

function StatsCards({ aggregated }: StatsCardsProps) {
  const isEmpty = !aggregated || (
    aggregated.totalImpressions === 0 &&
    aggregated.totalReach === 0 &&
    aggregated.totalEngagement === 0 &&
    aggregated.totalClicks === 0
  );

  if (!aggregated || isEmpty) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statConfig.map((s) => (
          <div
            key={s.key}
            className="bg-card shadow-md rounded-xl p-4 animate-pulse"
          >
            <div className="h-4 w-20 bg-muted rounded mb-3" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statConfig.map((s) => {
        const Icon = s.icon;
        const raw = aggregated[s.key];
        const display = s.prefix
          ? `${s.prefix}${formatNumber(raw)}`
          : s.suffix
          ? `${formatNumber(raw)}${s.suffix}`
          : formatNumber(raw);

        return (
          <div
            key={s.key}
            className="bg-card shadow-md rounded-xl p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2">
              <div className={`${s.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold">{display}</p>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;
