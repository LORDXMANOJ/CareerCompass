"use client";

import React, { useState, useMemo } from "react";
import { OnboardingState } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import {
  computeInteractiveRoadmap,
  RoadmapTask,
} from "@/lib/roadmap-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { TaskDetailModal } from "@/components/roadmap/task-detail-modal";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { CompanyLogo } from "@/components/company-logo";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flag,
  ArrowRight,
  ShieldCheck,
  Building2,
  Zap,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface RoadmapPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function RoadmapPageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
}: RoadmapPageViewProps) {
  const { theme } = useCompanionTheme();

  const roadmapData = useMemo(
    () => computeInteractiveRoadmap(onboardingState),
    [onboardingState]
  );

  const {
    targetRole,
    targetCompanies,
    readinessScore,
    currentPhase,
    currentPhaseIndex,
    currentPhaseExplanation,
    phases,
    nextBestAction,
    prioritySkillGaps,
    companyConnections,
    companionCoaching,
  } = roadmapData;

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    [currentPhase.id]: true,
  });

  const [selectedTask, setSelectedTask] = useState<{
    task: RoadmapTask;
    phaseTitle: string;
  } | null>(null);

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    boxShadow: theme.isLight ? theme.shadowSm : `0 0 35px ${theme.glow}`,
  };

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Career Roadmap"
      subtitle="Your personalized engineering progression path from current skills to career-ready preparation."
      badge="Career Progression Engine"
      headerAction={
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-sm"
          style={{
            backgroundColor: theme.primarySoft,
            borderColor: theme.borderHighlight,
            color: theme.primary,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Role Target: {targetRole}</span>
        </div>
      }
    >
      {/* 1. Header Overview Stats Card */}
      <div
        className="p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden"
        style={cardStyle}
      >
        <div
          className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor: theme.primary,
            opacity: theme.isLight ? 0.04 : 0.2,
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block"
              style={{ color: theme.primary }}
            >
              Calibrated Strategy Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.text }}>
              Structured Career Progression
            </h2>
            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: theme.textSecondary }}>
              Every phase is deterministically sequenced based on your verified skills, practical building history, and target company hiring bars.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div
              className="p-4 rounded-2xl border flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Target Role
              </span>
              <span className="text-sm sm:text-base font-black truncate mt-1" style={{ color: theme.text }}>
                {targetRole}
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Companies
              </span>
              <span className="text-sm sm:text-base font-black truncate mt-1" style={{ color: theme.primary }}>
                {targetCompanies.length > 0 ? `${targetCompanies.length} Selected` : "None Selected"}
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border col-span-2 sm:col-span-1 flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Readiness Index
              </span>
              <span className="text-lg sm:text-xl font-black font-mono mt-1" style={{ color: theme.text }}>
                {readinessScore}% Est.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current Highest-Priority Phase Banner */}
      <div
        className="p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderHighlight,
          boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-2.5 w-2.5 rounded-full animate-ping"
                style={{ backgroundColor: theme.primary }}
              />
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.primary }}
              >
                Your Current Focus Phase
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.borderHighlight,
                  color: theme.primary,
                }}
              >
                Phase {currentPhase.phaseNumber} of {phases.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
              Phase {currentPhase.phaseNumber}: {currentPhase.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
              <div
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <strong className="block mb-1 text-[11px] uppercase font-mono" style={{ color: theme.primary }}>
                  Why This Phase is Active:
                </strong>
                <span style={{ color: theme.textSecondary }}>{currentPhaseExplanation.whyCurrent}</span>
              </div>

              <div
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <strong className="block mb-1 text-[11px] uppercase font-mono" style={{ color: theme.warning }}>
                  Primary Constraint:
                </strong>
                <span style={{ color: theme.textSecondary }}>{currentPhaseExplanation.whatIsBlocking}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <Link
              href={nextBestAction.href}
              className="h-12 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: theme.gradient,
                boxShadow: theme.isLight ? theme.shadowSm : `0 8px 24px ${theme.glow}`,
              }}
            >
              <Zap className="h-4 w-4" />
              <span>{nextBestAction.buttonText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="text-[11px] font-mono text-center" style={{ color: theme.textMuted }}>
              Estimated effort: ~{nextBestAction.estimatedMinutes} mins
            </span>
          </div>
        </div>
      </div>

      {/* 3. 6 Interactive Progression Phase Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Full Engineering Curriculum
          </span>
          <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
            6 Structured Modules
          </span>
        </div>

        {phases.map((phase, idx) => {
          const isExpanded = Boolean(expandedPhases[phase.id]);
          const isCurrent = idx === currentPhaseIndex;
          const isCompleted = idx < currentPhaseIndex;

          return (
            <div
              key={phase.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isCurrent ? "ring-1" : ""
              }`}
              style={{
                ...cardStyle,
                borderColor: isCurrent ? theme.borderHighlight : theme.border,
              }}
            >
              {/* Phase Collapsed Header Bar */}
              <div
                onClick={() => togglePhase(phase.id)}
                className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/10 transition-colors select-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl border flex items-center justify-center font-black font-mono text-sm shrink-0 shadow-sm"
                    style={{
                      backgroundColor: isCompleted
                        ? theme.isLight ? "rgba(16, 185, 129, 0.15)" : "rgba(6, 78, 59, 0.5)"
                        : isCurrent
                        ? theme.primarySoft
                        : theme.surfaceMuted,
                      borderColor: isCompleted
                        ? "rgba(16, 185, 129, 0.4)"
                        : isCurrent
                        ? theme.borderHighlight
                        : theme.borderSubtle,
                      color: isCompleted
                        ? theme.success
                        : isCurrent
                        ? theme.primary
                        : theme.textMuted,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <span>0{phase.phaseNumber}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-mono font-bold uppercase tracking-wider"
                        style={{
                          color: isCompleted
                            ? theme.success
                            : isCurrent
                            ? theme.primary
                            : theme.textMuted,
                        }}
                      >
                        {isCompleted
                          ? "Completed Phase"
                          : isCurrent
                          ? "Current Active Phase"
                          : "Upcoming Milestone"}
                      </span>
                      <span className="text-xs" style={{ color: theme.textMuted }}>•</span>
                      <span className="text-xs flex items-center gap-1 font-mono" style={{ color: theme.textMuted }}>
                        <Clock className="h-3 w-3" />
                        {phase.estimatedDuration}
                      </span>
                      <span className="text-xs" style={{ color: theme.textMuted }}>•</span>
                      <span className="text-xs font-mono font-semibold" style={{ color: theme.textSecondary }}>
                        {phase.completedCount} of {phase.totalTasks} tasks verified
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black truncate" style={{ color: theme.text }}>
                      Phase {phase.phaseNumber}: {phase.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className="h-8 w-8 rounded-xl border flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                      color: theme.textMuted,
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Phase Content */}
              {isExpanded && (
                <div
                  className="px-5 sm:px-6 pb-6 pt-2 border-t space-y-6"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  {/* Phase Narrative */}
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    {phase.whyThisMatters}
                  </p>

                  {/* Tasks List */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider block font-mono" style={{ color: theme.textMuted }}>
                      Phase Tasks & Execution Milestones (Click to inspect)
                    </span>

                    <div className="grid grid-cols-1 gap-2.5">
                      {phase.tasks.map((task) => {
                        const isTaskDone = task.status === "completed" || task.status === "verified";
                        const isTaskVerified = task.status === "verified";

                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask({ task, phaseTitle: `Phase ${phase.phaseNumber}: ${phase.title}` })}
                            className="p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer hover:border-purple-500/40 transition-all group"
                            style={{
                              backgroundColor: theme.surfaceMuted,
                              borderColor: theme.borderSubtle,
                            }}
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className="mt-0.5 shrink-0">
                                {isTaskVerified ? (
                                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                ) : isTaskDone ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <Circle className="h-5 w-5" style={{ color: theme.textMuted }} />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                  <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                                    {task.title}
                                  </h4>
                                  <span
                                    className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border"
                                    style={{
                                      backgroundColor: isTaskVerified
                                        ? "rgba(16, 185, 129, 0.15)"
                                        : isTaskDone
                                        ? "rgba(16, 185, 129, 0.1)"
                                        : theme.primarySoft,
                                      borderColor: isTaskDone ? "rgba(16, 185, 129, 0.3)" : theme.borderSubtle,
                                      color: isTaskDone ? theme.success : theme.textMuted,
                                    }}
                                  >
                                    {task.status.replace("_", " ")}
                                  </span>
                                </div>
                                <p className="text-xs line-clamp-1" style={{ color: theme.textSecondary }}>
                                  {task.shortExplanation}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold font-mono hidden sm:inline" style={{ color: theme.primary }}>
                                View Details
                              </span>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: theme.primary }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Milestone Box */}
                  <div
                    className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Flag className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase block" style={{ color: theme.primary }}>
                          Phase Capstone Milestone
                        </span>
                        <span className="text-xs sm:text-sm font-bold" style={{ color: theme.text }}>
                          {phase.milestoneProject}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <Link
                        href="/skills"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm shrink-0 transition-transform hover:scale-105"
                        style={{
                          background: theme.gradient,
                        }}
                      >
                        <span>Open Phase Tools</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Priority Skill Gaps & Company Calibration Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Priority Skill Gaps */}
        <div
          className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between"
          style={cardStyle}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl border flex items-center justify-center"
                  style={{
                    backgroundColor: theme.isLight ? "rgba(217, 119, 6, 0.10)" : "rgba(217, 119, 6, 0.20)",
                    borderColor: "rgba(217, 119, 6, 0.35)",
                    color: theme.isLight ? "#d97706" : "#fbbf24",
                  }}
                >
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.isLight ? "#d97706" : "#fbbf24" }}>
                    Roadmap Alignment
                  </span>
                  <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                    Priority Skill Gaps
                  </h3>
                </div>
              </div>

              <Link
                href="/skills"
                className="text-xs font-bold inline-flex items-center gap-1 hover:underline"
                style={{ color: theme.primary }}
              >
                <span>View Skills</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              {prioritySkillGaps.map((gap) => (
                <div
                  key={gap.name}
                  className="p-3.5 rounded-2xl border flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold" style={{ color: theme.text }}>
                        {gap.name}
                      </h4>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold"
                        style={{
                          backgroundColor: theme.isLight ? "rgba(225, 29, 72, 0.08)" : "rgba(136, 19, 55, 0.40)",
                          borderColor: "rgba(225, 29, 72, 0.35)",
                          color: theme.isLight ? "#be123c" : "#fda4af",
                        }}
                      >
                        {gap.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                      {gap.reason}
                    </p>
                  </div>

                  <Link
                    href={gap.href}
                    className="px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-colors"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSubtle,
                      color: theme.primary,
                    }}
                  >
                    Practice
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border text-[11px] leading-relaxed"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.textSecondary,
            }}
          >
            <strong style={{ color: theme.text }}>Roadmap Impact: </strong>
            Closing these specific competencies automatically advances your milestone tasks into verified status.
          </div>
        </div>

        {/* Right: Target Companies Connection */}
        <div
          className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between"
          style={cardStyle}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl border flex items-center justify-center"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderHighlight,
                    color: theme.primary,
                  }}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                    Company Preparation
                  </span>
                  <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                    Target Company Pipeline
                  </h3>
                </div>
              </div>

              <Link
                href="/companies"
                className="text-xs font-bold inline-flex items-center gap-1 hover:underline"
                style={{ color: theme.primary }}
              >
                <span>View Companies</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              {companyConnections.length > 0 ? (
                companyConnections.map((conn) => (
                  <div
                    key={conn.company.id}
                    className="p-4 rounded-2xl border flex items-center justify-between gap-4"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-xl border flex items-center justify-center p-2 shrink-0 shadow-sm"
                        style={{
                          backgroundColor: theme.isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                          borderColor: theme.borderSubtle,
                        }}
                      >
                        <CompanyLogo company={conn.company} size="md" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold truncate" style={{ color: theme.text }}>
                            {conn.company.name}
                          </h4>
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: theme.primarySoft,
                              borderColor: theme.borderSubtle,
                              color: theme.primary,
                            }}
                          >
                            {conn.preparedPercent}% Prep
                          </span>
                        </div>
                        <p className="text-[11px] truncate" style={{ color: theme.textMuted }}>
                          Gaps: {conn.missingGaps.length > 0 ? conn.missingGaps.join(", ") : "Core stack aligned"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={conn.href}
                      className="text-xs font-bold font-mono inline-flex items-center gap-1 shrink-0"
                      style={{ color: theme.primary }}
                    >
                      <span>Prep</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl border text-center text-xs italic" style={{ color: theme.textMuted }}>
                  No target companies selected yet. Pick your target companies in onboarding to see tailored roadmap calibrations.
                </div>
              )}
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border text-[11px] leading-relaxed"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.textSecondary,
            }}
          >
            <strong style={{ color: theme.text }}>Hiring Bar Calibration: </strong>
            Roadmap milestones adapt directly to the algorithm complexity and system design rigor of your target employers.
          </div>
        </div>
      </div>

      {/* 5. Companion Coaching Guidance Box */}
      <div
        className="p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
        }}
      >
        <div
          className="p-2 rounded-2xl border shrink-0 shadow-sm"
          style={{
            backgroundColor: theme.primarySoft,
            borderColor: theme.borderHighlight,
          }}
        >
          <CompanionAvatar id={mentorId} size={72} className="rounded-xl shrink-0" />
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
              {companionCoaching.name}&apos;s Roadmap Coaching
            </h4>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderSubtle,
                color: theme.primary,
              }}
            >
              {companionCoaching.focusPillar}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium italic leading-relaxed" style={{ color: theme.textSecondary }}>
            &ldquo;{companionCoaching.message}&rdquo;
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono" style={{ color: theme.textMuted }}>
            <span>Curriculum: Deterministic v2.4</span>
            <span>•</span>
            <span>Evaluation: Continuous Verification</span>
          </div>
        </div>
      </div>

      {/* Interactive Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask.task}
          phaseTitle={selectedTask.phaseTitle}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </AppPageShell>
  );
}
