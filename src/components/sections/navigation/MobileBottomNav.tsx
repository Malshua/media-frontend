"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@/utilities/routes";
import {
  LayoutDashboard,
  Megaphone,
  Plus,
  FileText,
  User,
} from "lucide-react";

const tabs = [
  { icon: LayoutDashboard, label: "Home", href: Routes.DASHBOARD },
  { icon: Megaphone, label: "Campaigns", href: Routes.CAMPAIGNS },
  { icon: Plus, label: "New", href: Routes.NEW_CAMPAIGN, isCenter: true },
  { icon: FileText, label: "Plans", href: Routes.MEDIA_PLANNING },
  { icon: User, label: "Profile", href: Routes.PROFILE },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border" />

      <div className="relative flex items-end justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          if (tab.isCenter) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="h-12 w-12 rounded-full bg-[#A1238E] flex items-center justify-center shadow-lg shadow-purple-500/25 active:scale-90 transition-transform">
                  <Plus size={24} className="text-white" />
                </div>
                <span className="text-[10px] mt-1 text-muted-foreground">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-1 min-w-[56px] active:scale-90 transition-transform"
            >
              <tab.icon
                size={22}
                className={
                  isActive
                    ? "text-[#A1238E] dark:text-purple-400"
                    : "text-muted-foreground"
                }
              />
              <span
                className={`text-[10px] ${
                  isActive
                    ? "text-[#A1238E] dark:text-purple-400 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
