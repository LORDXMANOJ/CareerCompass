"use client";

// =============================================================================
// Problem Log Modal — "I Solved This" feedback form
// =============================================================================

import React, { useState } from "react";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";
import { CodingProblem, UserProblemAttempt, AttemptStatus, ConfidenceLevel, PerceivedDifficulty, FrictionType, ATTEMPT_STATUS_LABELS, CONFIDENCE_LABELS, PERCEIVED_DIFFICULTY_LABELS, FRICTION_LABELS } from "@/types/problems";

interface ProblemLogModalProps {
  problem: CodingProblem;
  onClose: () => void;
  onSubmit: (attempt: UserProblemAttempt) => void;
  existingAttempt?: UserProblemAttempt | null;
}

const STATUS_OPTIONS: AttemptStatus[] = [
  "solved_independent",
  "solved_with_help",
  "attempted",
  "skipped",
];

const CONFIDENCE_OPTIONS: ConfidenceLevel[] = [
  "solved_independently",
  "solved_with_help",
  "needed_hints",
  "understood_idea",
  "couldnt_start",
];

const DIFFICULTY_OPTIONS: PerceivedDifficulty[] = [
  "too_easy",
  "right_level",
  "hard",
  "very_hard",
];

const FRICTION_OPTIONS: FrictionType[] = [
  "none",
  "concept_misunderstanding",
  "approach_failure",
  "coding_error",
  "complexity_issue",
  "edge_cases",
];

export function ProblemLogModal({
  problem,
  onClose,
  onSubmit,
  existingAttempt,
}: ProblemLogModalProps) {
  const { theme } = useCompanionTheme();

  const [status, setStatus] = useState<AttemptStatus>(existingAttempt?.status || "solved_independent");
  const [confidence, setConfidence] = useState<ConfidenceLevel>(existingAttempt?.confidence || "solved_independently");
  const [difficultyFeedback, setDifficultyFeedback] = useState<PerceivedDifficulty>(existingAttempt?.difficultyFeedback || "right_level");
  const [primaryFriction, setPrimaryFriction] = useState<FrictionType>(existingAttempt?.primaryFriction || "none");
  const [notes, setNotes] = useState(existingAttempt?.notes || "");
  const [timeSpent, setTimeSpent] = useState(existingAttempt?.timeSpentMinutes || 0);

  const handleSubmit = () => {
    const attempt: UserProblemAttempt = {
      problemId: problem.id,
      status,
      confidence,
      difficultyFeedback,
      primaryFriction,
      notes: notes.trim(),
      timeSpentMinutes: timeSpent,
      createdAt: new Date().toISOString(),
    };
    onSubmit(attempt);
    onClose();
  };

  const diffBadgeColor =
    problem.difficulty === "Easy" ? theme.success :
    problem.difficulty === "Medium" ? theme.warning :
    theme.danger;

  const providerLabel = problem.provider === "leetcode" ? "LeetCode" : problem.provider === "codeforces" ? "Codeforces" : "HackerRank";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderHighlight,
          boxShadow: theme.isLight ? theme.shadowLg : `0 0 45px ${theme.glow}`,
        }}
      >
        {/* Header */}
        <div
          className="p-5 sm:p-6 border-b flex items-start justify-between gap-4"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.border,
                  color: theme.primary,
                }}
              >
                {providerLabel}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${diffBadgeColor}18`,
                  color: diffBadgeColor,
                }}
              >
                {problem.difficulty}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: theme.text }}>
              {problem.title}
            </h2>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
              style={{ color: theme.primary }}
            >
              <ExternalLink className="w-3 h-3" /> Open on {providerLabel}
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:opacity-80 transition-opacity shrink-0"
            style={{ backgroundColor: theme.surfaceMuted, color: theme.textSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />
              What happened?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left"
                  style={{
                    backgroundColor: status === s ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: status === s ? theme.primary : theme.borderSubtle,
                    color: status === s ? theme.primary : theme.textSecondary,
                  }}
                >
                  {ATTEMPT_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              Confidence Level
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CONFIDENCE_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setConfidence(c)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
                  style={{
                    backgroundColor: confidence === c ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: confidence === c ? theme.primary : theme.borderSubtle,
                    color: confidence === c ? theme.primary : theme.textSecondary,
                  }}
                >
                  {CONFIDENCE_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Perceived Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              How hard did it feel?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFeedback(d)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
                  style={{
                    backgroundColor: difficultyFeedback === d ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: difficultyFeedback === d ? theme.primary : theme.borderSubtle,
                    color: difficultyFeedback === d ? theme.primary : theme.textSecondary,
                  }}
                >
                  {PERCEIVED_DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Friction */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
              Where did you get stuck?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FRICTION_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setPrimaryFriction(f)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
                  style={{
                    backgroundColor: primaryFriction === f ? theme.primarySoft : theme.surfaceMuted,
                    borderColor: primaryFriction === f ? theme.primary : theme.borderSubtle,
                    color: primaryFriction === f ? theme.primary : theme.textSecondary,
                  }}
                >
                  {FRICTION_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Time Spent */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              <Clock className="w-3.5 h-3.5 inline mr-1.5" />
              Time Spent (minutes)
            </label>
            <input
              type="number"
              min={0}
              max={600}
              value={timeSpent}
              onChange={(e) => setTimeSpent(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-colors"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.text,
              }}
              placeholder="e.g. 30"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-colors"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.text,
              }}
              placeholder="Key takeaway, approach used, or what to review next..."
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-5 sm:p-6 border-t flex items-center justify-end gap-3"
          style={{ borderColor: theme.borderSubtle }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-opacity hover:opacity-80"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.textSecondary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
            style={{
              backgroundColor: theme.primary,
              boxShadow: theme.isLight ? theme.shadowSm : `0 0 16px ${theme.glow}`,
            }}
          >
            <Send className="w-3.5 h-3.5" />
            Log Attempt
          </button>
        </div>
      </div>
    </div>
  );
}
