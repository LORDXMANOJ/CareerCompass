"use client";

import React from "react";
import Link from "next/link";
import { DashboardReadiness } from "@/lib/dashboard-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { ShieldCheck, Target, ArrowUpRight, Award } from "lucide-react";

interface ReadinessCardProps {
  readiness: DashboardReadiness;
}

export function ReadinessCard({ readiness }: ReadinessCardProps) {
  const { theme } = useCompanionTheme();
  const { currentScore, targetScore, gap, statusLabel, summaryText, breakdowns } = readiness;

  // Circular progress calculations (Radius 64, circumference ~402)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div
      id="overview"
      className="p-6 sm:p-8 lg:p-9 rounded-3xl border transition-all duration-300 backdrop-blur-2xl relative overflow-hidden mb-8"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Subtle Ambient Backlight */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: theme.primary,
          opacity: theme.isLight ? 0.04 : 0.2,
        }}
      />

      {/* Header Section */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-7 border-b"
        style={{ borderColor: theme.borderSubtle }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="h-11 w-11 rounded-2xl border flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.primary,
            }}
          >
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block"
              style={{ color: theme.primary }}
            >
              Placement Readiness Index
            </span>
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Career Readiness Command Center
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
              Current Standing:
            </span>
            <span
              className="px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
                color: theme.primary,
              }}
            >
              {statusLabel}
            </span>
          </div>

          <Link
            href="/insights"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.primary,
            }}
          >
            <span>View Detailed Analysis</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Readiness Display & High-Impact Score Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
        {/* Progress Ring Graphic: High Impact Focal Point */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
              {/* Background ring track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={theme.isLight ? "#e2e8f0" : "rgba(30, 41, 59, 0.8)"}
                strokeWidth="12"
                className="fill-none"
              />
              {/* Animated Progress ring with companion theme colors */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#companionScoreGradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="fill-none transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="companionScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primary} />
                  <stop offset="60%" stopColor={theme.secondary} />
                  <stop offset="100%" stopColor={theme.accent} />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Text: High Legibility Typography */}
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className="text-5xl font-black font-mono tracking-tight leading-none"
                style={{ color: theme.text }}
              >
                {currentScore}%
              </span>
              <span
                className="text-[11px] uppercase font-extrabold tracking-widest mt-1.5"
                style={{ color: theme.primary }}
              >
                Placement Ready
              </span>
            </div>
          </div>

          <p className="text-xs font-medium mt-3" style={{ color: theme.textMuted }}>
            Calibrated against verified tier-1 benchmarks
          </p>
        </div>

        {/* Target, Gap, and Strategic Commentary */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div
              className="p-4 rounded-2xl border shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: theme.textMuted }}>
                <Target className="h-4 w-4 text-blue-500" />
                <span>Tier-1 Target</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono" style={{ color: theme.text }}>
                {targetScore}%
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: theme.textMuted }}>
                <ArrowUpRight className="h-4 w-4 text-amber-500" />
                <span>Preparation Gap</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono" style={{ color: theme.warning }}>
                {gap}%
              </div>
            </div>

            <div
              className="p-4 rounded-2xl border col-span-2 sm:col-span-1 shadow-sm transition-all"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: theme.textMuted }}>
                <Award className="h-4 w-4 text-emerald-500" />
                <span>Engine Model</span>
              </div>
              <div className="text-sm font-black truncate" style={{ color: theme.success }}>
                Deterministic v2.4
              </div>
            </div>
          </div>

          {/* Strategic Summary Box with Comfortable Reading Scale */}
          <div
            className="p-5 rounded-2xl border text-sm sm:text-base leading-relaxed font-medium transition-all"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.textSecondary,
            }}
          >
            {summaryText}
          </div>
        </div>
      </div>

      {/* 6-Factor Pillar Breakdown */}
      <div className="pt-6 border-t" style={{ borderColor: theme.borderSubtle }}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: theme.textMuted }}>
            Readiness Breakdown Across Core Pillars
          </span>
          <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
            6 Evaluated Dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {breakdowns.map((item) => {
            const barColor =
              item.status === "strong"
                ? "from-emerald-500 to-teal-400"
                : item.status === "adequate"
                ? "from-blue-500 to-indigo-400"
                : "from-amber-500 to-orange-400";

            const badgeStyle =
              item.status === "strong"
                ? {
                    color: theme.isLight ? "#047857" : "#34d399",
                    backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.12)" : "rgba(6, 78, 59, 0.4)",
                    borderColor: theme.isLight ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.3)",
                  }
                : item.status === "adequate"
                ? {
                    color: theme.isLight ? "#1d4ed8" : "#60a5fa",
                    backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(30, 58, 138, 0.4)",
                    borderColor: theme.isLight ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.3)",
                  }
                : {
                    color: theme.isLight ? "#b45309" : "#fbbf24",
                    backgroundColor: theme.isLight ? "rgba(245, 158, 11, 0.12)" : "rgba(120, 53, 15, 0.4)",
                    borderColor: theme.isLight ? "rgba(245, 158, 11, 0.25)" : "rgba(245, 158, 11, 0.3)",
                  };

            return (
              <div
                key={item.name}
                className="p-4 rounded-2xl border transition-colors space-y-2.5"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold truncate" style={{ color: theme.text }}>
                    {item.name}
                  </span>
                  <span className="text-sm font-black font-mono" style={{ color: theme.text }}>
                    {item.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: theme.isLight ? "#e2e8f0" : "rgba(30, 41, 59, 0.8)" }}
                >
                  <div
                    className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[11px]" style={{ color: theme.textMuted }}>
                    Weight: {item.weight}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md border text-[10px] uppercase font-mono font-bold"
                    style={badgeStyle}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
