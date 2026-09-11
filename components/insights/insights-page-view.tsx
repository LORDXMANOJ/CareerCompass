"use client";

import React, { useMemo } from "react";
import { OnboardingState } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { computeCareerInsights, computeNextBestAction } from "@/lib/dashboard-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import Link from "next/link";

interface InsightsPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function InsightsPageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
}: InsightsPageViewProps) {
  const { theme } = useCompanionTheme();
  const insights = useMemo(
    () => computeCareerInsights(onboardingState),
    [onboardingState]
  );
  const nextAction = useMemo(
    () => computeNextBestAction(onboardingState),
    [onboardingState]
  );

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    boxShadow: theme.isLight ? theme.shadowSm : undefined,
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "synergy":
        return <TrendingUp className="h-5 w-5 text-emerald-400" />;
      case "gap":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case "timeline":
        return <Calendar className="h-5 w-5 text-blue-400" />;
      case "market":
        return <Building2 className="h-5 w-5 text-purple-400" />;
      default:
        return <Lightbulb className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Career Insights"
      subtitle="Turn your academic profile, skill data, and target companies into clear, actionable placement decisions."
      badge="Career Intelligence Matrix"
      headerAction={
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.text,
          }}
        >
          <span>Command Center</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {/* Top Banner: Next Best Action Recommendation */}
      <div
        className="p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all"
        style={{
          ...cardStyle,
          borderColor: theme.borderHighlight,
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="flex h-2 w-2 rounded-full animate-ping"
                style={{ backgroundColor: theme.primary }}
              />
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.primary }}
              >
                Top Leverage Directive
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: theme.text }}>
              {nextAction.title}
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {nextAction.reason}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href={nextAction.href}
              className="px-6 py-3.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              style={{
                backgroundColor: theme.primary,
                boxShadow: theme.isLight ? theme.shadowSm : `0 0 20px ${theme.glow}`,
              }}
            >
              <span>{nextAction.buttonText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Key Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Synthesized Placement Drivers ({insights.length})
          </h3>
          <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
            Deterministic Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-6 rounded-3xl border flex flex-col justify-between transition-all"
              style={cardStyle}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="h-10 w-10 rounded-2xl border flex items-center justify-center"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    {getInsightIcon(insight.type)}
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    {insight.tag}
                  </span>
                </div>

                <h4 className="text-base font-black mb-2" style={{ color: theme.text }}>
                  {insight.title}
                </h4>

                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                  {insight.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: theme.borderSubtle }}>
                <span className="text-[11px] font-mono font-semibold" style={{ color: theme.textMuted }}>
                  Category: {insight.type.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold" style={{ color: theme.primary }}>
                  Active Signal
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Risk Matrix */}
      <div className="p-6 rounded-3xl border" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5" style={{ color: theme.success }} />
          <h3 className="text-base font-black" style={{ color: theme.text }}>
            Placement Risk & Mitigation Strategy
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
              Technical Bar
            </span>
            <p style={{ color: theme.textSecondary }}>
              Target companies place heavy weight on Medium DSA problem solving under timed constraints.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
              Evidence Depth
            </span>
            <p style={{ color: theme.textSecondary }}>
              Ensure your primary project has a live deployed demo URL to stand out during technical resume screening.
            </p>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
              Timeline Runway
            </span>
            <p style={{ color: theme.textSecondary }}>
              Graduating in {onboardingState.education.graduationYear}. Full-time hiring cycles typically open 9 months in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Review Placeholder Notice */}
      <div
        className="p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3"
        style={{
          backgroundColor: theme.primarySoft,
          borderColor: theme.borderHighlight,
        }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
        <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
          <strong className="font-bold" style={{ color: theme.text }}>
            Staff Review Note:
          </strong>{" "}
          Market salary intelligence, peer cohort benchmarking, and LLM-powered resume ATS feedback will integrate into this career insights canvas in future releases.
        </p>
      </div>
    </AppPageShell>
  );
}
