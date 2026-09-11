"use client";

// =============================================================================
// CareerCompass — Persistent Companion Layer
// =============================================================================
// A website-wide career mentor living persistently in the bottom-right of the
// viewport across all dashboard pages. Features:
// 1. Persistent character avatar with ambient companion glow
// 2. Dismissable contextual speech bubble reflecting route & daily telemetry
// 3. Compact expanded mentor panel with action CTAs
// 4. Route awareness via usePathname()
// 5. Full companion theme integration (Athena, Nova, Atlas, Byte, Sage, Raven)
// 6. Keyboard accessibility & reduced-motion friendly
// =============================================================================

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Minimize2,
  Maximize2,
  Bot,
} from "lucide-react";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { OnboardingState } from "@/types";
import { computeAdaptivePracticeProfile } from "@/lib/problem-intelligence";
import { PROBLEMS_CATALOG } from "@/constants/problems-catalog";

interface PersistentCompanionProps {
  mentorId?: string;
  onboardingState?: OnboardingState | null;
}

interface RouteContextGuidance {
  badge: string;
  speech: string;
  panelAdvice: string;
  ctaText: string;
  ctaHref: string;
}

export function PersistentCompanion({
  mentorId: propMentorId,
  onboardingState,
}: PersistentCompanionProps) {
  const pathname = usePathname();
  const { theme, activeCompanion } = useCompanionTheme();

  // Resolve active mentor
  const resolvedMentorId = propMentorId || activeCompanion || "athena";
  const mentor = useMemo(
    () => MENTOR_PERSONAS.find((m) => m.id === resolvedMentorId) || MENTOR_PERSONAS[0],
    [resolvedMentorId]
  );

  // Companion UI state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Reset bubble visibility on route change so user gets fresh contextual advice
  useEffect(() => {
    setIsBubbleDismissed(false);
  }, [pathname]);

  // Handle ESC key to dismiss panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isPanelOpen) setIsPanelOpen(false);
        else if (!isBubbleDismissed) setIsBubbleDismissed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen, isBubbleDismissed]);

  // Safely inspect authentic practice telemetry for contextual coaching
  const practiceInsights = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("cc_problem_attempts_current_user");
      if (!raw) return null;
      const attempts = JSON.parse(raw);
      if (!Array.isArray(attempts) || attempts.length === 0) return null;
      return computeAdaptivePracticeProfile(attempts, PROBLEMS_CATALOG, onboardingState || undefined);
    } catch {
      return null;
    }
  }, [onboardingState]);

  // Deterministic route context intelligence
  const routeGuidance = useMemo<RouteContextGuidance>(() => {
    const roleName = onboardingState?.targetRole || "Software Engineer";
    const targetComp = onboardingState?.targetCompanies?.[0] || "Tier-1 Tech";

    switch (pathname) {
      case "/dashboard": {
        let speech = "Ready to continue today's missions and calibrate placement readiness.";
        let panelAdvice = `Welcome back. I am tracking your daily consistency, skill verifications, and target role progress for ${roleName}. Complete today's priority tasks to keep your readiness score climbing.`;
        if (practiceInsights) {
          if (practiceInsights.weakTopics.length > 0) {
            speech = `You've experienced friction with ${practiceInsights.weakTopics[0]} lately. Today's plan calibrates accessible problems before advancing.`;
            panelAdvice = `Adaptive coaching: ${practiceInsights.adaptiveReasoning}`;
          } else if (practiceInsights.strongTopics.length > 0) {
            speech = `Your ${practiceInsights.strongTopics[0]} performance is solid. I've increased today's challenge slightly.`;
            panelAdvice = `Adaptive coaching: ${practiceInsights.adaptiveReasoning}`;
          }
        }
        return {
          badge: "Command Center",
          speech,
          panelAdvice,
          ctaText: "Practice Daily Problems",
          ctaHref: "/problems",
        };
      }

      case "/roadmap":
        return {
          badge: "Career Roadmap",
          speech: "Your current focus is DSA consistency and fundamental system depth.",
          panelAdvice: `Roadmaps succeed through sequenced milestones. Master core algorithmic complexity and clean data structure patterns before advancing into distributed systems.`,
          ctaText: "Practice Problem Lab",
          ctaHref: "/problems",
        };

      case "/skills":
        return {
          badge: "Skills Intelligence",
          speech: "Your algorithmic foundations and verification status guide your next focus.",
          panelAdvice: `Self-reported skills only establish interest. Verified questions and real problem solve logs build undeniable employer evidence.`,
          ctaText: "Solve Gap Problems",
          ctaHref: "/problems",
        };

      case "/problems": {
        let speech = "I found practice problems matching your current gaps and target role.";
        let panelAdvice = `Focus on solving 2 to 4 Medium problems with full asymptotic analysis rather than rushing through easy solutions. Track friction notes whenever you get stuck.`;
        if (practiceInsights) {
          speech = `Current focus: ${practiceInsights.recommendedFocusTopic} (${practiceInsights.recommendedDifficulty} tier). ${practiceInsights.adaptiveReasoning}`;
          panelAdvice = `Your adaptive practice profile recommends concentrating on ${practiceInsights.recommendedFocusTopic}. Track any friction with edge cases or strategy so tomorrow's plan recalibrates accordingly.`;
        }
        return {
          badge: "Problem Lab",
          speech,
          panelAdvice,
          ctaText: "View Roadmap Phasing",
          ctaHref: "/roadmap",
        };
      }

      case "/companies":
        return {
          badge: "Target Companies",
          speech: `These companies align with your target role and technical expectations.`,
          panelAdvice: `Interview bars vary by company tier. Top product teams emphasize clean coding and system design trade-offs. Check company-specific question patterns in Problem Lab.`,
          ctaText: "Company Problems",
          ctaHref: "/problems",
        };

      case "/experience":
        return {
          badge: "Practical Experience",
          speech: "Let's strengthen the evidence behind your projects and deployment depth.",
          panelAdvice: `Recruiters look for live deployments, testing suites, and git PR hygiene. One production project with CI/CD commands more attention than ten local demos.`,
          ctaText: "Review Skill Evidence",
          ctaHref: "/skills",
        };

      case "/insights":
        return {
          badge: "Career Insights",
          speech: "Your profile indicates strong adjacent role fit vectors.",
          panelAdvice: `Look beyond a single job title. Your underlying stack and analytical fundamentals can qualify you for multiple high-growth technical tracks.`,
          ctaText: "Back to Dashboard",
          ctaHref: "/dashboard",
        };

      case "/settings":
        return {
          badge: "Workspace Settings",
          speech: "You can switch my companion persona and your visual theme here.",
          panelAdvice: `Personalize your atmosphere. Each companion has a distinct coaching voice, from Athena's academic rigor to Byte's deep system mechanics.`,
          ctaText: "Back to Dashboard",
          ctaHref: "/dashboard",
        };

      case "/onboarding":
        return {
          badge: "Onboarding Calibration",
          speech: "Let's calibrate your academic timeline, skills, and target career path.",
          panelAdvice: `Take your time to answer accurately. Your baseline readiness score and daily practice workload are derived directly from your answers.`,
          ctaText: "Continue Onboarding",
          ctaHref: "/onboarding",
        };

      default:
        return {
          badge: "Career Mentor",
          speech: `I'm standing by to guide your preparation for ${roleName} at ${targetComp}.`,
          panelAdvice: `${mentor.name}: "${mentor.catchphrase}" Let me know whenever you need guidance on your next step.`,
          ctaText: "Open Problem Lab",
          ctaHref: "/problems",
        };
    }
  }, [pathname, onboardingState, mentor, practiceInsights]);

  const handleTogglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
    // Dismiss speech bubble when panel is explicitly opened
    setIsBubbleDismissed(true);
  }, []);

  return (
    <aside
      aria-label="Career Companion Assistant"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-none"
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. Contextual Speech Bubble (Lightweight, Dismissable)              */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {!isBubbleDismissed && !isPanelOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto mb-3 max-w-[280px] sm:max-w-xs p-3.5 rounded-2xl border shadow-xl relative backdrop-blur-xl"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.borderHighlight,
              boxShadow: theme.isLight
                ? theme.shadowMd
                : `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${theme.glow}`,
            }}
          >
            {/* Ambient subtle glow inside bubble */}
            <div
              className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none blur-xl"
              style={{ backgroundColor: theme.primary }}
            />

            {/* Bubble Header & Dismiss Button */}
            <div className="flex items-center justify-between gap-2 mb-1 relative z-10">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primary }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider font-mono"
                  style={{ color: theme.primary }}
                >
                  {mentor.name} • {routeGuidance.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBubbleDismissed(true)}
                className="p-0.5 rounded-md transition-colors hover:opacity-75"
                style={{ color: theme.textSecondary }}
                aria-label="Dismiss speech bubble"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bubble Speech Content */}
            <p
              className="text-xs leading-relaxed font-medium relative z-10 cursor-pointer"
              style={{ color: theme.text }}
              onClick={handleTogglePanel}
            >
              &ldquo;{routeGuidance.speech}&rdquo;
            </p>

            {/* Quick Action Link */}
            <div className="mt-2 pt-2 border-t flex items-center justify-between relative z-10" style={{ borderColor: theme.borderSubtle }}>
              <button
                type="button"
                onClick={handleTogglePanel}
                className="text-[11px] font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
                style={{ color: theme.primary }}
              >
                <span>Ask {mentor.name}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-[10px]" style={{ color: theme.textMuted }}>
                Click avatar
              </span>
            </div>

            {/* Bottom Pointer Caret */}
            <div
              className="absolute -bottom-2 right-8 w-4 h-4 rotate-45 border-r border-b"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.borderHighlight,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Expanded Mentor Panel (Modal/Drawer Card)                        */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-label={`${mentor.name} Mentor Panel`}
            className="pointer-events-auto mb-3 w-[310px] sm:w-[360px] rounded-3xl border shadow-2xl p-5 relative backdrop-blur-2xl overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              boxShadow: theme.isLight
                ? theme.shadowLg
                : `0 20px 60px rgba(0,0,0,0.7), 0 0 35px ${theme.glow}`,
            }}
          >
            {/* Top Atmospheric Glow */}
            <div
              className="absolute top-0 inset-x-0 h-32 rounded-t-3xl blur-3xl pointer-events-none opacity-25"
              style={{ backgroundColor: theme.primary }}
            />

            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b relative z-10" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 rounded-xl flex items-center justify-center border shadow-sm"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderHighlight,
                  }}
                >
                  <Bot className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight" style={{ color: theme.text }}>
                    {mentor.name}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: theme.textSecondary }}>
                    {mentor.title} • {mentor.role}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="p-1 rounded-lg transition-colors hover:opacity-75"
                style={{ color: theme.textSecondary }}
                aria-label="Close mentor panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body: Stylized Avatar & Mentor Coaching */}
            <div className="py-4 space-y-4 relative z-10">
              {/* Mentor Avatar Showcase */}
              <div className="flex items-center gap-4">
                <div
                  className="p-2 rounded-2xl border shrink-0 relative group shadow-md"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderHighlight,
                  }}
                >
                  <CompanionAvatar
                    id={mentor.id}
                    size={72}
                    className="rounded-xl shrink-0 drop-shadow-md"
                    emotion="idle"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 border"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    {routeGuidance.badge}
                  </span>
                  <div className="text-xs italic leading-snug" style={{ color: theme.textSecondary }}>
                    &ldquo;{mentor.catchphrase}&rdquo;
                  </div>
                </div>
              </div>

              {/* Contextual Mentor Guidance Card */}
              <div
                className="p-3 rounded-xl border text-xs leading-relaxed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.borderSubtle,
                  color: theme.text,
                }}
              >
                {routeGuidance.panelAdvice}
              </div>

              {/* Persona Traits Badge Row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {mentor.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono border"
                    style={{
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.borderSubtle,
                      color: theme.textSecondary,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Panel Footer CTA Button */}
            <div className="pt-3 border-t relative z-10 flex items-center justify-between gap-3" style={{ borderColor: theme.borderSubtle }}>
              <Link
                href={routeGuidance.ctaHref}
                onClick={() => setIsPanelOpen(false)}
                className="flex-1 py-2 px-3.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: theme.primary }}
              >
                <span>{routeGuidance.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Persistent Floating Character Icon / Avatar Anchor               */}
      {/* ------------------------------------------------------------------- */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Minimize / Expand discrete toggle */}
        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="p-1.5 rounded-full border text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-md opacity-80 hover:opacity-100"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          }}
          aria-label={isMinimized ? "Expand companion" : "Minimize companion"}
        >
          {isMinimized ? (
            <Maximize2 className="w-3 h-3" />
          ) : (
            <Minimize2 className="w-3 h-3" />
          )}
        </button>

        {/* Character Avatar Button */}
        <motion.button
          type="button"
          onClick={handleTogglePanel}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-2xl border shadow-xl flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderHighlight,
            boxShadow: theme.isLight
              ? theme.shadowMd
              : `0 8px 25px rgba(0,0,0,0.6), 0 0 20px ${theme.glow}`,
          }}
          aria-label={`Open ${mentor.name} mentor coaching panel`}
        >
          {/* Ambient radial aura */}
          <div
            className="absolute inset-0 rounded-2xl opacity-25 blur-md pointer-events-none"
            style={{ backgroundColor: theme.primary }}
          />

          {/* Actual Stylized Semi-Illustrated Vector Avatar */}
          <div className="relative z-10">
            <CompanionAvatar
              id={mentor.id}
              size={isMinimized ? 44 : 64}
              className="rounded-xl shrink-0 drop-shadow-md transition-all duration-300"
              emotion="idle"
            />
          </div>

          {/* Active status pulse badge */}
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
          </span>
        </motion.button>
      </div>
    </aside>
  );
}
