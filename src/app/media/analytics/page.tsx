"use client";
import { SelectDropdown } from "@/components/elements";
import React from "react";

const stats = [
  {
    title: "Total Impressions",
    value: "2.4M",
    change: "↑ 12% vs. previous period",
    changeColor: "text-green-500",
  },
  {
    title: "Engagements",
    value: "342K",
    change: "↑ 8% vs. previous period",
    changeColor: "text-green-500",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "↓ 1% vs. previous period",
    changeColor: "text-red-500",
  },
  {
    title: "ROI",
    value: "245%",
    change: "↑ 15% vs. previous period",
    changeColor: "text-green-500",
  },
];

const progressData = [
  { label: "Website Traffic", current: 80000, goal: 100000, unit: "visitors" },
  { label: "Lead Generation", current: 2400, goal: 3000, unit: "leads" },
  {
    label: "Social Media Engagement",
    current: 45000,
    goal: 50000,
    unit: "engagements",
  },
  { label: "Budget Utilization", current: 18500, goal: 24500, unit: "$" },
];

const Analytics = () => {
  return (
    <div className="p-5 md:p-8 bg-[#f5f8fc] text-gray-800">
      <div className="flex flex-col md:flex-row gap-5  md:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Campaign Analytics</h1>
          <p className="font-medium text-sm">
            Monitor performance and gain insights from your campaigns.
          </p>
        </div>
        <div className="w-60">
          <SelectDropdown
            options={[
              { label: "All Campaigns", value: "all campaigns" },
              {
                label: "Summer Product Launch",
                value: "summer product launch",
              },
              {
                label: "Holiday Special",
                value: "holiday special",
              },
              {
                label: "Brand Awareness",
                value: "brand awareness",
              },
            ]}
          />
          <SelectDropdown
            options={[
              { label: "Last 7 days", value: "last 7 days" },
              { label: "Last 30 days", value: "last 30 days" },
              { label: "Last 90 days", value: "last 90 days" },
              {
                label: "Custom Range",
                value: "custom range",
              },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md p-6 flex flex-col items-center"
          >
            <div className="text-gray-600 text-sm mb-2">{stat.title}</div>
            <div className="text-blue-600 text-2xl font-bold">{stat.value}</div>
            <div className={`text-sm mt-2 ${stat.changeColor}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-screen space-y-6 mt-10">
        {/* Performance Overview */}
        <div className="bg-white shadow-md rounded-xl p-6 min-h-[300px]">
          <h2 className="text-lg font-semibold mb-2">Performance Overview</h2>
          <p className="text-gray-500 text-center mt-20">
            Performance chart will be displayed here.
          </p>
        </div>

        {/* Channel + Audience Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 min-h-[300px]">
            <h2 className="text-lg font-semibold mb-2">Channel Performance</h2>
            <p className="text-gray-500 text-center mt-20">
              Channel performance chart will be displayed here.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 min-h-[300px]">
            <h2 className="text-lg font-semibold mb-2">
              Audience Demographics
            </h2>
            <p className="text-gray-500 text-center mt-20">
              Demographics chart will be displayed here.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Campaign Goals Progress
          </h2>
          {progressData.map((item, index) => {
            const percent = (item.current / item.goal) * 100;
            return (
              <div key={index} className="mb-5">
                <div className="flex justify-between text-xs md:text-sm text-gray-700 mb-1">
                  <span>{item.label}</span>
                  <span className="">
                    {item.unit === "$"
                      ? `$${item.current.toLocaleString()} / $${item.goal.toLocaleString()}`
                      : `${item.current.toLocaleString()} / ${item.goal.toLocaleString()} ${
                          item.unit
                        }`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white py-5 shadow-md rounded-lg px-5 md:px-10">
          <div className=" mb-5">
            <h1 className="font-semibold md:text-lg text-gray-700">
              AI-Generated Recommendations
            </h1>
          </div>
          <div className="text-gray-700 text-sm md:text-base space-y-2.5">
            <p>
              <span className="font-bold">Insight:</span> Your audience
              engagement is highest between 6-8 PM on weekdays. Consider
              scheduling more content during these peak hours.
            </p>
            <p>
              <span className="font-bold">Insight:</span> Video content is
              outperforming image posts by 43%. Allocate more resources to video
              production for higher engagement.
            </p>
            <p>
              <span className="font-bold">Insight:</span> Mobile users account
              for 78% of all campaign interactions. Ensure all landing pages are
              optimized for mobile experience.
            </p>
            <p>
              <span className="font-bold">Insight:</span> Based on current
              performance, increasing Facebook ad spend by 20% could yield a 35%
              increase in conversions based on historical data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
