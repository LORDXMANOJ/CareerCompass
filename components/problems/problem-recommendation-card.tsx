"use client";

// =============================================================================
// Problem Recommendation Card
// =============================================================================

import React from "react";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  ExternalLink,
  CheckCircle2,
  Target,
  Building2,
  Sparkles,
  Zap,
} from "lucide-react";
import { ProblemRecommendation } from "@/types/problems";

interface ProblemRecommendationCardProps {
  recommendation: ProblemRecommendation;
  isSolved: boolean;
  onLogSolve: () => void;
}

export function ProblemRecommendationCard({
  recommendation,
  isSolved,
  onLogSolve,
}: ProblemRecommendationCardProps) {
  const { theme } = useCompanionTheme();
  const { problem, score, reason, addressesGap, relevantCompany } = recommendation;

  const diffColor =
    problem.difficulty === "Easy" ? theme.success :
    problem.difficulty === "Medium" ? theme.warning :
    theme.danger;

  const providerLabel = problem.provider === "leetcode" ? "LC" : problem.provider === "codeforces" ? "CF" : "HR";

  return (
    <div
      className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
        isSolved ? "opacity-60" : "hover:scale-[1.01]"
      }`}
      style={{
        backgroundColor: theme.surface,
        borderColor: isSolved ? theme.borderSubtle : theme.border,
        boxShadow: isSolved ? "none" : theme.isLight ? theme.shadowSm : `0 0 10px ${theme.glow}40`,
      }}
    >
      {/* Solved overlay */}
      {isSolved && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" style={{ color: theme.success }} />
          <span className="text-[10px] font-bold uppercase" style={{ color: theme.success }}>
            Solved
          </span>
        </div>
      )}

      {/* Top row: Provider badge + Difficulty + Score */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md border"
          style={{
            backgroundColor: theme.primarySoft,
            borderColor: theme.border,
            color: theme.primary,
          }}
        >
          {providerLabel}
        </span>
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{ backgroundColor: `${diffColor}18`, color: diffColor }}
        >
          {problem.difficulty}
        </span>
        {recommendation.category && (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20"
          >
            {recommendation.category.replace("_", " ")}
          </span>
        )}
        <span
          className="ml-auto text-[9px] font-mono font-bold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: theme.surfaceMuted, color: theme.textMuted }}
        >
          Score: {score.totalScore}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-sm sm:text-base font-bold mb-1 leading-tight"
        style={{ color: theme.text }}
      >
        {problem.externalId}. {problem.title}
      </h3>

      {/* Topic + Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: theme.surfaceMuted, color: theme.textSecondary }}
        >
          {problem.topic}
        </span>
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: theme.surfaceMuted, color: theme.textMuted }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Reason */}
      <p className="text-xs leading-relaxed mb-3" style={{ color: theme.textSecondary }}>
        {reason}
      </p>

      {/* Relevance Indicators */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {addressesGap && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border"
            style={{
              backgroundColor: theme.isLight ? "rgba(239, 68, 68, 0.06)" : "rgba(127, 29, 29, 0.30)",
              borderColor: theme.isLight ? "rgba(239, 68, 68, 0.20)" : "rgba(239, 68, 68, 0.30)",
              color: theme.danger,
            }}
          >
            <Target className="w-3 h-3" /> Gap: {addressesGap}
          </span>
        )}
        {relevantCompany && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border"
            style={{
              backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.06)" : "rgba(30, 58, 138, 0.30)",
              borderColor: theme.isLight ? "rgba(59, 130, 246, 0.20)" : "rgba(59, 130, 246, 0.30)",
              color: theme.isLight ? "#2563eb" : "#60a5fa",
            }}
          >
            <Building2 className="w-3 h-3" /> {relevantCompany}
          </span>
        )}
        {score.roleRelevance >= 80 && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.border,
              color: theme.primary,
            }}
          >
            <Sparkles className="w-3 h-3" /> Role-critical
          </span>
        )}
        {recommendation.roadmapConnection && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          >
            {recommendation.roadmapConnection}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all hover:opacity-80 inline-flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.text,
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Problem
        </a>
        {!isSolved ? (
          <button
            onClick={onLogSolve}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.primary,
              boxShadow: theme.isLight ? theme.shadowSm : `0 0 12px ${theme.glow}`,
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            I Solved This
          </button>
        ) : (
          <div
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: `${theme.success}12`,
              borderColor: `${theme.success}30`,
              color: theme.success,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
