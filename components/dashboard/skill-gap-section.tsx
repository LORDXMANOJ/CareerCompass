"use client";

import React from "react";
import Link from "next/link";
import { SkillGapItem } from "@/lib/dashboard-intelligence";
import { Layers, CheckCircle2, AlertTriangle, ArrowRight, Zap, ArrowUpRight } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface SkillGapSectionProps {
  targetRoleName: string;
  strongSkills: string[];
  missingSkills: SkillGapItem[];
}

export function SkillGapSection({
  targetRoleName,
  strongSkills,
  missingSkills,
}: SkillGapSectionProps) {
  const { theme } = useCompanionTheme();

  return (
    <div
      id="skills"
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
              backgroundColor: theme.isLight ? "rgba(217, 119, 6, 0.10)" : "rgba(217, 119, 6, 0.20)",
              borderColor: "rgba(217, 119, 6, 0.35)",
              borderWidth: "1px",
              color: theme.isLight ? "#d97706" : "#fbbf24",
            }}
          >
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.isLight ? "#d97706" : "#fbbf24" }}
            >
              Role Fit Analysis
            </span>
            <h2
              className="text-lg sm:text-xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Skill Gap & Target Role Alignment
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: theme.textMuted }}>Benchmark Role:</span>
            <span
              className="px-3 py-1 rounded-xl font-extrabold text-xs"
              style={{
                backgroundColor: theme.isLight ? "rgba(139, 92, 246, 0.10)" : "rgba(139, 92, 246, 0.15)",
                borderColor: "rgba(139, 92, 246, 0.30)",
                borderWidth: "1px",
                color: theme.isLight ? "#6d28d9" : "#d8b4fe",
              }}
            >
              {targetRoleName}
            </span>
          </div>

          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.primary,
            }}
          >
            <span>View Skills & Gap</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strong Evident Skills */}
        <div
          className="lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                Evident & Aligned Skills
              </h3>
            </div>
            <p className="text-[11px] mb-4" style={{ color: theme.textSecondary }}>
              Technologies and concepts you possess that match {targetRoleName} technical requirements.
            </p>

            <div className="flex flex-wrap gap-2">
              {strongSkills.length > 0 ? (
                strongSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                    style={{
                      backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.08)" : "rgba(6, 78, 59, 0.40)",
                      borderColor: "rgba(16, 185, 129, 0.35)",
                      borderWidth: "1px",
                      color: theme.isLight ? "#047857" : "#6ee7b7",
                    }}
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs italic" style={{ color: theme.textMuted }}>
                  Select technical skills in onboarding to display overlaps.
                </span>
              )}
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border text-[11px] mt-6 leading-relaxed"
            style={{
              backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.06)" : "rgba(6, 78, 59, 0.20)",
              borderColor: "rgba(16, 185, 129, 0.20)",
              color: theme.isLight ? "#065f46" : "#a7f3d0",
            }}
          >
            <span className="font-bold">Recruiter Impact: </span>
            These competencies pass basic screening filters for junior {targetRoleName} tracks.
          </div>
        </div>

        {/* Right Column: Highest Priority Gaps */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
                Highest Priority Skill Gaps
              </h3>
            </div>
            <span className="text-[10px] font-mono" style={{ color: theme.textMuted }}>Ranked by Impact</span>
          </div>

          {missingSkills.map((item) => {
            const isHigh = item.gapIntensity === "High";

            return (
              <div
                key={item.name}
                className="p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-5 w-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
                      style={{
                        backgroundColor: theme.isLight ? "rgba(217, 119, 6, 0.12)" : "rgba(245, 158, 11, 0.20)",
                        color: theme.isLight ? "#b45309" : "#fbbf24",
                      }}
                    >
                      #{item.priority}
                    </span>
                    <h4 className="text-xs font-bold" style={{ color: theme.text }}>{item.name}</h4>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded border uppercase font-mono font-bold"
                      style={{
                        backgroundColor: isHigh
                          ? theme.isLight ? "rgba(225, 29, 72, 0.08)" : "rgba(136, 19, 55, 0.40)"
                          : theme.isLight ? "rgba(217, 119, 6, 0.08)" : "rgba(120, 53, 15, 0.40)",
                        borderColor: isHigh ? "rgba(225, 29, 72, 0.35)" : "rgba(217, 119, 6, 0.35)",
                        color: isHigh
                          ? theme.isLight ? "#be123c" : "#fda4af"
                          : theme.isLight ? "#b45309" : "#fcd34d",
                      }}
                    >
                      {item.gapIntensity} Gap
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] pl-7" style={{ color: theme.textMuted }}>
                    <span>
                      Current: <strong className="font-medium" style={{ color: theme.text }}>{item.currentLevel}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Target: <strong className="font-medium text-purple-500">{item.requiredLevel}</strong>
                    </span>
                  </div>
                </div>

                <Link
                  href="/skills"
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 group"
                  style={{
                    backgroundColor: theme.isLight ? "rgba(139, 92, 246, 0.08)" : "rgba(147, 51, 234, 0.20)",
                    borderColor: "rgba(139, 92, 246, 0.30)",
                    color: theme.isLight ? "#6d28d9" : "#d8b4fe",
                  }}
                >
                  <Zap className="h-3 w-3 text-purple-500" />
                  <span>Practice Gap</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

