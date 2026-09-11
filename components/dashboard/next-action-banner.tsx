"use client";

import React from "react";
import Link from "next/link";
import { NextBestAction } from "@/lib/dashboard-intelligence";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { Zap, Clock, Award, ArrowRight } from "lucide-react";

interface NextActionBannerProps {
  action: NextBestAction;
}

export function NextActionBanner({ action }: NextActionBannerProps) {
  const { theme } = useCompanionTheme();

  return (
    <div
      className="relative overflow-hidden p-7 sm:p-9 rounded-3xl border shadow-xl transition-all duration-300"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowLg : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Ambient background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: theme.primary,
          opacity: theme.isLight ? 0.04 : 0.20,
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span
              className="flex h-2.5 w-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: theme.primary }}
            />
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              Your Next Best Action
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono border"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
                color: theme.textAccent,
              }}
            >
              Highest Leverage
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2.5" style={{ color: theme.text }}>
            {action.title}
          </h2>

          <p className="text-sm sm:text-base font-medium leading-relaxed mb-5" style={{ color: theme.textSecondary }}>
            <strong style={{ color: theme.text }}>Why now: </strong>
            {action.reason}
          </p>

          <div className="flex items-center gap-5 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2" style={{ color: theme.textMuted }}>
              <Clock className="h-4 w-4" style={{ color: theme.primary }} />
              <span>~{action.estimatedMinutes} Minutes</span>
            </div>

            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <Award className="h-4 w-4 text-emerald-500" />
              <span>{action.impactScore}</span>
            </div>
          </div>
        </div>

        <Link
          href={action.href}
          className="h-12 px-7 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all self-start md:self-auto shrink-0 group shadow-md hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: theme.gradient,
            boxShadow: theme.isLight ? theme.shadowSm : `0 8px 25px ${theme.glow}`,
          }}
        >
          <Zap className="h-4 w-4" />
          <span>{action.buttonText}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

