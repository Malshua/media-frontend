"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendEntry {
  month: string;
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
}

interface PerformanceChartProps {
  monthlyTrend: TrendEntry[];
}

function PerformanceChart({ monthlyTrend }: PerformanceChartProps) {
  if (!monthlyTrend || monthlyTrend.length === 0) {
    return (
      <div className="bg-card shadow-md rounded-xl p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          No performance data available. Connect a social account and seed metrics to see trends.
        </p>
      </div>
    );
  }

  const labels = monthlyTrend.map((t) => t.month);

  const data = {
    labels,
    datasets: [
      {
        label: "Impressions",
        data: monthlyTrend.map((t) => t.impressions),
        borderColor: "#A1238E",
        backgroundColor: "rgba(161, 35, 142, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Reach",
        data: monthlyTrend.map((t) => t.reach),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Engagement",
        data: monthlyTrend.map((t) => t.engagement),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Clicks",
        data: monthlyTrend.map((t) => t.clicks),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
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
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed.y;
            return ` ${ctx.dataset.label}: ${val >= 1000 ? (val / 1000).toFixed(1) + "K" : val}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(75,85,99,0.2)" },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { color: "rgba(75,85,99,0.2)" },
        ticks: {
          color: "#9CA3AF",
          callback: (value: any) =>
            value >= 1000000
              ? (value / 1000000).toFixed(1) + "M"
              : value >= 1000
              ? (value / 1000).toFixed(0) + "K"
              : value,
        },
      },
    },
  };

  return (
    <div className="bg-card shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
      <div className="h-[320px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default PerformanceChart;
