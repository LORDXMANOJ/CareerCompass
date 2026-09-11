"use client";

// =============================================================================
// CareerCompass — Problems Page View (Problem Lab)
// =============================================================================
// Full workspace: hero stats, recommendations, topic coverage grid, filterable
// catalog browser, attempt history, and cross-page connections to /skills and
// /roadmap.
// =============================================================================

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Filter,
  ExternalLink,
  CheckCircle2,
  Target,
  TrendingUp,
  Zap,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Route,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { OnboardingState } from "@/types";
import {
  CodingProblem,
  UserProblemAttempt,
  ProblemProvider,
  ATTEMPT_STATUS_LABELS,
  CONFIDENCE_LABELS,
  FRICTION_LABELS,
} from "@/types/problems";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { PROBLEMS_CATALOG, DSA_TOPICS } from "@/constants/problems-catalog";
import {
  computeProblemRecommendations,
  computeProblemStats,
  getTopicCoverage,
  getRoadmapPhaseForTopic,
} from "@/lib/problem-intelligence";
import { useProblemTracker } from "@/lib/hooks/use-problem-tracker";
import { ProblemRecommendationCard } from "@/components/problems/problem-recommendation-card";
import { ProblemLogModal } from "@/components/problems/problem-log-modal";
import Link from "next/link";

interface ProblemsPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
  userId: string;
}

type ActiveTab = "today" | "recommendations" | "topic_gaps" | "catalog" | "history";
type PlatformFilter = "all" | ProblemProvider;
type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";

