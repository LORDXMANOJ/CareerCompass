"use client";

import React from "react";
import { EnrichedSkillItem } from "@/lib/skills-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  X,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface SkillDetailModalProps {
  skill: EnrichedSkillItem | null;
  onClose: () => void;
  onStartVerify: (skillName: string) => void;
}

export function SkillDetailModal({
  skill,
  onClose,
  onStartVerify,
}: SkillDetailModalProps) {
  const { theme } = useCompanionTheme();

  if (!skill) return null;

  const getStatusBadge = () => {
    switch (skill.status) {
      case "verified":
        return {
          label: "Verified Concept",
          icon: ShieldCheck,
          color: theme.success,
          bg: theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(6, 78, 59, 0.40)",
          border: "rgba(16, 185, 129, 0.35)",
        };
      case "evidence_backed":
        return {
          label: "Evidence-Backed",
          icon: CheckCircle2,
          color: theme.isLight ? "#2563eb" : "#60a5fa",
          bg: theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(30, 58, 138, 0.40)",
          border: "rgba(59, 130, 246, 0.35)",
        };
      case "needs_review":
        return {
          label: "Needs Review",
          icon: AlertCircle,
          color: theme.warning,
          bg: theme.isLight ? "rgba(245, 158, 11, 0.10)" : "rgba(120, 53, 15, 0.40)",
          border: "rgba(245, 158, 11, 0.35)",
        };
      default:
        return {
          label: "Self-Reported",
          icon: HelpCircle,
          color: theme.textSecondary,
          bg: theme.surfaceMuted,
          border: theme.borderSubtle,
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderHighlight,
          boxShadow: theme.isLight ? theme.shadowLg : `0 0 45px ${theme.glow}`,
        }}
      >
        {/* Modal Header */}
        <div
          className="p-6 sm:p-7 border-b flex items-start justify-between gap-4"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.border,
                  color: theme.primary,
                }}
              >
                {skill.category}
              </span>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1"
                style={{
                  backgroundColor: statusBadge.bg,
                  borderColor: statusBadge.border,
                  color: statusBadge.color,
                }}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{statusBadge.label}</span>
              </span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black tracking-tight pt-1"
              style={{ color: theme.text }}
            >
              {skill.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border text-xs transition-colors hover:scale-105 shrink-0"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.textMuted,
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Why It Matters */}
          <div
            className="p-5 rounded-2xl border space-y-2"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
            }}
          >
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              <Target className="h-4 w-4" />
              <span>Role Relevance & Industry Demand</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: theme.text }}>
              {skill.whyItMatters}
            </p>
          </div>

          {/* Telemetry & Profile Evidence */}
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: theme.text }}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>What CareerCompass Knows</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {skill.whatWeKnow}
            </p>
          </div>

          {/* Two Column Roadmap & Company Connection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roadmap Fit */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.text }}
              >
                <Compass className="h-4 w-4 text-purple-500" />
                <span>Roadmap Connection</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: theme.text }}>
                {skill.roadmapPhase}
              </p>
              <p className="text-[11px]" style={{ color: theme.textMuted }}>
                Milestone: {skill.roadmapTask}
              </p>
            </div>

            {/* Target Companies */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.text }}
              >
                <Building2 className="h-4 w-4 text-blue-500" />
                <span>Target Companies</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skill.relatedCompanies.length > 0 ? (
                  skill.relatedCompanies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-md border text-[10px] font-medium"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.borderSubtle,
                        color: theme.textSecondary,
                      }}
                    >
                      {comp}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic" style={{ color: theme.textMuted }}>
                    Target companies evaluate this skill.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div
          className="p-5 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: theme.borderSubtle }}
        >
          <span className="text-xs text-center sm:text-left" style={{ color: theme.textMuted }}>
            {skill.isVerified
              ? "Baseline foundation verified ✓"
              : "Verify fundamental concepts to strengthen profile proof."}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!skill.isVerified && skill.hasVerificationQuiz && (
              <button
                type="button"
                onClick={() => onStartVerify(skill.name)}
                className="w-full sm:w-auto h-11 px-5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.borderHighlight,
                  color: theme.primary,
                }}
              >
                <Sparkles className="h-4 w-4" />
                <span>Verify Skill Now</span>
              </button>
            )}

            <Link
              href="/roadmap"
              className="w-full sm:w-auto h-11 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: theme.gradient,
                boxShadow: theme.isLight ? theme.shadowSm : `0 8px 24px ${theme.glow}`,
              }}
            >
              <span>View in Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
