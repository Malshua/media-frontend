"use client";

import {
  SocialConnections,
  PerformanceChart,
  ChannelPerformanceChart,
  AudienceDemographics,
  StatsCards,
  CampaignGoals,
} from "@/components/sections/analytics";
import {
  useGetSocialMetrics,
  useSeedMockMetrics,
  useGetRecommendations,
} from "@/hooks/socialHooks";
import React, { Suspense, useState } from "react";
import {
  Database,
  RefreshCw,
  AlertCircle,
  Sparkles,
  BarChart3,
  DollarSign,
  Users,
  FileText,
  Clock,
  ChevronDown,
  Wifi,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<string, React.ReactNode> = {
  performance: <BarChart3 className="w-4 h-4 text-blue-500" />,
  budget: <DollarSign className="w-4 h-4 text-green-500" />,
  audience: <Users className="w-4 h-4 text-purple-500" />,
  content: <FileText className="w-4 h-4 text-amber-500" />,
  timing: <Clock className="w-4 h-4 text-pink-500" />,
  info: <Sparkles className="w-4 h-4 text-muted-foreground" />,
};

const Analytics = () => {
  const { data: metricsData, isLoading, error } = useGetSocialMetrics();
  const seedMock = useSeedMockMetrics();
  const {
    data: recsData,
    isLoading: recsLoading,
    isFetching: recsFetching,
  } = useGetRecommendations();
  const queryClient = useQueryClient();
  const [showConnections, setShowConnections] = useState(false);

  const connections = metricsData?.data?.data?.connections ?? [];
  const aggregated = metricsData?.data?.data?.aggregated ?? null;
  const recommendations = recsData?.data?.data?.recommendations ?? [];
  const recsGeneratedAt = recsData?.data?.data?.generatedAt ?? null;

  const hasMetrics = connections.some(
    (c: any) =>
      c.platformMetricsData &&
      typeof c.platformMetricsData === "object" &&
      Object.keys(c.platformMetricsData).length > 0 &&
      (c.platformMetricsData.impressions > 0 ||
        c.platformMetricsData.reach > 0 ||
        c.platformMetricsData.engagement > 0)
  );
  const hasConnections = connections.length > 0;
  const connectedCount = connections.filter(
    (c: any) => c.connectionStatus === "connected"
  ).length;

  return (
    <div className="px-4 md:px-8 pb-8 text-foreground space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Campaign performance & insights
            </p>
          </div>

          {hasConnections && !hasMetrics && !isLoading && (
            <button
              onClick={() => seedMock.mutate()}
              disabled={seedMock.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#A1238E] text-white text-xs font-medium active:scale-95 transition-transform disabled:opacity-50 shrink-0"
            >
              {seedMock.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5" />
              )}
              {seedMock.isPending ? "Loading..." : "Demo Data"}
            </button>
          )}
        </div>

        {/* Collapsible Social Connections Toggle */}
        <button
          onClick={() => setShowConnections(!showConnections)}
          className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card">
            <Wifi size={14} />
            <span>
              {connectedCount} account{connectedCount !== 1 ? "s" : ""} connected
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                showConnections ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Collapsible Social Connections */}
      <AnimatePresence>
        {showConnections && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <Suspense fallback={null}>
              <SocialConnections />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 text-destructive rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            Failed to load metrics. Please try again later.
          </p>
        </div>
      )}

      {/* Stats Cards — horizontal scroll on mobile */}
      <StatsCards aggregated={aggregated} />

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PerformanceChart monthlyTrend={aggregated?.monthlyTrend ?? []} />
      </motion.div>

      {/* Channel + Audience side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ChannelPerformanceChart connections={connections} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AudienceDemographics connections={connections} />
        </motion.div>
      </div>

      {/* Campaign Goals */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <CampaignGoals aggregated={aggregated} />
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Sparkles
                size={16}
                className="text-purple-600 dark:text-purple-300"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                AI Recommendations
              </h2>
              {recsGeneratedAt && (
                <p className="text-[10px] text-muted-foreground">
                  Updated{" "}
                  {new Date(recsGeneratedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
          {hasMetrics && (
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["social-recommendations"],
                })
              }
              disabled={recsFetching}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-90"
            >
              <RefreshCw
                size={16}
                className={recsFetching ? "animate-spin" : ""}
              />
            </button>
          )}
        </div>

        {recsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted animate-pulse"
              >
                <div className="w-8 h-8 rounded-lg bg-muted-foreground/10 shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-3.5 bg-muted-foreground/10 rounded w-1/3" />
                  <div className="h-3 bg-muted-foreground/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((rec: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {typeIcons[rec.type] || typeIcons.info}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {rec.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {rec.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles
              size={24}
              className="mx-auto text-muted-foreground mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Connect social accounts to see AI recommendations.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
