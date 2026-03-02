"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AudienceDemographicsProps {
  connections: {
    platform: string;
    platformMetricsData: {
      followers: number;
    } | null;
  }[];
}

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const platformBgColors: Record<string, string> = {
  facebook: "rgba(59, 130, 246, 0.8)",
  instagram: "rgba(236, 72, 153, 0.8)",
  tiktok: "rgba(16, 185, 129, 0.8)",
};

const platformBorderColors: Record<string, string> = {
  facebook: "#3B82F6",
  instagram: "#EC4899",
  tiktok: "#10B981",
};

function AudienceDemographics({ connections }: AudienceDemographicsProps) {
  const withFollowers = connections.filter(
    (c) =>
      c.platformMetricsData &&
      typeof c.platformMetricsData === "object" &&
      Object.keys(c.platformMetricsData as any).length > 0 &&
      (c.platformMetricsData.followers > 0)
  );

  if (withFollowers.length === 0) {
    return (
      <div className="bg-card shadow-md rounded-xl p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No audience data available yet.
        </p>
      </div>
    );
  }

  const totalFollowers = withFollowers.reduce(
    (sum, c) => sum + (c.platformMetricsData?.followers ?? 0),
    0
  );

  const data = {
    labels: withFollowers.map(
      (c) => platformLabels[c.platform.toLowerCase()] || c.platform
    ),
    datasets: [
      {
        data: withFollowers.map((c) => c.platformMetricsData?.followers ?? 0),
        backgroundColor: withFollowers.map(
          (c) =>
            platformBgColors[c.platform.toLowerCase()] ||
            "rgba(156,163,175,0.8)"
        ),
        borderColor: withFollowers.map(
          (c) =>
            platformBorderColors[c.platform.toLowerCase()] || "#9CA3AF"
        ),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9CA3AF",
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed;
            const pct = ((val / totalFollowers) * 100).toFixed(1);
            return ` ${ctx.label}: ${val >= 1000 ? (val / 1000).toFixed(1) + "K" : val} followers (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-card shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-2">Audience Distribution</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Total followers:{" "}
        <span className="font-medium text-foreground">
          {totalFollowers >= 1000
            ? (totalFollowers / 1000).toFixed(1) + "K"
            : totalFollowers}
        </span>
      </p>
      <div className="h-[260px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>

      {/* Breakdown list */}
      <div className="mt-4 space-y-2">
        {withFollowers.map((c) => {
          const platform = c.platform.toLowerCase();
          const followers = c.platformMetricsData?.followers ?? 0;
          const pct = ((followers / totalFollowers) * 100).toFixed(1);
          return (
            <div key={c.platform} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      platformBorderColors[platform] || "#9CA3AF",
                  }}
                />
                <span className="text-muted-foreground">
                  {platformLabels[platform] || c.platform}
                </span>
              </div>
              <span className="font-medium">
                {followers >= 1000
                  ? (followers / 1000).toFixed(1) + "K"
                  : followers}{" "}
                <span className="text-muted-foreground text-xs">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AudienceDemographics;
