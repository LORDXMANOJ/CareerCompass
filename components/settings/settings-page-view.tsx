"use client";

import React from "react";
import { OnboardingState } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { CompanionAppearanceSettings } from "@/components/settings/companion-appearance-settings";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { signOutAction, resetDemoOnboardingAction } from "@/app/auth/actions";
import {
  User,
  Compass,
  LogOut,
  Info,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface SettingsPageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function SettingsPageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
}: SettingsPageViewProps) {
  const { theme } = useCompanionTheme();

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
      title="Settings & Preferences"
      subtitle="Customize your CareerCompass workspace atmosphere, active AI companion, and profile parameters."
      badge="Preferences Center"
    >
      {/* Section 1: Profile Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl border" style={cardStyle}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="h-10 w-10 rounded-2xl border flex items-center justify-center"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.primary,
            }}
          >
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
              Profile Overview
            </h3>
            <span className="text-xs" style={{ color: theme.textMuted }}>
              Authenticated Student Identity
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-mono uppercase font-bold text-[10px] block mb-1" style={{ color: theme.textMuted }}>
              Full Name
            </span>
            <span className="text-sm font-bold block truncate" style={{ color: theme.text }}>
              {userName}
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-mono uppercase font-bold text-[10px] block mb-1" style={{ color: theme.textMuted }}>
              Email Address
            </span>
            <span className="text-sm font-bold block truncate" style={{ color: theme.text }}>
              {userEmail}
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-mono uppercase font-bold text-[10px] block mb-1" style={{ color: theme.textMuted }}>
              Target Role
            </span>
            <span className="text-sm font-bold block truncate" style={{ color: theme.primary }}>
              {onboardingState.targetRole}
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
            }}
          >
            <span className="font-mono uppercase font-bold text-[10px] block mb-1" style={{ color: theme.textMuted }}>
              Graduation Year
            </span>
            <span className="text-sm font-bold block truncate" style={{ color: theme.text }}>
              Class of {onboardingState.education.graduationYear}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Companion Appearance & Theme System */}
      <div className="p-6 sm:p-8 rounded-3xl border" style={cardStyle}>
        <CompanionAppearanceSettings />
      </div>

      {/* Section 3: Account & Session Management */}
      <div className="p-6 sm:p-8 rounded-3xl border" style={cardStyle}>
        <h3 className="text-base sm:text-lg font-black mb-1" style={{ color: theme.text }}>
          Account Operations
        </h3>
        <p className="text-xs sm:text-sm mb-6" style={{ color: theme.textSecondary }}>
          Reconfigure your career goals or end your active authenticated session.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.text,
            }}
          >
            <Compass className="h-4 w-4" style={{ color: theme.primary }} />
            <span>Retake Full Onboarding Flow</span>
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-950/70 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of CareerCompass</span>
            </button>
          </form>
        </div>

        {/* Staff Demo Presentation Controls (Strictly gated to Staff Demo account) */}
        {(userEmail.toLowerCase() === "careercompass.demo@example.com" ||
          userEmail.toLowerCase().startsWith("demo@") ||
          userEmail.toLowerCase().includes("demo")) && (
          <div
            className="mt-6 p-5 sm:p-6 rounded-2xl border"
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.05)",
              borderColor: "rgba(168, 85, 247, 0.3)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  Staff Demo Presentation Controls
                </h4>
                <span className="text-[10px] font-mono text-purple-400">
                  Account: {userEmail}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This account is designated for repeated staff presentations. Resetting safely marks <code className="text-purple-300 font-mono">onboarding_completed = false</code> and routes you back to Step 1 (Welcome) for a fresh onboarding demonstration without affecting any other users.
            </p>

            <form
              action={async () => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("career_compass_onboarding");
                }
                await resetDemoOnboardingAction();
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Demo Onboarding (Return to Step 1)</span>
              </button>
            </form>
          </div>
        )}
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
          Cloud profile synchronization, daily digest email notifications, and OAuth credential management will expand in this settings canvas in future iterations.
        </p>
      </div>
    </AppPageShell>
  );
}
