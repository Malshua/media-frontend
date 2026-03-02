"use client";

import {
  SocialConnections,
  PerformanceChart,
  ChannelPerformanceChart,
  AudienceDemographics,
  StatsCards,
  CampaignGoals,
} from "@/components/sections/analytics";
import { useGetSocialMetrics, useSeedMockMetrics, useGetRecommendations } from "@/hooks/socialHooks";
import React, { Suspense } from "react";
import { Database, RefreshCw, AlertCircle, Sparkles, BarChart3, DollarSign, Users, FileText, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const typeIcons: Record<string, React.ReactNode> = {
  performance: <BarChart3 className="w-5 h-5 text-blue-500" />,
  budget: <DollarSign className="w-5 h-5 text-green-500" />,
  audience: <Users className="w-5 h-5 text-purple-500" />,
  content: <FileText className="w-5 h-5 text-amber-500" />,
  timing: <Clock className="w-5 h-5 text-pink-500" />,
  info: <Sparkles className="w-5 h-5 text-muted-foreground" />,
};

const Analytics = () => {
  const { data: metricsData, isLoading, error } = useGetSocialMetrics();
  const seedMock = useSeedMockMetrics();
  const { data: recsData, isLoading: recsLoading, isFetching: recsFetching } = useGetRecommendations();
  const queryClient = useQueryClient();

  const connections = metricsData?.data?.data?.connections ?? [];
  const aggregated = metricsData?.data?.data?.aggregated ?? null;
  const recommendations = recsData?.data?.data?.recommendations ?? [];
  const recsGeneratedAt = recsData?.data?.data?.generatedAt ?? null;

  const hasMetrics = connections.some(
    (c: any) =>
      c.platformMetricsData &&
      typeof c.platformMetricsData === 'object' &&
      Object.keys(c.platformMetricsData).length > 0 &&
      (c.platformMetricsData.impressions > 0 || c.platformMetricsData.reach > 0 || c.platformMetricsData.engagement > 0)
  );
  const hasConnections = connections.length > 0;

  return (
    <div className="p-5 md:p-8 bg-muted/50 text-foreground">
      {/* Connected Social Accounts */}
      <Suspense fallback={null}>
        <SocialConnections />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between mt-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Campaign Analytics</h1>
          <p className="font-medium text-sm text-muted-foreground">
            Monitor performance and gain insights from your campaigns.
          </p>
        </div>

        {/* Seed mock data button — visible when connections exist but no metrics */}
        {hasConnections && !hasMetrics && !isLoading && (
          <button
            onClick={() => seedMock.mutate()}
            disabled={seedMock.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {seedMock.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {seedMock.isPending ? "Seeding..." : "Load Demo Metrics"}
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-6 flex items-center gap-3 bg-destructive/10 text-destructive rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load metrics. Please try again later.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mt-8">
        <StatsCards aggregated={aggregated} />
      </div>

      {/* Charts */}
      <div className="space-y-6 mt-8">
        {/* Performance Overview Line Chart */}
        <PerformanceChart monthlyTrend={aggregated?.monthlyTrend ?? []} />

        {/* Channel Performance + Audience Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChannelPerformanceChart connections={connections} />
          <AudienceDemographics connections={connections} />
        </div>

        {/* Campaign Goals */}
        <CampaignGoals aggregated={aggregated} />

        {/* AI Recommendations — GPT-4 powered */}
        <div className="bg-card py-5 shadow-md rounded-lg px-5 md:px-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="font-semibold md:text-lg text-foreground">
                AI-Generated Recommendations
              </h1>
            </div>
            {hasMetrics && (
              <button
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["social-recommendations"],
                  })
                }
                disabled={recsFetching}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg border border-border hover:border-primary/30"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${recsFetching ? "animate-spin" : ""}`}
                />
                {recsFetching ? "Analyzing..." : "Refresh"}
              </button>
            )}
          </div>

          {recsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-5 h-5 rounded-full bg-muted flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {typeIcons[rec.type] || typeIcons.info}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {rec.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {rec.body}
                    </p>
                  </div>
                </div>
              ))}
              {recsGeneratedAt && (
                <p className="text-xs text-muted-foreground text-right mt-2">
                  Generated{" "}
                  {new Date(recsGeneratedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-4">
              Connect social accounts and load metrics to see AI-generated
              recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
