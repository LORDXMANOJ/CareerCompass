"use client";

import React from "react";
import { RoadmapTask } from "@/lib/roadmap-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  X,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface TaskDetailModalProps {
  task: RoadmapTask | null;
  onClose: () => void;
  phaseTitle: string;
}

export function TaskDetailModal({ task, onClose, phaseTitle }: TaskDetailModalProps) {
  const { theme } = useCompanionTheme();

  if (!task) return null;

  const getStatusBadge = (status: RoadmapTask["status"]) => {
    switch (status) {
      case "verified":
        return {
          label: "Verified Proof",
          color: theme.success,
          bg: theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(6, 78, 59, 0.40)",
          border: "rgba(16, 185, 129, 0.35)",
        };
      case "completed":
        return {
          label: "Self-Reported Completed",
          color: theme.isLight ? "#059669" : "#34d399",
          bg: theme.isLight ? "rgba(16, 185, 129, 0.08)" : "rgba(6, 78, 59, 0.30)",
          border: "rgba(16, 185, 129, 0.25)",
        };
      case "in_progress":
        return {
          label: "In Progress",
          color: theme.isLight ? "#2563eb" : "#60a5fa",
          bg: theme.isLight ? "rgba(59, 130, 246, 0.08)" : "rgba(30, 58, 138, 0.30)",
          border: "rgba(59, 130, 246, 0.30)",
        };
      case "upcoming":
        return {
          label: "Upcoming Phase",
          color: theme.textMuted,
          bg: theme.surfaceMuted,
          border: theme.borderSubtle,
        };
      default:
        return {
          label: "Not Started",
          color: theme.warning,
          bg: theme.isLight ? "rgba(245, 158, 11, 0.08)" : "rgba(120, 53, 15, 0.30)",
          border: "rgba(245, 158, 11, 0.30)",
        };
    }
  };

  const statusBadge = getStatusBadge(task.status);

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
                {phaseTitle}
              </span>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: statusBadge.bg,
                  borderColor: statusBadge.border,
                  color: statusBadge.color,
                }}
              >
                {statusBadge.label}
              </span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-black tracking-tight pt-1"
              style={{ color: theme.text }}
            >
              {task.title}
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
          {/* Overview */}
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: theme.textMuted }}
            >
              Task Overview
            </span>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textSecondary }}>
              {task.shortExplanation}
            </p>
          </div>

          {/* Why This Matters */}
          <div
            className="p-5 rounded-2xl border space-y-2"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
              <Target className="h-4 w-4" />
              <span>Why This Matters for Your Target Role</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: theme.text }}>
              {task.reasonItMatters}
            </p>
          </div>

          {/* Two-Column Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* What CareerCompass Knows */}
            <div
              className="p-4 rounded-2xl border"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.text }}>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Profile Telemetry</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                {task.whatWeKnow}
              </p>
            </div>

            {/* Recommended Action */}
            <div
              className="p-4 rounded-2xl border"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.text }}>
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Recommended Action</span>
              </div>
              <p className="text-xs leading-relaxed font-medium" style={{ color: theme.textSecondary }}>
                {task.recommendedAction}
              </p>
            </div>
          </div>

          {/* Contextual Tag Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {task.relatedSkill && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                  color: theme.textSecondary,
                }}
              >
                <span>Skill Target:</span>
                <strong style={{ color: theme.text }}>{task.relatedSkill}</strong>
              </span>
            )}

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textMuted,
              }}
            >
              Priority: {task.priority}
            </span>
          </div>
        </div>

        {/* Modal Footer / CTA */}
        <div
          className="p-5 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: theme.borderSubtle }}
        >
          <span className="text-xs text-center sm:text-left" style={{ color: theme.textMuted }}>
            Progress updates reflect live as you complete workspace verification.
          </span>

          <Link
            href={task.ctaHref}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: theme.gradient,
              boxShadow: theme.isLight ? theme.shadowSm : `0 8px 24px ${theme.glow}`,
            }}
          >
            <span>{task.ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
