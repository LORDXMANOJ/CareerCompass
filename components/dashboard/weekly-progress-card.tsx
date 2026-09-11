"use client";

import React from "react";
import { Activity, Calendar, Info } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

import { UserActivity } from "@/types";

interface WeeklyProgressCardProps {
  userActivity?: UserActivity;
  verifiedSkillsCount?: number;
  totalSkillsCount?: number;
}

export function WeeklyProgressCard({
  userActivity,
  verifiedSkillsCount = 0,
  totalSkillsCount = 5,
}: WeeklyProgressCardProps) {
  const { theme } = useCompanionTheme();

  return (
    <div
      className="p-7 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 30px ${theme.glow}`,
      }}
    >
      <div>
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 pb-5 mb-5 border-b"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl border flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
                color: theme.primary,
              }}
            >
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.primary }}
              >
                Consistency Tracker
              </span>
              <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>Weekly Activity</h3>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.textSecondary,
            }}
          >
            <Calendar className="h-3.5 w-3.5" style={{ color: theme.textMuted }} />
            <span>Current Week</span>
          </div>
        </div>

        {/* Weekly Targets & Metrics */}
        <div className="grid grid-cols-2 gap-3.5 mb-5">
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="text-xs uppercase font-bold" style={{ color: theme.textMuted }}>DSA Target</span>
            <div className="text-xl font-black font-mono mt-1" style={{ color: theme.text }}>
              {userActivity?.dsaSolvedCount ?? 0} / 20
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>Problems this week</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="text-xs uppercase font-bold" style={{ color: theme.textMuted }}>Missions</span>
            <div className="text-xl font-black font-mono mt-1" style={{ color: theme.text }}>
              {userActivity?.weeklyMissionsCompleted ?? 0} / 7
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>Completed daily</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="text-xs uppercase font-bold" style={{ color: theme.textMuted }}>Project Tasks</span>
            <div className="text-xl font-black font-mono mt-1" style={{ color: theme.text }}>
              {userActivity?.completedTaskIds?.length ?? 0} Tasks
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>Completed milestones</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="text-xs uppercase font-bold" style={{ color: theme.textMuted }}>Verified Skills</span>
            <div className="text-xl font-black font-mono mt-1" style={{ color: theme.text }}>
              {verifiedSkillsCount} / {totalSkillsCount}
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>Target checks</div>
          </div>
        </div>

        {/* Honest Zero-Fabrication Disclaimer */}
        <div
          className="p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3"
          style={{
            backgroundColor: theme.primarySoft,
            borderColor: theme.borderHighlight,
          }}
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
            Your real-time weekly activity and streak will record here automatically as you complete CareerCompass missions.
          </p>
        </div>
      </div>
    </div>
  );
}

