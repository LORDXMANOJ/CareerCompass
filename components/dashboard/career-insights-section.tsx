"use client";

import React from "react";
import Link from "next/link";
import { CareerInsight } from "@/lib/dashboard-intelligence";
import { Sparkles, Lightbulb, TrendingUp, Compass, ArrowUpRight } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface CareerInsightsSectionProps {
  insights: CareerInsight[];
}

export function CareerInsightsSection({ insights }: CareerInsightsSectionProps) {
  const { theme } = useCompanionTheme();

  return (
    <div
      id="insights"
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
              backgroundColor: theme.isLight ? "rgba(13, 148, 136, 0.10)" : "rgba(13, 148, 136, 0.20)",
              borderColor: "rgba(13, 148, 136, 0.35)",
              borderWidth: "1px",
              color: theme.isLight ? "#0d9488" : "#2dd4bf",
            }}
          >
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.isLight ? "#0d9488" : "#2dd4bf" }}
            >
              Deterministic Intelligence
            </span>
            <h2
              className="text-lg sm:text-xl font-black tracking-tight"
              style={{ color: theme.text }}
            >
              Strategic Career Insights
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-xl font-extrabold text-xs"
            style={{
              backgroundColor: theme.isLight ? "rgba(13, 148, 136, 0.10)" : "rgba(13, 148, 136, 0.15)",
              borderColor: "rgba(13, 148, 136, 0.30)",
              borderWidth: "1px",
              color: theme.isLight ? "#0f766e" : "#5eead4",
            }}
          >
            3 Calibrated Insights
          </span>

          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.primary,
            }}
          >
            <span>View Career Insights</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3 Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((ins, idx) => {
          const icon =
            idx === 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : idx === 1 ? (
              <Sparkles className="h-4 w-4 text-purple-500" />
            ) : (
              <Compass className="h-4 w-4 text-blue-500" />
            );

          return (
            <div
              key={ins.id}
              className="p-5 rounded-2xl border transition-all flex flex-col justify-between"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className="h-8 w-8 rounded-xl border flex items-center justify-center"
                    style={{
                      backgroundColor: theme.isLight ? "#ffffff" : "rgba(30, 41, 59, 0.8)",
                      borderColor: theme.borderSubtle,
                    }}
                  >
                    {icon}
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                    style={{
                      backgroundColor: theme.isLight ? "rgba(13, 148, 136, 0.08)" : "rgba(13, 148, 136, 0.20)",
                      borderColor: "rgba(13, 148, 136, 0.30)",
                      color: theme.isLight ? "#0f766e" : "#2dd4bf",
                    }}
                  >
                    {ins.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-2" style={{ color: theme.text }}>
                  {ins.title}
                </h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: theme.textSecondary }}>
                  {ins.description}
                </p>
              </div>

              <div
                className="pt-4 border-t mt-4 text-[10px] font-mono"
                style={{ borderColor: theme.borderSubtle, color: theme.textMuted }}
              >
                Calibrated against active cohort data
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

