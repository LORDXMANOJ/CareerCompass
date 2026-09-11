"use client";

import React from "react";
import { SkillsSelection } from "@/types";
import { SKILL_QUESTIONS } from "@/constants/skill-verification";
import { CheckCircle2, RotateCw, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface SkillVerificationCardProps {
  skills: SkillsSelection;
}

export function SkillVerificationCard({ skills }: SkillVerificationCardProps) {
  const { theme } = useCompanionTheme();
  const allSelectedTechs = [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.databases || []),
    ...(skills.aiTools || []),
  ];

  const verificationMap = skills.verification || {};
  const verifiedCount = allSelectedTechs.filter(
    (t) => verificationMap[t.toLowerCase()]?.isCorrect
  ).length;

  const totalCatalogQuestions = Object.keys(SKILL_QUESTIONS).length;

  return (
    <div
      className="p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      <div>
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 pb-4 mb-5 border-b"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(16, 185, 129, 0.20)",
                borderColor: "rgba(16, 185, 129, 0.35)",
                borderWidth: "1px",
                color: theme.isLight ? "#059669" : "#34d399",
              }}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.isLight ? "#059669" : "#34d399" }}
              >
                Foundational Accuracy
              </span>
              <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                Skill Verification
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div
              className="text-sm font-black font-mono"
              style={{ color: theme.isLight ? "#059669" : "#34d399" }}
            >
              {verifiedCount} / {allSelectedTechs.length || 1}
            </div>
            <div className="text-xs" style={{ color: theme.textMuted }}>Verified Basics</div>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium mb-4 leading-relaxed" style={{ color: theme.textSecondary }}>
          {totalCatalogQuestions}+ technologies verified via micro-concept questions. Basic foundations verified.
        </p>

        {/* Chips Matrix */}
        <div className="flex flex-wrap gap-2 mb-5 max-h-36 overflow-y-auto pr-1">
          {allSelectedTechs.map((tech) => {
            const key = tech.toLowerCase();
            const record = verificationMap[key];
            const isVerified = record?.isCorrect;

            return (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  backgroundColor: isVerified
                    ? theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(6, 78, 59, 0.40)"
                    : theme.surfaceMuted,
                  borderColor: isVerified
                    ? "rgba(16, 185, 129, 0.35)"
                    : theme.borderSubtle,
                  color: isVerified
                    ? theme.isLight ? "#047857" : "#6ee7b7"
                    : theme.textSecondary,
                }}
              >
                {isVerified ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <RotateCw className="h-3.5 w-3.5" style={{ color: theme.textMuted }} />
                )}
                <span>{tech}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Action */}
      <Link
        href="/skills"
        className="w-full h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors group"
        style={{
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.borderSubtle,
          color: theme.text,
        }}
      >
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span>Verify Skills Matrix</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

