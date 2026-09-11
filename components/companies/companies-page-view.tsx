"use client";

import React, { useMemo, useState } from "react";
import { OnboardingState } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { computeCompanyReadinessCards, DashboardCompanyCard } from "@/lib/dashboard-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { CompanyLogo } from "@/components/company-logo";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface CompaniesPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function CompaniesPageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
}: CompaniesPageViewProps) {
  const { theme } = useCompanionTheme();
  const [selectedPlanCompany, setSelectedPlanCompany] = useState<DashboardCompanyCard | null>(null);

  const companyCards = useMemo(
    () => computeCompanyReadinessCards(onboardingState),
    [onboardingState]
  );

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    boxShadow: theme.isLight ? theme.shadowSm : undefined,
  };

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Target Companies"
      subtitle="Prepare strategically for the tier-1 engineering companies you want to work for."
      badge="Company Intelligence Engine"
      headerAction={
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.text,
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Edit Target Companies</span>
        </Link>
      }
    >
      {/* Top Company Benchmarks Summary */}
      <div className="p-6 sm:p-8 rounded-3xl border" style={cardStyle}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block mb-1"
              style={{ color: theme.primary }}
            >
              Hiring Bar Target
            </span>
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: theme.text }}>
              Targeting {companyCards.length} Tier-1 Tech Organizations
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textSecondary }}>
              Evaluation tailored for your desired {onboardingState.targetRole} role.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="p-4 rounded-2xl border text-center min-w-[130px]"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase block" style={{ color: theme.textMuted }}>
                Companies Added
              </span>
              <span className="text-2xl font-black font-mono" style={{ color: theme.primary }}>
                {companyCards.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyCards.map((card) => {
          const comp = card.company;

          return (
            <div
              key={comp.id}
              className="p-6 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden group hover:scale-[1.01]"
              style={cardStyle}
            >
              <div>
                {/* Header with Logo */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <CompanyLogo company={comp} size="lg" className="rounded-2xl shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black truncate" style={{ color: theme.text }}>
                        {comp.name}
                      </h3>
                      <span className="text-xs font-medium truncate block" style={{ color: theme.textMuted }}>
                        {comp.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase shrink-0 border"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                      color: theme.primary,
                    }}
                  >
                    {card.hiringStatus}
                  </span>
                </div>

                {/* Readiness Percentage Gauge */}
                <div
                  className="mb-5 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span style={{ color: theme.textSecondary }}>Hiring Bar Preparedness</span>
                    <span className="font-mono text-sm" style={{ color: theme.primary }}>
                      {card.preparedPercent}%
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: theme.isLight ? "#e2e8f0" : "rgba(30, 41, 59, 0.8)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${card.preparedPercent}%`,
                        background: theme.gradient,
                      }}
                    />
                  </div>
                </div>

                {/* Key Skills & Gaps */}
                <div className="space-y-3 mb-6 text-xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.textMuted }}>
                      Matched Stack
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {card.matchedSkills.length > 0 ? (
                        card.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center gap-1"
                            style={{
                              backgroundColor: theme.isLight ? "rgba(16, 185, 129, 0.1)" : "rgba(6, 78, 59, 0.3)",
                              borderColor: "rgba(16, 185, 129, 0.3)",
                              color: theme.success,
                            }}
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic" style={{ color: theme.textMuted }}>
                          No direct skill overlap found
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.textMuted }}>
                      Key Preparation Focus
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {card.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center gap-1"
                          style={{
                            backgroundColor: theme.isLight ? "rgba(245, 158, 11, 0.1)" : "rgba(120, 53, 15, 0.3)",
                            borderColor: "rgba(245, 158, 11, 0.3)",
                            color: theme.warning,
                          }}
                        >
                          <AlertCircle className="h-2.5 w-2.5" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setSelectedPlanCompany(card)}
                className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                }}
              >
                <span>View Preparation Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Preparation Plan Modal Placeholder */}
      {selectedPlanCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-2xl max-w-lg w-full relative"
            style={cardStyle}
          >
            <div className="flex items-center gap-3 mb-4">
              <CompanyLogo company={selectedPlanCompany.company} size="md" className="rounded-xl" />
              <div>
                <h3 className="text-lg font-black" style={{ color: theme.text }}>
                  {selectedPlanCompany.company.name} Interview Roadmap
                </h3>
                <span className="text-xs" style={{ color: theme.textMuted }}>
                  Staff Demonstration Preview
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: theme.textSecondary }}>
              {selectedPlanCompany.whyReason}
            </p>

            <div className="space-y-2 mb-6">
              {["Online Assessment (OA)", "Technical Round 1: Core Problem Solving", "Technical Round 2: System Architecture", "Managerial & Culture Bar"].map((round, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border text-xs flex items-center justify-between"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <span className="font-medium" style={{ color: theme.text }}>{round}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: theme.primary }}>Stage {i + 1}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlanCompany(null)}
              className="w-full py-3 rounded-xl text-white font-bold text-xs"
              style={{ backgroundColor: theme.primary }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

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
          Company-specific curated question sets, OA simulator practice, and salary compensation breakdowns will be connected to this company template in future phases.
        </p>
      </div>
    </AppPageShell>
  );
}
