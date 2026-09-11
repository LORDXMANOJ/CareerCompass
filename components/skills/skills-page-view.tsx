"use client";

import React, { useState, useMemo } from "react";
import { OnboardingState, SkillsSelection } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import {
  computeSkillsWorkspace,
  EnrichedSkillItem,
} from "@/lib/skills-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { SkillDetailModal } from "@/components/skills/skill-detail-modal";
import { SkillCheckModal } from "@/components/onboarding/skill-check-modal";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import {
  Code,
  Layers,
  Database,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Target,
  ArrowUpRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface SkillsPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function SkillsPageView({
  onboardingState: initialOnboardingState,
  userName,
  userEmail,
  mentorId,
}: SkillsPageViewProps) {
  const { theme } = useCompanionTheme();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(initialOnboardingState);

  // Sync state from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("career_compass_onboarding");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.skills) {
          setOnboardingState((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const workspaceData = useMemo(
    () => computeSkillsWorkspace(onboardingState),
    [onboardingState]
  );

  const {
    targetRole,
    targetCompanies,
    totalClaimedCount,
    totalVerifiedCount,
    needsReviewCount,
    priorityGapsCount,
    inventory,
    skillGapMatrix,
    priorityGaps,
    strongestArea,
    largestGap,
    nextRecommendedSkill,
    companionMessage,
    companionFocusPillar,
  } = workspaceData;

  const [selectedSkill, setSelectedSkill] = useState<EnrichedSkillItem | null>(null);
  const [activeQuizSkill, setActiveQuizSkill] = useState<string | null>(null);

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    boxShadow: theme.isLight ? theme.shadowSm : `0 0 35px ${theme.glow}`,
  };

  // Handle verification completion
  const handleVerificationComplete = (
    skillName: string,
    isCorrect: boolean,
    selectedAnswer: string
  ) => {
    const key = skillName.toLowerCase();
    const currentVerification = onboardingState.skills?.verification || {};

    const updatedVerification = {
      ...currentVerification,
      [key]: {
        status: isCorrect ? ("verified_basic" as const) : ("needs_review" as const),
        selectedAnswer,
        isCorrect,
        verifiedAt: new Date().toISOString(),
      },
    };

    const updatedSkills: SkillsSelection = {
      ...onboardingState.skills,
      verification: updatedVerification,
    };

    const updatedState: OnboardingState = {
      ...onboardingState,
      skills: updatedSkills,
    };

    setOnboardingState(updatedState);

    try {
      localStorage.setItem("career_compass_onboarding", JSON.stringify(updatedState));
    } catch {
      // Ignore storage error
    }

    setActiveQuizSkill(null);
    setSelectedSkill(null);
  };

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Skills Intelligence"
      subtitle="Understand what you know, what you've verified, and what your target role still requires."
      badge="Skill Diagnostics v2.4"
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
      {/* 1. Header Overview Metrics Card */}
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
              Verification & Gap Calibration
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.text }}>
              Tech Stack Diagnostics
            </h2>
            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: theme.textSecondary }}>
              Comparing your {totalClaimedCount} declared technologies against verified micro-assessments, role requirements for {targetRole}, and target employer hiring benchmarks.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className="p-4 rounded-2xl border text-center flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Claimed
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-1" style={{ color: theme.text }}>
                {totalClaimedCount}
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border text-center flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Verified
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-1" style={{ color: theme.success }}>
                {totalVerifiedCount}
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border text-center flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Needs Review
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-1" style={{ color: theme.warning }}>
                {needsReviewCount}
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border text-center flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: theme.textMuted }}>
                Priority Gaps
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-1" style={{ color: theme.danger }}>
                {priorityGapsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Priority Skill Gaps Section */}
      <div
        className="p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderHighlight,
          boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                className="flex h-2.5 w-2.5 rounded-full animate-ping"
                style={{ backgroundColor: theme.danger }}
              />
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.danger }}
              >
                Highest Leverage Growth Areas
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
              Priority Skill Gaps for {targetRole}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {priorityGaps.map((gap) => (
                <div
                  key={gap.name}
                  className="p-4 rounded-2xl border flex flex-col justify-between space-y-2"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: theme.text }}>
                        {gap.name}
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border"
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.15)",
                          borderColor: "rgba(239, 68, 68, 0.3)",
                          color: theme.danger,
                        }}
                      >
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: theme.textSecondary }}>
                      {gap.why}
                    </p>
                  </div>

                  <Link
                    href={gap.actionHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold font-mono pt-1 hover:underline"
                    style={{ color: theme.primary }}
                  >
                    <span>{gap.actionButtonText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5 justify-center">
            <div
              className="p-4 rounded-2xl border text-xs leading-relaxed max-w-xs"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
              }}
            >
              <strong className="block text-[11px] uppercase font-mono mb-1" style={{ color: theme.primary }}>
                Target Recruiter Impact:
              </strong>
              <span style={{ color: theme.textSecondary }}>
                Closing these specific gaps lifts your alignment for {targetCompanies.slice(0, 2).join(" & ") || "Tier-1"} technical screening filters.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Declared Tech Stack Inventory (Grouped by Category) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
              My Technical Skills Inventory
            </span>
            <span className="text-xs" style={{ color: theme.textMuted }}>• Click any skill to inspect or verify</span>
          </div>
          <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
            {totalVerifiedCount} of {totalClaimedCount} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Languages */}
          <div className="p-5 rounded-3xl border space-y-3" style={cardStyle}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" style={{ color: theme.primary }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                  Languages ({inventory.languages.length})
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              {inventory.languages.length > 0 ? (
                inventory.languages.map((skill) => (
                  <div
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer hover:border-purple-500/40 transition-all group"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {skill.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : skill.needsReview ? (
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                        {skill.name}
                      </span>
                    </div>

                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border shrink-0"
                      style={{
                        backgroundColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.15)"
                          : skill.needsReview
                          ? "rgba(245, 158, 11, 0.15)"
                          : theme.primarySoft,
                        borderColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.3)"
                          : theme.borderSubtle,
                        color: skill.isVerified ? theme.success : skill.needsReview ? theme.warning : theme.textMuted,
                      }}
                    >
                      {skill.statusLabel}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic" style={{ color: theme.textMuted }}>No languages declared</p>
              )}
            </div>
          </div>

          {/* Frameworks */}
          <div className="p-5 rounded-3xl border space-y-3" style={cardStyle}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" style={{ color: theme.primary }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                  Frameworks ({inventory.frameworks.length})
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              {inventory.frameworks.length > 0 ? (
                inventory.frameworks.map((skill) => (
                  <div
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer hover:border-purple-500/40 transition-all group"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {skill.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : skill.needsReview ? (
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                        {skill.name}
                      </span>
                    </div>

                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border shrink-0"
                      style={{
                        backgroundColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.15)"
                          : skill.needsReview
                          ? "rgba(245, 158, 11, 0.15)"
                          : theme.primarySoft,
                        borderColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.3)"
                          : theme.borderSubtle,
                        color: skill.isVerified ? theme.success : skill.needsReview ? theme.warning : theme.textMuted,
                      }}
                    >
                      {skill.statusLabel}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic" style={{ color: theme.textMuted }}>No frameworks declared</p>
              )}
            </div>
          </div>

          {/* Databases */}
          <div className="p-5 rounded-3xl border space-y-3" style={cardStyle}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" style={{ color: theme.primary }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                  Databases ({inventory.databases.length})
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              {inventory.databases.length > 0 ? (
                inventory.databases.map((skill) => (
                  <div
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer hover:border-purple-500/40 transition-all group"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {skill.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : skill.needsReview ? (
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                        {skill.name}
                      </span>
                    </div>

                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border shrink-0"
                      style={{
                        backgroundColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.15)"
                          : skill.needsReview
                          ? "rgba(245, 158, 11, 0.15)"
                          : theme.primarySoft,
                        borderColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.3)"
                          : theme.borderSubtle,
                        color: skill.isVerified ? theme.success : skill.needsReview ? theme.warning : theme.textMuted,
                      }}
                    >
                      {skill.statusLabel}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic" style={{ color: theme.textMuted }}>No databases declared</p>
              )}
            </div>
          </div>

          {/* AI Tools */}
          <div className="p-5 rounded-3xl border space-y-3" style={cardStyle}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" style={{ color: theme.primary }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                  AI & Tools ({inventory.aiAndTools.length})
                </h4>
              </div>
            </div>

            <div className="space-y-2">
              {inventory.aiAndTools.length > 0 ? (
                inventory.aiAndTools.map((skill) => (
                  <div
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className="p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer hover:border-purple-500/40 transition-all group"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {skill.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : skill.needsReview ? (
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <HelpCircle className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-bold truncate group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                        {skill.name}
                      </span>
                    </div>

                    <span
                      className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border shrink-0"
                      style={{
                        backgroundColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.15)"
                          : skill.needsReview
                          ? "rgba(245, 158, 11, 0.15)"
                          : theme.primarySoft,
                        borderColor: skill.isVerified
                          ? "rgba(16, 185, 129, 0.3)"
                          : theme.borderSubtle,
                        color: skill.isVerified ? theme.success : skill.needsReview ? theme.warning : theme.textMuted,
                      }}
                    >
                      {skill.statusLabel}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs italic" style={{ color: theme.textMuted }}>No tools declared</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Target Role Requirements vs Skill Gap Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Target Role Skill Requirements & Hiring Gap Matrix
          </span>
          <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
            {targetRole}
          </span>
        </div>

        <div className="rounded-3xl border overflow-hidden" style={cardStyle}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    borderColor: theme.borderSubtle,
                    backgroundColor: theme.surfaceMuted,
                  }}
                >
                  <th className="p-4 font-bold uppercase text-[10px] font-mono tracking-wider" style={{ color: theme.textMuted }}>Competency</th>
                  <th className="p-4 font-bold uppercase text-[10px] font-mono tracking-wider" style={{ color: theme.textMuted }}>Your Status</th>
                  <th className="p-4 font-bold uppercase text-[10px] font-mono tracking-wider" style={{ color: theme.textMuted }}>Role Demand</th>
                  <th className="p-4 font-bold uppercase text-[10px] font-mono tracking-wider" style={{ color: theme.textMuted }}>Priority Level</th>
                  <th className="p-4 font-bold uppercase text-[10px] font-mono tracking-wider text-right" style={{ color: theme.textMuted }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.borderSubtle }}>
                {skillGapMatrix.map((row) => {
                  const isMissing = row.yourState === "missing";
                  const isVerified = row.yourState === "verified";
                  const isHigh = row.priority === "High";

                  return (
                    <tr key={row.skillName} className="hover:bg-slate-800/10 transition-colors">
                      <td className="p-4 font-bold" style={{ color: theme.text }}>
                        {row.skillName}
                      </td>
                      <td className="p-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border"
                          style={{
                            backgroundColor: isVerified
                              ? "rgba(16, 185, 129, 0.15)"
                              : isMissing
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                            borderColor: isVerified
                              ? "rgba(16, 185, 129, 0.3)"
                              : isMissing
                              ? "rgba(239, 68, 68, 0.3)"
                              : "rgba(245, 158, 11, 0.3)",
                            color: isVerified ? theme.success : isMissing ? theme.danger : theme.warning,
                          }}
                        >
                          {row.yourStateLabel}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs" style={{ color: theme.textSecondary }}>
                        {row.roleNeed}
                      </td>
                      <td className="p-4">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase"
                          style={{
                            backgroundColor: isHigh ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                            color: isHigh ? theme.danger : theme.success,
                          }}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {row.actionHref.startsWith("#") ? (
                          <button
                            type="button"
                            onClick={() => setActiveQuizSkill(row.skillName)}
                            className="px-3 py-1.5 rounded-xl border text-xs font-bold hover:scale-105 transition-all inline-flex items-center gap-1"
                            style={{
                              backgroundColor: theme.primarySoft,
                              borderColor: theme.borderHighlight,
                              color: theme.primary,
                            }}
                          >
                            <span>Verify</span>
                            <Sparkles className="h-3 w-3" />
                          </button>
                        ) : (
                          <Link
                            href={row.actionHref}
                            className="px-3 py-1.5 rounded-xl border text-xs font-bold hover:scale-105 transition-all inline-flex items-center gap-1"
                            style={{
                              backgroundColor: theme.surfaceMuted,
                              borderColor: theme.borderSubtle,
                              color: theme.text,
                            }}
                          >
                            <span>{row.actionText}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Summary & Companion Coaching Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Readiness Diagnostics Summary */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between" style={cardStyle}>
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2.5">
                <Target className="h-5 w-5" style={{ color: theme.primary }} />
                <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                  Skill Readiness Insights
                </h3>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: theme.primary }}>
                Deterministic v2.4
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div
                className="p-3.5 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <span className="text-xs" style={{ color: theme.textMuted }}>Strongest Evident Area:</span>
                <strong className="text-xs sm:text-sm font-bold" style={{ color: theme.success }}>
                  {strongestArea}
                </strong>
              </div>

              <div
                className="p-3.5 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <span className="text-xs" style={{ color: theme.textMuted }}>Largest Active Gap:</span>
                <strong className="text-xs sm:text-sm font-bold" style={{ color: theme.danger }}>
                  {largestGap}
                </strong>
              </div>

              <div
                className="p-3.5 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <span className="text-xs" style={{ color: theme.textMuted }}>Next Recommended Skill:</span>
                <strong className="text-xs sm:text-sm font-bold" style={{ color: theme.primary }}>
                  {nextRecommendedSkill}
                </strong>
              </div>
            </div>
          </div>

          <Link
            href="/roadmap"
            className="w-full h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.text,
            }}
          >
            <span>View Full Roadmap Alignment</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Companion Coaching Box */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between" style={cardStyle}>
          <div className="flex items-start gap-4">
            <div
              className="p-2 rounded-2xl border shrink-0 shadow-sm"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
              }}
            >
              <CompanionAvatar id={mentorId} size={64} className="rounded-xl shrink-0" />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                  Coach Guidance
                </h4>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderSubtle,
                    color: theme.primary,
                  }}
                >
                  {companionFocusPillar}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium italic leading-relaxed" style={{ color: theme.textSecondary }}>
                &ldquo;{companionMessage}&rdquo;
              </p>
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border text-[11px] mt-4 flex items-start gap-2"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <Info className="h-4 w-4 shrink-0 text-purple-400 mt-0.5" />
            <span style={{ color: theme.textSecondary }}>
              Conceptual verification checks are derived from verified technical questions in the CareerCompass dataset without external dependencies.
            </span>
          </div>
        </div>
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onStartVerify={(skillName) => {
            setSelectedSkill(null);
            setActiveQuizSkill(skillName);
          }}
        />
      )}

      {/* Skill Micro-Assessment Verification Modal */}
      {activeQuizSkill && (
        <SkillCheckModal
          skillName={activeQuizSkill}
          selectedMentorId={mentorId}
          isOpen={Boolean(activeQuizSkill)}
          onComplete={handleVerificationComplete}
          onClose={() => setActiveQuizSkill(null)}
        />
      )}
    </AppPageShell>
  );
}
