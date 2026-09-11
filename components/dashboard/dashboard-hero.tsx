"use client";

import React, { useMemo } from "react";
import { Sparkles, Briefcase, Building2, GraduationCap } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface DashboardHeroProps {
  userName?: string;
  targetRole: string;
  targetCompanies: string[];
  graduationYear: string;
}

export function DashboardHero({
  userName,
  targetRole,
  targetCompanies,
  graduationYear,
}: DashboardHeroProps) {
  const { theme } = useCompanionTheme();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon";
    else if (hour >= 17) timeGreeting = "Good evening";

    if (userName && userName.trim()) {
      return `${timeGreeting}, ${userName.split(" ")[0]}`;
    }
    return "Welcome back";
  }, [userName]);

  const companiesLabel = useMemo(() => {
    if (!targetCompanies || targetCompanies.length === 0) return "Google · Microsoft · Amazon";
    return targetCompanies.slice(0, 4).join(" · ");
  }, [targetCompanies]);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-7 sm:p-10 backdrop-blur-xl mb-8 sm:mb-10 transition-all duration-300"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Dynamic theme ambient glow - subtle in light mode, atmospheric in dark mode */}
      <div
        className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: theme.primary,
          opacity: theme.isLight ? 0.04 : 0.22,
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: theme.accent,
          opacity: theme.isLight ? 0.03 : 0.12,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-3.5 shadow-sm"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.textAccent,
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: theme.primary }} />
            <span>AI Career Operating System</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight mb-2.5"
            style={{ color: theme.text }}
          >
            {greeting}
          </h1>

          <p
            className="text-base sm:text-lg font-medium max-w-2xl leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            Let&apos;s accelerate your journey to your dream role with personalized milestones.
          </p>

          {/* Quick Context Chips */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <Briefcase className="h-4 w-4" style={{ color: theme.primary }} />
              <span style={{ color: theme.textMuted }}>Target Role:</span>
              <strong className="font-bold" style={{ color: theme.text }}>
                {targetRole || "Software Engineer"}
              </strong>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <Building2 className="h-4 w-4" style={{ color: theme.secondary }} />
              <span style={{ color: theme.textMuted }}>Dream Companies:</span>
              <strong className="font-bold" style={{ color: theme.text }}>
                {companiesLabel}
              </strong>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <GraduationCap className="h-4 w-4" style={{ color: theme.success }} />
              <span style={{ color: theme.textMuted }}>Graduation:</span>
              <strong className="font-bold" style={{ color: theme.text }}>
                {graduationYear || "2027"}
              </strong>
            </div>
          </div>
        </div>

        {/* Live Status Tag */}
        <div className="shrink-0">
          <div
            className="px-5 py-4 rounded-2xl border text-center shadow-md backdrop-blur-md"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span
                className="h-2 w-2 rounded-full animate-ping"
                style={{ backgroundColor: theme.success }}
              />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.textMuted }}
              >
                Placement Engine
              </span>
            </div>
            <div className="text-sm font-extrabold" style={{ color: theme.text }}>
              Active & Calibrated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
