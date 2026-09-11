"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Compass, Sparkles, Target, Zap } from "lucide-react";

import { useCompanionTheme } from "@/lib/companion-theme-context";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  const { theme } = useCompanionTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto text-center py-6 sm:py-10"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
        <Sparkles className="h-4 w-4 text-purple-400" />
        <span>Welcome to CareerCompass</span>
      </div>

      <h1
        className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6"
        style={{ color: theme.text }}
      >
        Your AI Companion for <br />
        <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
          Placements & Career Growth
        </span>
      </h1>

      <p
        className="text-base sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
        style={{ color: theme.textSecondary }}
      >
        Personalized placement readiness benchmarking, AI mock interviews, tailored roadmap generation, and lifelong engineer mentoring.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 text-left">
        <div
          className="p-6 rounded-3xl border shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="h-10 w-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
            <Bot className="h-5 w-5" />
          </div>
          <h3 className="text-base font-black mb-2" style={{ color: theme.text }}>
            6 Companion Personas
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
            Choose a mentor tuned to your learning style and personality.
          </p>
        </div>

        <div
          className="p-6 rounded-3xl border shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="h-10 w-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="text-base font-black mb-2" style={{ color: theme.text }}>
            Readiness Index
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
            Live hiring bar benchmarks calibrated for your dream tech companies.
          </p>
        </div>

        <div
          className="p-6 rounded-3xl border shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="h-10 w-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-black mb-2" style={{ color: theme.text }}>
            Actionable Roadmap
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textMuted }}>
            Daily micro-missions tailored specifically to your skill gaps.
          </p>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border mb-10 shadow-md transition-colors duration-300"
        style={{
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.borderSubtle,
        }}
      >
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <Compass className="h-5 w-5 text-purple-400 shrink-0" />
          <span className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
            Estimated Setup Time:{" "}
            <strong className="font-bold" style={{ color: theme.text }}>
              2–3 minutes
            </strong>
          </span>
        </div>
        <span className="text-xs sm:text-sm font-mono" style={{ color: theme.textMuted }}>
          Step 1 of 8
        </span>
      </div>

      <button
        onClick={onNext}
        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-3"
      >
        <span>Let&apos;s Begin</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  );
}