export function ProblemsPageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
  userId,
}: ProblemsPageViewProps) {
  const { theme } = useCompanionTheme();
  const tracker = useProblemTracker(userId);
  const { syncDailyPlan, isLoaded } = tracker;

  // UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>("today");
  const [logModalProblem, setLogModalProblem] = useState<CodingProblem | null>(null);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Sync daily practice plan on mount / state change
  useEffect(() => {
    if (isLoaded) {
      syncDailyPlan(onboardingState);
    }
  }, [isLoaded, onboardingState, syncDailyPlan]);

  // Computed data
  const recommendations = useMemo(
    () => computeProblemRecommendations(onboardingState, tracker.solvedIds, PROBLEMS_CATALOG, 12, tracker.attempts),
    [onboardingState, tracker.solvedIds, tracker.attempts]
  );

  const stats = useMemo(
    () => computeProblemStats(tracker.attempts, PROBLEMS_CATALOG),
    [tracker.attempts]
  );

  const topicCoverage = useMemo(
    () => getTopicCoverage(tracker.attempts, PROBLEMS_CATALOG),
    [tracker.attempts]
  );

  // Daily Practice Plan items & status
  const plan = tracker.dailyPlan;
  const todaysProblems = useMemo(() => {
    if (!plan || !plan.problemIds) return [];
    const idSet = new Set(plan.problemIds);
    return PROBLEMS_CATALOG.filter((p) => idSet.has(p.id));
  }, [plan]);

  const { easySolved, mediumSolved, hardSolved } = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    const today = plan?.date;
    if (today && tracker.attempts.length > 0) {
      for (const att of tracker.attempts) {
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
  }, [plan?.date, tracker.attempts]);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    let result = [...PROBLEMS_CATALOG];

    if (platformFilter !== "all") {
      result = result.filter((p) => p.provider === platformFilter);
    }
    if (difficultyFilter !== "all") {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }
    if (topicFilter !== "all") {
      result = result.filter((p) => p.topic === topicFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.externalId.toLowerCase().includes(q)
      );
    }

    return result;
  }, [platformFilter, difficultyFilter, topicFilter, searchQuery]);

  // Available topics for filter (only topics that exist in catalog)
  const availableTopics = useMemo(() => {
    const topics = new Set(PROBLEMS_CATALOG.map((p) => p.topic));
    return DSA_TOPICS.filter((t) => topics.has(t));
  }, []);

  const handleLogAttempt = (attempt: UserProblemAttempt) => {
    tracker.logAttempt(attempt, onboardingState);
  };

  const historyToShow = showAllHistory ? tracker.attempts : tracker.attempts.slice(-8);
  const reversedHistory = [...historyToShow].reverse();

  // Tab buttons
  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: "today", label: "Today's Plan", icon: Target },
    { id: "recommendations", label: "Recommended", icon: Zap },
    { id: "topic_gaps", label: "Topic Gaps", icon: BarChart3 },
    { id: "catalog", label: "Full Catalog", icon: BookOpen },
    { id: "history", label: "History & Feedback", icon: Clock },
  ];

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Problem Lab"
      subtitle="Practice coding problems aligned with your skill gaps, target role, and dream companies. Log your solves and track topic coverage."
      badge="Coding Intelligence"
    >
      {/* ────────────────────────── Hero Stats Bar ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Total Solved", value: stats.totalSolved, icon: CheckCircle2, color: theme.success },
          { label: "Easy", value: stats.solvedByDifficulty.easy, icon: TrendingUp, color: theme.success },
          { label: "Medium", value: stats.solvedByDifficulty.medium, icon: Target, color: theme.warning },
          { label: "Hard", value: stats.solvedByDifficulty.hard, icon: Zap, color: theme.danger },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-4 flex items-center gap-3"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.borderSubtle,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black" style={{ color: theme.text }}>
                {stat.value}
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ────────────────────────── Tab Navigation ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 p-1 rounded-2xl border w-fit"
        style={{ backgroundColor: theme.surfaceMuted, borderColor: theme.borderSubtle }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: isActive ? theme.primary : "transparent",
                color: isActive ? "#ffffff" : theme.textSecondary,
                boxShadow: isActive ? (theme.isLight ? theme.shadowSm : `0 0 10px ${theme.glow}`) : "none",
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* ────────────────────── TODAY'S PRACTICE TAB ────────────────────── */}
      {activeTab === "today" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Today's Adaptive Practice Hero Summary */}
          <div
            className="rounded-3xl border p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    Adaptive Daily Practice
                  </span>
                  <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
                    Date: {plan?.date || "Today"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
                  Today&apos;s Practice Workload
                </h2>
                <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: theme.textSecondary }}>
                  Calibrated to your semester timeline, current DSA readiness, and target role requirements. Complete these problems to build consistent interview stamina.
                </p>
              </div>

              {/* Status Pill */}
              <div className="shrink-0">
                {(plan?.completedCount || 0) >= (plan?.recommendedCount || 8) ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Target Completed</span>
                  </span>
                ) : (plan?.completedCount || 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    <Clock className="w-4 h-4" />
                    <span>In Progress</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-800 bg-slate-900/60">
                    <span>Not Started Yet</span>
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar & Sub-Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5" style={{ color: theme.text }}>
                  <Target className="w-4 h-4" style={{ color: theme.primary }} />
                  <span>
                    {plan?.completedCount || 0} of {plan?.recommendedCount || 8} problems completed
                  </span>
                </span>
                <span className="font-mono text-xs font-bold" style={{ color: theme.primary }}>
                  {Math.min(100, Math.round(((plan?.completedCount || 0) / Math.max(1, plan?.recommendedCount || 8)) * 100))}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round(((plan?.completedCount || 0) / Math.max(1, plan?.recommendedCount || 8)) * 100))}%`,
                    backgroundColor: theme.primary,
                    boxShadow: `0 0 12px ${theme.glow}`,
                  }}
                />
              </div>

              {/* Difficulty Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Easy Target
                  </div>
                  <div className="text-base font-black mt-0.5" style={{ color: theme.text }}>
                    {easySolved} <span className="text-xs font-normal text-slate-400">/ {plan?.easyTarget || 2}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Medium Target
                  </div>
                  <div className="text-base font-black mt-0.5" style={{ color: theme.text }}>
                    {mediumSolved} <span className="text-xs font-normal text-slate-400">/ {plan?.mediumTarget || 5}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                  <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                    Hard Target
                  </div>
                  <div className="text-base font-black mt-0.5" style={{ color: theme.text }}>
                    {hardSolved} <span className="text-xs font-normal text-slate-400">/ {plan?.hardTarget || 1}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                  <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                    Daily Score
                  </div>
                  <div className="text-base font-black mt-0.5" style={{ color: theme.text }}>
                    {plan?.dailyScore !== null && plan?.dailyScore !== undefined && (plan?.solvedCount || 0) > 0 ? (
                      `${plan.dailyScore}%`
                    ) : (
                      <span className="text-xs font-medium text-slate-400">No score yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Met Celebration Alert */}
            {(plan?.completedCount || 0) >= (plan?.recommendedCount || 8) && (
              <div
                className="p-4 rounded-2xl border flex items-center gap-3"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  borderColor: "rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs leading-relaxed text-emerald-300">
                  <span className="font-bold">Target completed!</span> You solved {plan?.completedCount} problems today (recommended target was {plan?.recommendedCount}). You are free to solve more problems — CareerCompass never hard-blocks your progress.
                </div>
              </div>
            )}
          </div>

          {/* Today's Problems Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: theme.text }}>
                Today&apos;s Curated Problem Set ({todaysProblems.length})
              </h3>
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                Target Role: {onboardingState.targetRole || "Software Engineer"}
              </span>
            </div>

            {todaysProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {todaysProblems.map((problem) => {
                  const isSolved = tracker.isAlreadySolved(problem.id);
                  const hasAttempt = tracker.hasAttempt(problem.id);
                  const diffColor =
                    problem.difficulty === "Easy" ? theme.success :
                    problem.difficulty === "Medium" ? theme.warning :
                    theme.danger;

                  return (
                    <div
                      key={problem.id}
                      className="rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: isSolved ? theme.success : theme.borderSubtle,
                        boxShadow: theme.isLight ? theme.shadowSm : undefined,
                      }}
                    >
                      <div>
                        {/* Top Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: `${diffColor}15`,
                                borderColor: `${diffColor}40`,
                                color: diffColor,
                              }}
                            >
                              {problem.difficulty}
                            </span>
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: theme.surfaceMuted,
                                color: theme.textMuted,
                              }}
                            >
                              {problem.provider === "leetcode" ? "LeetCode" : "Codeforces"}
                            </span>
                          </div>

                          {isSolved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Solved</span>
                            </span>
                          ) : hasAttempt ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Attempted</span>
                            </span>
                          ) : null}
                        </div>

                        {/* Title & Topic */}
                        <h4 className="text-sm font-bold leading-snug mb-1" style={{ color: theme.text }}>
                          {problem.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 my-2">
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: theme.primarySoft,
                              color: theme.primary,
                            }}
                          >
                            {problem.topic}
                          </span>
                          {problem.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: theme.surfaceMuted,
                                color: theme.textMuted,
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Company Tags */}
                        {problem.companyTags.length > 0 && (
                          <div className="text-[11px] text-slate-400 mb-3">
                            Asked at:{" "}
                            <span className="text-slate-300 font-medium">
                              {problem.companyTags.slice(0, 3).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: theme.borderSubtle }}>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: theme.surfaceMuted,
                            borderColor: theme.borderSubtle,
                            color: theme.textSecondary,
                          }}
                        >
                          <span>Solve</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setLogModalProblem(problem)}
                          className="py-1.5 px-3 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
                          style={{
                            backgroundColor: isSolved ? "rgba(16, 185, 129, 0.8)" : theme.primary,
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isSolved ? "Update Solve" : "I Solved This"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
              >
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: theme.success }} />
                <p className="text-sm font-bold" style={{ color: theme.text }}>
                  No pending problems for today!
                </p>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                  Explore the full catalog or check recommended problems.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ────────────────────── RECOMMENDATIONS TAB ────────────────────── */}
      {activeTab === "recommendations" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Recommendation Cards */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
              Recommended For You
            </h2>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <ProblemRecommendationCard
                    key={rec.problem.id}
                    recommendation={rec}
                    isSolved={tracker.isAlreadySolved(rec.problem.id)}
                    onLogSolve={() => setLogModalProblem(rec.problem)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
              >
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: theme.success }} />
                <p className="text-sm font-bold" style={{ color: theme.text }}>
                  All recommended problems completed!
                </p>
                <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                  Explore the full catalog for more practice.
                </p>
              </div>
            )}
          </div>

          {/* Topic Coverage Grid */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.text }}>
              Topic Coverage
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {topicCoverage.map((tc) => {
                const coverageColor =
                  tc.coveragePercent >= 75 ? theme.success :
                  tc.coveragePercent >= 40 ? theme.warning :
                  tc.coveragePercent > 0 ? theme.primary :
                  theme.textMuted;

                return (
                  <button
                    key={tc.topic}
                    onClick={() => {
                      setActiveTab("catalog");
                      setTopicFilter(tc.topic);
                    }}
                    className="rounded-xl border p-3 text-left transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold truncate" style={{ color: theme.text }}>
                        {tc.topic}
                      </span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: coverageColor }}>
                        {tc.coveragePercent}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.surfaceMuted }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${tc.coveragePercent}%`,
                          backgroundColor: coverageColor,
                        }}
                      />
                    </div>
                    <div className="text-[9px] font-medium mt-1" style={{ color: theme.textMuted }}>
                      {tc.solvedCount}/{tc.totalProblems} solved
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cross-page connections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skills Connection */}
            <Link
              href="/skills"
              className="rounded-2xl border p-5 flex items-center gap-4 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.borderSubtle,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
              >
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                  Skill Gap Analysis
                </h3>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  Problems here are matched to your verified skill gaps. View full gap matrix.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: theme.textMuted }} />
            </Link>

            {/* Roadmap Connection */}
            <Link
              href="/roadmap"
              className="rounded-2xl border p-5 flex items-center gap-4 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.borderSubtle,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
              >
                <Route className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                  Career Roadmap
                </h3>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  Problem practice feeds directly into your roadmap DSA milestones.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" style={{ color: theme.textMuted }} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ────────────────────── TOPIC GAPS TAB ────────────────────── */}
      {activeTab === "topic_gaps" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Adaptive Mastery Executive Summary */}
          <div
            className="rounded-3xl border p-6 sm:p-7 space-y-5 relative overflow-hidden shadow-xl"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    Topic Gap Engine
                  </span>
                  <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
                    Deterministic Competence Model
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
                  DSA Topic Competence &amp; Friction Analysis
                </h2>
                <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: theme.textSecondary }}>
                  Competence is calculated strictly from authentic solve attempts, self-reported confidence, and recorded friction. Conservative thresholds ensure mastery is earned, not assumed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                  Focus: {tracker.adaptiveProfile.recommendedFocusTopic}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Target Tier: {tracker.adaptiveProfile.recommendedDifficulty}
                </span>
              </div>
            </div>

            {/* Rationale explanation */}
            <div
              className="p-3.5 rounded-xl border text-xs leading-relaxed"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <span className="font-bold font-mono text-purple-400 uppercase tracking-wider mr-2 text-[10px]">
                Adaptive Rationale:
              </span>
              {tracker.adaptiveProfile.adaptiveReasoning}
            </div>

            {/* 4-stat metric strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  Weak Topics
                </div>
                <div className="text-lg font-black mt-0.5 text-rose-400">
                  {tracker.adaptiveProfile.weakTopics.length}
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Developing
                </div>
                <div className="text-lg font-black mt-0.5 text-amber-400">
                  {tracker.adaptiveProfile.developingTopics.length}
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Strong Topics
                </div>
                <div className="text-lg font-black mt-0.5 text-emerald-400">
                  {tracker.adaptiveProfile.strongTopics.length}
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-slate-950/40" style={{ borderColor: theme.borderSubtle }}>
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Overall Solve Rate
                </div>
                <div className="text-lg font-black mt-0.5" style={{ color: theme.text }}>
                  {Math.round(tracker.adaptiveProfile.overallSolveRate * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Topic Competence Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold" style={{ color: theme.text }}>
              Topic Mastery Status &amp; Prerequisite Mapping
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {DSA_TOPICS.map((topic) => {
                const perf = tracker.adaptiveProfile.topicPerformances[topic];
                const state = perf?.masteryState || "Unknown";
                const roadmapPhase = getRoadmapPhaseForTopic(topic);

                const stateBadgeColor =
                  state === "Strong"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : state === "Competent"
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    : state === "Developing"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : state === "Weak"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700";

                return (
                  <div
                    key={topic}
                    className="rounded-2xl border p-4 space-y-3 transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>
                          {topic}
                        </h4>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {roadmapPhase}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${stateBadgeColor}`}>
                        {state}
                      </span>
                    </div>

                    {/* Telemetry row */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs py-1">
                      <div className="p-1.5 rounded-lg bg-slate-950/30 border border-slate-800">
                        <div className="text-[9px] text-slate-400 font-mono uppercase">Attempts</div>
                        <div className="font-bold font-mono mt-0.5" style={{ color: theme.text }}>
                          {perf?.attemptsCount || 0}
                        </div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950/30 border border-slate-800">
                        <div className="text-[9px] text-slate-400 font-mono uppercase">Solved</div>
                        <div className="font-bold font-mono mt-0.5 text-emerald-400">
                          {perf?.solvedCount || 0}
                        </div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950/30 border border-slate-800">
                        <div className="text-[9px] text-slate-400 font-mono uppercase">Confidence</div>
                        <div className="font-bold font-mono mt-0.5 text-amber-400">
                          {perf && perf.averageConfidence > 0 ? `${perf.averageConfidence}/5` : "-"}
                        </div>
                      </div>
                    </div>

                    {/* Primary friction & reinforcement alert */}
                    {perf?.primaryFriction && perf.primaryFriction !== "none" && (
                      <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md">
                        Primary Friction: {FRICTION_LABELS[perf.primaryFriction]}
                      </div>
                    )}

                    {perf?.needsReinforcement && (
                      <div className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                        Needs reinforcement on fundamentals
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("catalog");
                        setTopicFilter(topic);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                      style={{
                        backgroundColor: theme.surfaceMuted,
                        borderColor: theme.borderSubtle,
                        color: theme.textSecondary,
                      }}
                    >
                      <span>Practice {topic}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ────────────────────────── CATALOG TAB ────────────────────────── */}
      {activeTab === "catalog" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Filters Row */}
          <div
            className="rounded-2xl border p-4 space-y-3"
            style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                Filters
              </span>
              {(platformFilter !== "all" || difficultyFilter !== "all" || topicFilter !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setPlatformFilter("all");
                    setDifficultyFilter("all");
                    setTopicFilter("all");
                    setSearchQuery("");
                  }}
                  className="ml-auto text-[10px] font-bold uppercase hover:opacity-80"
                  style={{ color: theme.primary }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: theme.textMuted }}
              />
              <input
                type="text"
                placeholder="Search problems by name, topic, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                }}
              />
            </div>

            {/* Platform + Difficulty Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Platform */}
              {(["all", "leetcode", "codeforces"] as PlatformFilter[]).map((pf) => (
                <button
                  key={pf}
                  onClick={() => setPlatformFilter(pf)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
                  style={{
                    backgroundColor: platformFilter === pf ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: platformFilter === pf ? theme.primary : theme.borderSubtle,
                    color: platformFilter === pf ? theme.primary : theme.textSecondary,
                  }}
                >
                  {pf === "all" ? "All Platforms" : pf === "leetcode" ? "LeetCode" : "Codeforces"}
                </button>
              ))}

              <div className="w-px h-6 self-center" style={{ backgroundColor: theme.borderSubtle }} />

              {/* Difficulty */}
              {(["all", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((df) => {
                const diffColorMap: Record<string, string> = {
                  Easy: theme.success,
                  Medium: theme.warning,
                  Hard: theme.danger,
                };
                return (
                  <button
                    key={df}
                    onClick={() => setDifficultyFilter(df)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all"
                    style={{
                      backgroundColor: difficultyFilter === df
                        ? df === "all" ? theme.primarySoft : `${diffColorMap[df]}15`
                        : theme.surfaceMuted,
                      borderColor: difficultyFilter === df
                        ? df === "all" ? theme.primary : diffColorMap[df]
                        : theme.borderSubtle,
                      color: difficultyFilter === df
                        ? df === "all" ? theme.primary : diffColorMap[df]
                        : theme.textSecondary,
                    }}
                  >
                    {df === "all" ? "All Difficulty" : df}
                  </button>
                );
              })}
            </div>

            {/* Topic Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTopicFilter("all")}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all"
                style={{
                  backgroundColor: topicFilter === "all" ? theme.primarySoft : theme.surfaceMuted,
                  borderColor: topicFilter === "all" ? theme.primary : theme.borderSubtle,
                  color: topicFilter === "all" ? theme.primary : theme.textMuted,
                }}
              >
                All Topics
              </button>
              {availableTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setTopicFilter(topicFilter === topic ? "all" : topic)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all"
                  style={{
                    backgroundColor: topicFilter === topic ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: topicFilter === topic ? theme.primary : theme.borderSubtle,
                    color: topicFilter === topic ? theme.primary : theme.textMuted,
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
              {filteredCatalog.length} problems found
            </span>
          </div>

          {/* Problem Table */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-12 gap-2 px-4 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
              style={{ borderColor: theme.borderSubtle, color: theme.textMuted, backgroundColor: theme.surfaceMuted }}
            >
              <div className="col-span-1">#</div>
              <div className="col-span-4 sm:col-span-5">Problem</div>
              <div className="col-span-2 hidden sm:block">Topic</div>
              <div className="col-span-1">Diff</div>
              <div className="col-span-2 hidden sm:block">Platform</div>
              <div className="col-span-4 sm:col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            {filteredCatalog.slice(0, 50).map((problem) => {
              const isSolved = tracker.isAlreadySolved(problem.id);
              const diffColor =
                problem.difficulty === "Easy" ? theme.success :
                problem.difficulty === "Medium" ? theme.warning :
                theme.danger;

              return (
                <div
                  key={problem.id}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 border-b items-center transition-colors ${
                    isSolved ? "opacity-60" : ""
                  }`}
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <div className="col-span-1 text-xs font-mono font-bold" style={{ color: theme.textMuted }}>
                    {problem.externalId}
                  </div>
                  <div className="col-span-4 sm:col-span-5 flex items-center gap-2 min-w-0">
                    {isSolved && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: theme.success }} />}
                    <span
                      className="text-xs font-semibold truncate"
                      style={{ color: isSolved ? theme.textMuted : theme.text }}
                    >
                      {problem.title}
                    </span>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: theme.surfaceMuted, color: theme.textSecondary }}
                    >
                      {problem.topic}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md"
                      style={{ backgroundColor: `${diffColor}15`, color: diffColor }}
                    >
                      {problem.difficulty.charAt(0)}
                    </span>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-[10px] font-medium" style={{ color: theme.textMuted }}>
                      {problem.provider === "leetcode" ? "LeetCode" : "Codeforces"}
                    </span>
                  </div>
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-1.5">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border hover:opacity-80 transition-opacity"
                      style={{
                        borderColor: theme.borderSubtle,
                        color: theme.textSecondary,
                      }}
                      title="Open Problem"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {!isSolved && (
                      <button
                        onClick={() => setLogModalProblem(problem)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-[1.03]"
                        style={{
                          backgroundColor: theme.primary,
                        }}
                      >
                        Log
                      </button>
                    )}
                    {isSolved && (
                      <span className="text-[10px] font-bold" style={{ color: theme.success }}>
                        Done
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredCatalog.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                  No problems match your filters.
                </p>
              </div>
            )}

            {filteredCatalog.length > 50 && (
              <div className="p-4 text-center">
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  Showing first 50 of {filteredCatalog.length} results. Use filters to narrow down.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ────────────────────────── HISTORY TAB ────────────────────────── */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: theme.text }}>
              Attempt History
            </h2>
            <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
              {tracker.attempts.length} total entries
            </span>
          </div>

          {reversedHistory.length > 0 ? (
            <div className="space-y-2">
              {reversedHistory.map((attempt, idx) => {
                const problem = PROBLEMS_CATALOG.find((p) => p.id === attempt.problemId);
                if (!problem) return null;

                const statusColor =
                  attempt.status === "solved_independent" ? theme.success :
                  attempt.status === "solved_with_help" ? theme.isLight ? "#2563eb" : "#60a5fa" :
                  attempt.status === "attempted" ? theme.warning :
                  theme.textMuted;

                return (
                  <div
                    key={`${attempt.problemId}-${attempt.createdAt}-${idx}`}
                    className="rounded-xl border p-4 flex items-center gap-4"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    {/* Status dot */}
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: statusColor }}
                    />
                    {/* Problem info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate" style={{ color: theme.text }}>
                          {problem.title}
                        </span>
                        <span
                          className="text-[9px] font-mono font-bold shrink-0"
                          style={{ color: theme.textMuted }}
                        >
                          #{problem.externalId}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold" style={{ color: statusColor }}>
                          {ATTEMPT_STATUS_LABELS[attempt.status]}
                        </span>
                        <span className="text-[10px]" style={{ color: theme.textMuted }}>
                          {CONFIDENCE_LABELS[attempt.confidence]}
                        </span>
                        {attempt.timeSpentMinutes > 0 && (
                          <span className="text-[10px]" style={{ color: theme.textMuted }}>
                            {attempt.timeSpentMinutes}m
                          </span>
                        )}
                      </div>
                      {attempt.notes && (
                        <p className="text-[10px] mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                          {attempt.notes}
                        </p>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="text-[9px] font-mono shrink-0" style={{ color: theme.textMuted }}>
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}

              {tracker.attempts.length > 8 && (
                <button
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                    color: theme.textSecondary,
                  }}
                >
                  {showAllHistory ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" /> Show All {tracker.attempts.length} Entries
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
            >
              <Code2 className="w-10 h-10 mx-auto mb-3" style={{ color: theme.textMuted }} />
              <p className="text-sm font-bold" style={{ color: theme.text }}>
                No attempts yet
              </p>
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                Start solving problems to build your practice log.
              </p>
            </div>
          )}

          {/* Stats Summary (visible in history tab) */}
          {tracker.attempts.length > 0 && (
            <div
              className="rounded-2xl border p-5 space-y-3"
              style={{ backgroundColor: theme.surface, borderColor: theme.borderSubtle }}
            >
              <h3 className="text-sm font-bold" style={{ color: theme.text }}>
                Practice Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Avg Confidence", value: stats.averageConfidence },
                  { label: "Most Practiced", value: stats.mostPracticedTopic },
                  { label: "Weakest Topic", value: stats.weakestTopic },
                  { label: "Problems Skipped", value: stats.totalSkipped.toString() },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                      {item.label}
                    </div>
                    <div className="text-sm font-bold mt-0.5" style={{ color: theme.text }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ────────────────────────── Log Modal ────────────────────────── */}
      {logModalProblem && (
        <ProblemLogModal
          problem={logModalProblem}
          onClose={() => setLogModalProblem(null)}
          onSubmit={handleLogAttempt}
          existingAttempt={tracker.getLatestAttempt(logModalProblem.id)}
        />
      )}
    </AppPageShell>
  );
}
