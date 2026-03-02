"use client";

import React from "react";

interface GoalItem {
  label: string;
  current: number;
  target: number;
  color: string;
}

interface CampaignGoalsProps {
  aggregated: {
    totalImpressions: number;
    totalReach: number;
    totalEngagement: number;
    totalClicks: number;
    totalConversions: number;
  } | null;
}

function CampaignGoals({ aggregated }: CampaignGoalsProps) {
  if (!aggregated) {
    return (
      <div className="bg-card shadow-md rounded-xl p-6 min-h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading goals...</p>
      </div>
    );
  }

  // Dynamic goals based on actual metrics — targets are set as achievable stretch goals
  const goals: GoalItem[] = [
    {
      label: "Impressions",
      current: aggregated.totalImpressions,
      target: Math.max(aggregated.totalImpressions * 1.5, 500_000),
      color: "#3B82F6",
    },
    {
      label: "Reach",
      current: aggregated.totalReach,
      target: Math.max(aggregated.totalReach * 1.5, 250_000),
      color: "#A855F7",
    },
    {
      label: "Engagement",
      current: aggregated.totalEngagement,
      target: Math.max(aggregated.totalEngagement * 1.5, 50_000),
      color: "#10B981",
    },
    {
      label: "Clicks",
      current: aggregated.totalClicks,
      target: Math.max(aggregated.totalClicks * 1.5, 20_000),
      color: "#F59E0B",
    },
    {
      label: "Conversions",
      current: aggregated.totalConversions,
      target: Math.max(aggregated.totalConversions * 1.5, 1_000),
      color: "#EF4444",
    },
  ];

  function formatNumber(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return String(Math.round(value));
  }

  return (
    <div className="bg-card shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Campaign Goals</h2>
      <div className="space-y-4">
        {goals.map((goal) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">
                  {goal.label}
                </span>
                <span className="text-xs font-medium">
                  {formatNumber(goal.current)} / {formatNumber(goal.target)}{" "}
                  <span className="text-muted-foreground">
                    ({pct.toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CampaignGoals;
