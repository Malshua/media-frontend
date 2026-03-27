"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ConnectionMetrics {
  platform: string;
  platformMetricsData: {
    followers: number;
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    spend: number;
    conversions: number;
  } | null;
}

interface ChannelPerformanceChartProps {
  connections: ConnectionMetrics[];
}

const platformColors: Record<string, { bg: string; border: string }> = {
  facebook: { bg: "rgba(59, 130, 246, 0.7)", border: "#3B82F6" },
  instagram: { bg: "rgba(236, 72, 153, 0.7)", border: "#EC4899" },
  tiktok: { bg: "rgba(16, 185, 129, 0.7)", border: "#10B981" },
};

function formatNumber(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
  return String(value);
}

function ChannelPerformanceChart({ connections }: ChannelPerformanceChartProps) {
  const withMetrics = connections.filter(
    (c) =>
      c.platformMetricsData &&
      typeof c.platformMetricsData === "object" &&
      Object.keys(c.platformMetricsData).length > 0 &&
      ((c.platformMetricsData as any).impressions > 0 ||
        (c.platformMetricsData as any).reach > 0)
  );

  if (withMetrics.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 md:p-6 min-h-[250px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          No channel data available yet.
        </p>
      </div>
    );
  }

  const metricKeys = ["impressions", "reach", "engagement", "clicks"] as const;

  const data = {
    labels: metricKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: withMetrics.map((conn) => {
      const platform = conn.platform.toLowerCase();
      const colors = platformColors[platform] || {
        bg: "rgba(156,163,175,0.7)",
        border: "#9CA3AF",
      };
      return {
        label: conn.platform.charAt(0).toUpperCase() + conn.platform.slice(1),
        data: metricKeys.map(
          (k) => (conn.platformMetricsData as any)?.[k] ?? 0
        ),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 6,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
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
          label: (ctx: any) =>
            ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { color: "rgba(75,85,99,0.2)" },
        ticks: {
          color: "#9CA3AF",
          callback: (value: any) => formatNumber(value),
        },
      },
    },
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Channel Performance</h2>
      <div className="h-[280px] md:h-[320px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default ChannelPerformanceChart;
