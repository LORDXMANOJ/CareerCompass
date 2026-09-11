"use client";

import React from "react";
import Link from "next/link";
import { DashboardCompanyCard } from "@/lib/dashboard-intelligence";
import { CompanyLogo } from "@/components/company-logo";
import { Building2, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface CompanyReadinessSectionProps {
  companies: DashboardCompanyCard[];
}

export function CompanyReadinessSection({ companies }: CompanyReadinessSectionProps) {
  const { theme } = useCompanionTheme();

  return (
    <div
      id="companies"
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
              backgroundColor: theme.isLight ? "rgba(99, 102, 241, 0.10)" : "rgba(79, 70, 229, 0.20)",
              borderColor: "rgba(99, 102, 241, 0.35)",
              borderWidth: "1px",
              color: theme.isLight ? "#4f46e5" : "#818cf8",
            }}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.isLight ? "#4f46e5" : "#818cf8" }}
            >
              Verified Hiring Intelligence
            </span>
            <h2
              className="text-lg sm:text-xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Dream Company Preparation Index
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: theme.textMuted }}>Target Pipeline:</span>
            <span
              className="px-3 py-1 rounded-xl font-extrabold text-xs"
              style={{
                backgroundColor: theme.isLight ? "rgba(99, 102, 241, 0.10)" : "rgba(99, 102, 241, 0.15)",
                borderColor: "rgba(99, 102, 241, 0.30)",
                borderWidth: "1px",
                color: theme.isLight ? "#4338ca" : "#a5b4fc",
              }}
            >
              {companies.length} Calibrated Companies
            </span>
          </div>

          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.primary,
            }}
          >
            <span>View Company Preparation</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((item) => {
          const score = item.preparedPercent;

          return (
            <div
              key={item.company.id}
              className="p-5 rounded-2xl border transition-all flex flex-col justify-between group"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div>
                {/* Company Logo and Name */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-2xl border flex items-center justify-center p-2.5 shadow-sm"
                      style={{
                        backgroundColor: theme.isLight ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                        borderColor: theme.borderSubtle,
                      }}
                    >
                      <CompanyLogo company={item.company} size="lg" />
                    </div>
                    <div>
                      <h3
                        className="text-sm font-black transition-colors"
                        style={{ color: theme.text }}
                      >
                        {item.company.name}
                      </h3>
                      <span className="text-[10px]" style={{ color: theme.textMuted }}>
                        {item.company.category}
                      </span>
                    </div>
                  </div>

                  {/* Prepared Score Badge */}
                  <div
                    className="px-2.5 py-1 rounded-xl border font-mono font-black text-xs"
                    style={{
                      backgroundColor: score >= 80
                        ? theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(6, 78, 59, 0.40)"
                        : score >= 70
                        ? theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(30, 58, 138, 0.40)"
                        : theme.isLight ? "rgba(217, 119, 6, 0.10)" : "rgba(120, 53, 15, 0.40)",
                      borderColor: score >= 80
                        ? "rgba(16, 185, 129, 0.35)"
                        : score >= 70
                        ? "rgba(59, 130, 246, 0.35)"
                        : "rgba(217, 119, 6, 0.35)",
                      color: score >= 80
                        ? theme.isLight ? "#047857" : "#6ee7b7"
                        : score >= 70
                        ? theme.isLight ? "#1d4ed8" : "#93c5fd"
                        : theme.isLight ? "#b45309" : "#fcd34d",
                    }}
                  >
                    {score}% Prepared
                  </div>
                </div>

                {/* Overlap Context */}
                <p className="text-[11px] line-clamp-2 leading-relaxed mb-4" style={{ color: theme.textSecondary }}>
                  {item.whyReason}
                </p>

                {/* Missing Priority Skills */}
                <div
                  className="space-y-1.5 mb-5 p-3 rounded-xl border"
                  style={{
                    backgroundColor: theme.isLight ? "#ffffff" : "rgba(15, 23, 42, 0.6)",
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: theme.textMuted }}>
                    <ShieldCheck className="h-3 w-3 text-amber-500" />
                    <span>Top Missing Gaps:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missingSkills.length > 0 ? (
                      item.missingSkills.slice(0, 3).map((ms) => (
                        <span
                          key={ms}
                          className="px-2 py-0.5 rounded-md border text-[10px] font-medium"
                          style={{
                            backgroundColor: theme.surfaceMuted,
                            borderColor: theme.borderSubtle,
                            color: theme.textSecondary,
                          }}
                        >
                          • {ms}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-medium text-emerald-600">
                        ✓ Core stack strongly aligned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div
                className="pt-3 border-t flex items-center justify-between text-xs"
                style={{ borderColor: theme.borderSubtle }}
              >
                <span className="text-[10px] font-mono" style={{ color: theme.textMuted }}>
                  {item.company.hiringDifficulty}/5 Bar
                </span>
                <Link
                  href="/companies"
                  className="font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all text-xs"
                  style={{ color: theme.isLight ? "#4f46e5" : "#818cf8" }}
                >
                  <span>View Prep Plan</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

