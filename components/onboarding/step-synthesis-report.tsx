"use client";

import { motion } from "framer-motion";
import { ReadinessProfileSummary, MentorPersona } from "@/types";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { Sparkles, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface StepSynthesisReportProps {
  summary: ReadinessProfileSummary | null;
  selectedMentorId: string;
  isSaving?: boolean;
}

type LoadingPhase = 1 | 2 | 3 | 4;

export function StepSynthesisReport({
  selectedMentorId,
}: StepSynthesisReportProps) {
  const router = useRouter();
  const { theme } = useCompanionTheme();

  const mentor: MentorPersona =
    MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0];

  const [phase, setPhase] = useState<LoadingPhase>(1);
  const [progress, setProgress] = useState(18);
  const [takingLonger, setTakingLonger] = useState(false);
  const hasNavigated = useRef(false);

  const navigateToDashboard = useCallback(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    // Phase 1 -> Phase 2 at 800ms
    const timerPhase2 = setTimeout(() => {
      setPhase(2);
      setProgress(58);
    }, 800);

    // Phase 2 -> Phase 3 at 1800ms
    const timerPhase3 = setTimeout(() => {
      setPhase(3);
      setProgress(85);
    }, 1800);

    // Hit 100% at 2600ms
    const timer100 = setTimeout(() => {
      setProgress(100);
    }, 2600);

    // Phase 4: Deterministic navigation 1.2s after hitting 100% (3800ms total)
    const timerPhase4 = setTimeout(() => {
      setPhase(4);
      navigateToDashboard();
    }, 3800);

    // Failsafe: If asynchronous transition takes longer than 4.5s, display fallback
    const failsafeTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        setTakingLonger(true);
      }
    }, 4500);

    return () => {
      clearTimeout(timerPhase2);
      clearTimeout(timerPhase3);
      clearTimeout(timer100);
      clearTimeout(timerPhase4);
      clearTimeout(failsafeTimer);
    };
  }, [navigateToDashboard]);

  // Title and subtitle mapped deterministically to current phase
  const getPhaseContent = () => {
    switch (phase) {
      case 1:
        return {
          title: "Building Your Placement Engine...",
          subtitle: `Analyzing skill matrix & benchmarking target profiles with ${mentor.name}...`,
        };
      case 2:
        return {
          title: "Finalizing your career profile...",
          subtitle: "Calibrating target company hiring bars, verification levels & timelines...",
        };
      case 3:
      case 4:
        return {
          title: "Preparing your Career Command Center...",
          subtitle: "Synthesizing custom daily missions, skill gaps, and roadmap milestones...",
        };
    }
  };

  const { title, subtitle } = getPhaseContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto text-center py-10 sm:py-16 px-4"
    >
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-8">
        {/* Ambient Glow Background */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20"
          style={{ backgroundColor: theme.primary }}
        />

        {/* Mentor Avatar Header */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-40 scale-125"
            style={{ backgroundColor: mentor.signatureColor || theme.primary }}
          />
          <CompanionAvatar
            id={mentor.id}
            size={88}
            className="relative z-10 shadow-2xl rounded-3xl ring-2 ring-white/10"
          />
        </div>

        {/* Phase Badges (Zero decorative emojis) */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: `${theme.primary}18`,
              borderColor: `${theme.primary}40`,
              color: theme.primary,
            }}
          >
            {progress >= 100 ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            )}
            <span>
              {progress >= 100
                ? "Engine Ready"
                : `Phase ${Math.min(phase, 3)} of 3`}
            </span>
          </div>
        </div>

        {/* Dynamic Heading & Subtitle */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Deterministic Progress Bar */}
        <div className="space-y-2.5 max-w-md mx-auto">
          <div className="w-full bg-slate-900/90 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <motion.div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: theme.progressGradient,
                boxShadow: `0 0 12px ${theme.glow}`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Placement Engine Initialization</span>
            <span
              className="font-bold font-mono"
              style={{ color: theme.primary }}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* Failsafe Notice & Direct Button */}
        {takingLonger ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-left space-y-3"
          >
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <Clock className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Taking longer than expected...</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your career roadmap and diagnostic data are safely prepared. You can immediately continue to your dashboard.
            </p>
            <button
              onClick={navigateToDashboard}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: theme.primary,
                boxShadow: `0 4px 16px ${theme.glow}`,
              }}
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted local session profile synced</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
