"use client";

import React from "react";
import { ExperienceSelection } from "@/types";
import { computePracticalProfile } from "@/lib/practical-experience";
import { Rocket, ShieldCheck, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface PracticalExperienceCardProps {
  experience: ExperienceSelection;
}

export function PracticalExperienceCard({ experience }: PracticalExperienceCardProps) {
  const { theme } = useCompanionTheme();
  const profile = computePracticalProfile(experience);

  return (
    <div
      id="experience"
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
                backgroundColor: theme.isLight ? "rgba(147, 51, 234, 0.10)" : "rgba(147, 51, 234, 0.20)",
                borderColor: "rgba(147, 51, 234, 0.35)",
                borderWidth: "1px",
                color: theme.isLight ? "#7e22ce" : "#c084fc",
              }}
            >
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.isLight ? "#7e22ce" : "#c084fc" }}
              >
                Proof of Work
              </span>
              <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                Practical Experience
              </h3>
            </div>
          </div>

          <div
            className="px-3 py-1 rounded-xl border text-xs font-extrabold uppercase font-mono"
            style={{
              backgroundColor: theme.isLight ? "rgba(147, 51, 234, 0.08)" : "rgba(147, 51, 234, 0.20)",
              borderColor: "rgba(147, 51, 234, 0.35)",
              color: theme.isLight ? "#6b21a8" : "#e9d5ff",
            }}
          >
            {profile.overallEstimate}
          </div>
        </div>

        {/* Dimension Breakdown Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
          {profile.items.map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-xs font-medium truncate" style={{ color: theme.textMuted }}>
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-bold mt-1 truncate" style={{ color: theme.text }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <p className="text-xs italic flex items-start gap-2 leading-relaxed mb-5" style={{ color: theme.textSecondary }}>
          <Info className="h-4 w-4 shrink-0 text-purple-500 mt-0.5" />
          <span>
            Based on your onboarding responses. This estimate becomes more accurate as CareerCompass verifies your work in Step 8.
          </span>
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href="/experience"
        className="w-full h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors group"
        style={{
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.borderSubtle,
          color: theme.text,
        }}
      >
        <ShieldCheck className="h-4 w-4 text-purple-500" />
        <span>View Experience & Proof</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

