"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoadmapPhase } from "@/lib/dashboard-intelligence";
import { Compass, CheckCircle2, Clock, ChevronDown, ChevronUp, Flag, Sparkles, ArrowUpRight } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface RoadmapSectionProps {
  phases: RoadmapPhase[];
  currentPhaseIndex: number;
}

export function RoadmapSection({ phases, currentPhaseIndex }: RoadmapSectionProps) {
  const { theme } = useCompanionTheme();
  const [expandedPhaseId, setExpandedPhaseId] = useState<string>(
    phases[currentPhaseIndex]?.id || phases[0]?.id
  );

  const toggleExpand = (id: string) => {
    setExpandedPhaseId((prev) => (prev === id ? "" : id));
  };

  return (
    <div
      id="roadmap"
      className="p-6 sm:p-8 rounded-3xl border transition-all"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b"
        style={{ borderColor: theme.borderSubtle }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(37, 99, 235, 0.20)",
              borderColor: "rgba(59, 130, 246, 0.35)",
              borderWidth: "1px",
              color: theme.isLight ? "#2563eb" : "#60a5fa",
            }}
          >
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.isLight ? "#2563eb" : "#60a5fa" }}
            >
              Placement Strategy
            </span>
            <h2
              className="text-lg sm:text-xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Personalized Career Roadmap
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: theme.textMuted }}>Current Milestone:</span>
            <span
              className="px-3 py-1 rounded-xl font-extrabold text-xs"
              style={{
                backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(59, 130, 246, 0.15)",
                borderColor: "rgba(59, 130, 246, 0.30)",
                borderWidth: "1px",
                color: theme.isLight ? "#1d4ed8" : "#93c5fd",
              }}
            >
              Phase {currentPhaseIndex + 1} of {phases.length}
            </span>
          </div>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.primary,
            }}
          >
            <span>View Full Roadmap</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Roadmap Timeline Grid */}
      <div className="space-y-3.5">
        {phases.map((phase, idx) => {
          const isExpanded = expandedPhaseId === phase.id;
          const isCompleted = phase.status === "completed";
          const isCurrent = phase.status === "current";

          return (
            <div
              key={phase.id}
              className="rounded-2xl border transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: isCurrent
                  ? theme.isLight
                    ? "rgba(59, 130, 246, 0.04)"
                    : "rgba(30, 58, 138, 0.25)"
                  : isCompleted
                  ? theme.isLight
                    ? "rgba(16, 185, 129, 0.04)"
                    : "rgba(6, 78, 59, 0.25)"
                  : theme.surfaceMuted,
                borderColor: isCurrent
                  ? "rgba(59, 130, 246, 0.40)"
                  : isCompleted
                  ? "rgba(16, 185, 129, 0.35)"
                  : theme.borderSubtle,
                opacity: isCurrent || isCompleted ? 1 : 0.85,
              }}
            >
              {/* Collapsed Header Bar */}
              <button
                type="button"
                onClick={() => toggleExpand(phase.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Status Indicator Circle */}
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-black"
                    style={{
                      backgroundColor: isCompleted
                        ? theme.isLight ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.20)"
                        : isCurrent
                        ? theme.isLight ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.20)"
                        : theme.isLight ? "#e2e8f0" : "rgba(30, 41, 59, 0.8)",
                      color: isCompleted
                        ? theme.isLight ? "#059669" : "#34d399"
                        : isCurrent
                        ? theme.isLight ? "#2563eb" : "#60a5fa"
                        : theme.textMuted,
                      borderColor: isCompleted
                        ? "rgba(16, 185, 129, 0.35)"
                        : isCurrent
                        ? "rgba(59, 130, 246, 0.40)"
                        : theme.borderSubtle,
                      borderWidth: "1px",
                    }}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs sm:text-sm font-bold truncate" style={{ color: theme.text }}>
                        {phase.title}
                      </span>
                      {isCurrent && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold"
                          style={{
                            backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.20)",
                            color: theme.isLight ? "#1d4ed8" : "#93c5fd",
                          }}
                        >
                          Active Focus
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] truncate" style={{ color: theme.textSecondary }}>
                      {phase.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono" style={{ color: theme.textMuted }}>
                    <Clock className="h-3 w-3" style={{ color: theme.textMuted }} />
                    <span>{phase.estimatedDuration}</span>
                  </div>

                  <div className="text-right hidden md:block">
                    <div className="text-xs font-mono font-bold" style={{ color: theme.text }}>
                      {phase.progressPercent}%
                    </div>
                    <div
                      className="w-16 h-1.5 rounded-full overflow-hidden mt-1"
                      style={{ backgroundColor: theme.isLight ? "#e2e8f0" : "#1e293b" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${phase.progressPercent}%`,
                          backgroundColor: isCompleted ? "#10b981" : "#3b82f6",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ color: theme.textMuted }}>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div
                  className="px-5 pb-5 pt-3 border-t grid grid-cols-1 md:grid-cols-12 gap-5"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  {/* Key Objectives */}
                  <div className="md:col-span-7">
                    <h4
                      className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: theme.textMuted }}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                      <span>Key Strategic Objectives</span>
                    </h4>
                    <ul className="space-y-2">
                      {phase.keyObjectives.map((obj, i) => (
                        <li key={i} className="text-xs flex items-start gap-2" style={{ color: theme.textSecondary }}>
                          <span className="font-bold text-purple-500">•</span>
                          <span className="leading-relaxed">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Milestone & Why This Matters */}
                  <div className="md:col-span-5 space-y-3">
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: theme.isLight ? "#ffffff" : "rgba(15, 23, 42, 0.6)",
                        borderColor: theme.borderSubtle,
                      }}
                    >
                      <div
                        className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                        style={{ color: theme.textMuted }}
                      >
                        <Flag className="h-3 w-3 text-emerald-500" />
                        <span>Phase Milestone</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: theme.text }}>
                        {phase.milestoneProject}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl border text-[11px] leading-relaxed"
                      style={{
                        backgroundColor: theme.isLight ? "rgba(139, 92, 246, 0.05)" : "rgba(88, 28, 135, 0.20)",
                        borderColor: theme.isLight ? "rgba(139, 92, 246, 0.20)" : "rgba(168, 85, 247, 0.20)",
                        color: theme.isLight ? "#4c1d95" : "#e9d5ff",
                      }}
                    >
                      <strong style={{ color: theme.isLight ? "#3b0764" : "#ffffff" }}>Why this matters: </strong>
                      {phase.whyThisMatters}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

