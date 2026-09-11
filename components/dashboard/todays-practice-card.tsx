"use client";

// =============================================================================
// CareerCompass — Today's Practice Dashboard Card
// =============================================================================
// Displays the student's adaptive daily practice budget, difficulty distribution,
// transparent daily score (or "No score yet"), 7-day consistency bar, and
// direct action link to /problems.
// =============================================================================

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Code2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import { OnboardingState } from "@/types";
import { useProblemTracker } from "@/lib/hooks/use-problem-tracker";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { computeAcademicMetrics } from "@/lib/academic-intelligence";
import { PROBLEMS_CATALOG } from "@/constants/problems-catalog";

interface TodaysPracticeCardProps {
  onboardingState: OnboardingState;
}

export function TodaysPracticeCard({ onboardingState }: TodaysPracticeCardProps) {
  const { theme } = useCompanionTheme();
  const userId = "current_user"; // Uses active profile session
  const tracker = useProblemTracker(userId);
  const { syncDailyPlan, isLoaded, getBudget, dailyPlan, attempts } = tracker;

  // Derive academic timeline for accurate semester display
  const academic = useMemo(
    () => computeAcademicMetrics(onboardingState.education),
    [onboardingState.education]
  );

  // Sync daily plan on mount or when onboardingState changes
  useEffect(() => {
    if (isLoaded) {
      syncDailyPlan(onboardingState);
    }
  }, [isLoaded, onboardingState, syncDailyPlan]);

  const plan = dailyPlan;
  const budget = useMemo(() => getBudget(onboardingState), [getBudget, onboardingState]);

  const recommendedCount = plan?.recommendedCount || budget.recommendedBudget;
  const completedCount = plan?.completedCount || 0;
  const solvedCount = plan?.solvedCount || 0;

  // Real difficulty counts solved today
  const { easySolved, mediumSolved, hardSolved } = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    const today = plan?.date;
    if (today && attempts.length > 0) {
      for (const att of attempts) {
        const attDate = att.createdAt.slice(0, 10);
        if (attDate === today && (att.status === "solved_independent" || att.status === "solved_with_help")) {
          const prob = PROBLEMS_CATALOG.find((p) => p.id === att.problemId);
          if (prob?.difficulty === "Hard") hard++;
          else if (prob?.difficulty === "Medium") medium++;
          else easy++;
        }
      }
    }
    return { easySolved: easy, mediumSolved: medium, hardSolved: hard };
  }, [plan?.date, attempts]);

  const easyTarget = plan?.easyTarget || budget.distribution.easy;
  const mediumTarget = plan?.mediumTarget || budget.distribution.medium;
  const hardTarget = plan?.hardTarget || budget.distribution.hard;

  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(1, recommendedCount)) * 100));
  const isTargetCompleted = completedCount >= recommendedCount;

  const remainingCount = plan?.remainingCount ?? Math.max(0, recommendedCount - completedCount);
  const nextProblem = plan?.nextRecommendedProblem;
  const focusTopic = plan?.focusTopic;

  return (
    <div
      className="p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Ambient background light */}
      <div
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: theme.primary,
          opacity: theme.isLight ? 0.04 : 0.2,
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center border shadow-md"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
              }}
            >
              <Code2 className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight" style={{ color: theme.text }}>
                  Today&apos;s Practice
                </h3>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderHighlight,
                    color: theme.primary,
                  }}
                >
                  Sem {academic.currentSemester}
                </span>
                {focusTopic && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                    Focus: {focusTopic}
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Personalized daily problem budget adapted to your semester &amp; readiness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isTargetCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Target Met</span>
              </span>
            ) : completedCount > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>In Progress</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-800 bg-slate-900/60">
                <span>Not Started</span>
              </span>
            )}
          </div>
        </div>

        {/* Practice Budget Progress Bar & Counts */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold flex items-center gap-2" style={{ color: theme.text }}>
              <Target className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>
                {completedCount} of {recommendedCount} completed
              </span>
              <span className="text-slate-400 font-normal">
                ({remainingCount} remaining)
              </span>
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: theme.primary }}>
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500 relative"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: theme.primary,
                boxShadow: `0 0 10px ${theme.glow}`,
              }}
            />
          </div>
        </div>

        {/* Next Recommended Problem Callout */}
        {nextProblem ? (
          <div
            className="p-3.5 rounded-2xl border flex flex-col gap-1.5"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.borderHighlight,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                Next Recommended Problem
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono">
                  {nextProblem.topic}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    nextProblem.difficulty === "Easy"
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : nextProblem.difficulty === "Medium"
                      ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/30"
                  }`}
                >
                  {nextProblem.difficulty}
                </span>
              </div>
            </div>
            <div className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>
              {nextProblem.title}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {plan?.nextProblemReason || `Recommended to strengthen your ${nextProblem.topic} fundamentals.`}
            </p>
          </div>
        ) : isTargetCompleted ? (
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300">
            Daily practice target complete. Explore more problems or review challenging topics in Problem Lab.
          </div>
        ) : null}

        {/* Difficulty Distribution Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Easy
            </div>
            <div className="text-sm font-black mt-0.5" style={{ color: theme.text }}>
              {easySolved} <span className="text-[11px] font-normal text-slate-400">/ {easyTarget}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Medium
            </div>
            <div className="text-sm font-black mt-0.5" style={{ color: theme.text }}>
              {mediumSolved} <span className="text-[11px] font-normal text-slate-400">/ {mediumTarget}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
            <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
              Hard
            </div>
            <div className="text-sm font-black mt-0.5" style={{ color: theme.text }}>
              {hardSolved} <span className="text-[11px] font-normal text-slate-400">/ {hardTarget}</span>
            </div>
          </div>
        </div>

        {/* Daily Practice Score & 7-Day Consistency Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Daily Score Section */}
          <div
            className="p-3.5 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" style={{ color: theme.primary }} />
              <span>Daily Practice Score</span>
            </div>

            <div className="my-2">
              {plan?.dailyScore !== null && plan?.dailyScore !== undefined && solvedCount > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black" style={{ color: theme.text }}>
                    {plan.dailyScore}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Deterministic Metric
                  </span>
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-400">
                  No score yet
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                    Solve 1+ problem today to calculate
                  </span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Weighted by completion, solve rate &amp; confidence.
            </div>
          </div>

          {/* 7-Day Consistency Mini Trend */}
          <div
            className="p-3.5 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" style={{ color: theme.primary }} />
                <span>7-Day Activity</span>
              </span>
              <span className="text-[10px] text-slate-400">Recent</span>
            </div>

            {/* 7-Day mini bars */}
            <div className="flex items-end justify-between gap-1.5 h-10 py-1">
              {tracker.sevenDayHistory.map((item) => {
                const dayLabel = new Date(item.date).toLocaleDateString("en-US", { weekday: "narrow" });
                const heightPercent = item.recommendedCount > 0
                  ? Math.min(100, Math.max(15, (item.solvedCount / item.recommendedCount) * 100))
                  : item.solvedCount > 0 ? 50 : 8;

                const isToday = item.date === plan?.date;

                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full rounded-md transition-all duration-300"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.solvedCount > 0
                          ? isToday ? theme.primary : "rgba(168, 85, 247, 0.5)"
                          : "rgba(51, 65, 85, 0.4)",
                      }}
                    />
                    <span className="text-[9px] font-mono text-slate-400">
                      {dayLabel}
                    </span>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-30 p-1.5 rounded-md bg-slate-900 border border-slate-700 text-[9px] font-mono text-slate-200 whitespace-nowrap shadow-lg">
                      {item.date}: {item.solvedCount} solved
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Real recorded days. Missing days remain unrecorded.
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-4 mt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10" style={{ borderColor: theme.borderSubtle }}>
        <Link
          href="/problems"
          className="py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all hover:bg-slate-800/40"
          style={{ borderColor: theme.borderHighlight, color: theme.text }}
        >
          <span>Open Problem Lab</span>
        </Link>
        <Link
          href="/problems?action=start"
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: theme.primary }}
        >
          <span>Start Practice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
