"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingState } from "@/types";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { getMentorCoachAdvice } from "@/lib/mentor-coach";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface MentorPanelProps {
  mentorId: string;
  step: number;
  state: OnboardingState;
}

export function MentorPanel({ mentorId, step, state }: MentorPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showExtraTip, setShowExtraTip] = useState(true);

  const { theme } = useCompanionTheme();
  const mentor = MENTOR_PERSONAS.find((m) => m.id === mentorId) || MENTOR_PERSONAS[0];
  const advice = getMentorCoachAdvice(mentor.id, step, state);

  return (
    <>
      {/* ============================================================= */}
      {/* DESKTOP PERSISTENT COACH PANEL (DEDICATED 350px COLUMN)       */}
      {/* ============================================================= */}
      <div className="w-full select-none">
        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xl relative backdrop-blur-2xl"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 30px ${theme.glow}`,
          }}
        >
          {/* Subtle Ambient Glow Behind Avatar */}
          <div
            className="absolute top-0 inset-x-0 h-48 rounded-t-3xl blur-3xl pointer-events-none opacity-25"
            style={{ backgroundColor: theme.primary }}
          />

          {/* Top Collapse Control & Step Pill */}
          <div className="p-4 pb-0 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                AI Coach • Step {step - 1} of 7
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Minimize coach panel" : "Expand coach panel"}
              className="h-7 w-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title={isExpanded ? "Minimize Coach" : "Expand Coach"}
            >
              {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Large Character Hero Showcase */}
          <div className="px-6 pt-3 pb-4 text-center flex flex-col items-center relative z-10">
            <div className="relative mb-3 group">
              <div
                className="p-3 rounded-3xl border shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.borderHighlight,
                  boxShadow: `0 8px 24px ${theme.glow}`,
                }}
              >
                <CompanionAvatar
                  id={mentor.id}
                  size={isExpanded ? 110 : 54}
                  className="rounded-2xl shrink-0 drop-shadow-lg"
                  emotion="idle"
                />
              </div>

              {/* Online Pulse Indicator */}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>

            {/* Mentor Name & Personality Badge */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight">
                {mentor.name}
              </h3>
              <p className="text-xs font-semibold text-slate-300">{mentor.title}</p>
              <div className="pt-1">
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: theme.primarySoft,
                    color: theme.primary,
                    borderColor: theme.border,
                  }}
                >
                  {theme.personalityLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Dialogue & Guidance Body */}
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                key={`advice-${step}-${mentor.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="px-6 pb-6 space-y-4 relative z-10 border-t border-slate-800/80 pt-4"
              >
                {/* Speech Bubble: Increased Typography & Contrast */}
                <div
                  className="p-4 rounded-2xl border shadow-inner space-y-2.5 relative"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.border,
                  }}
                >
                  <div
                    className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: theme.primary }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{advice.title}</span>
                  </div>

                  <p className="text-sm text-slate-100 leading-relaxed font-normal">
                    {advice.speech}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{advice.actionPrompt}</span>
                  </div>
                </div>

                {/* Stat Highlight if present */}
                {advice.statsHighlight && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">{advice.statsHighlight.label}</span>
                    <span className="font-bold text-white font-mono">
                      {advice.statsHighlight.value}
                    </span>
                  </div>
                )}

                {/* Mentor Catchphrase / Motto */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowExtraTip(!showExtraTip)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                      <span>{mentor.name}&apos;s Benchmark Philosophy</span>
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: theme.primary }}>
                      {showExtraTip ? "Hide" : "Show"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showExtraTip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="p-3.5 rounded-xl border text-xs italic leading-relaxed mt-2"
                          style={{
                            backgroundColor: theme.primarySoft,
                            borderColor: theme.border,
                            color: theme.textAccent || theme.primary,
                          }}
                        >
                          &ldquo;{mentor.catchphrase}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ============================================================= */}
      {/* MOBILE / TABLET FLOATING MENTOR PILL & BOTTOM DRAWER          */}
      {/* ============================================================= */}
      <div className="xl:hidden fixed bottom-5 right-5 z-40 select-none">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl text-white transition-all"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderHighlight,
            boxShadow: `0 0 25px ${theme.glow}`,
          }}
        >
          <div className="relative">
            <CompanionAvatar id={mentor.id} size={36} className="rounded-full" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>{mentor.name}</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase"
                style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
              >
                Coach
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Tap for advice</div>
          </div>
        </motion.button>
      </div>

      {/* Mobile Drawer / Bottom Sheet */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end"
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="w-full bg-slate-950 border-t border-slate-800 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div
                    className="p-2 rounded-2xl border"
                    style={{ backgroundColor: theme.primarySoft, borderColor: theme.border }}
                  >
                    <CompanionAvatar id={mentor.id} size={70} className="rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{mentor.name}</h3>
                    <p className="text-xs text-slate-400">{mentor.title}</p>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 inline-block"
                      style={{
                        backgroundColor: theme.primarySoft,
                        color: theme.primary,
                        borderColor: theme.border,
                      }}
                    >
                      {theme.personalityLabel}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className="p-4 rounded-2xl border space-y-2"
                  style={{ backgroundColor: theme.primarySoft, borderColor: theme.border }}
                >
                  <div
                    className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                    style={{ color: theme.primary }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{advice.title}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{advice.speech}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{advice.actionPrompt}</span>
                  </div>
                </div>

                <p className="text-xs italic text-slate-400 px-1 leading-relaxed">
                  &ldquo;{mentor.catchphrase}&rdquo;
                </p>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full h-12 rounded-xl text-white font-bold text-sm shadow-lg transition-colors flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                >
                  Got It, Continue Step
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
