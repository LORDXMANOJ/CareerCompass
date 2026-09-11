"use client";

import React, { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENTOR_PERSONAS } from "@/constants";
import { MentorPersona } from "@/types";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  Hash,
  HelpCircle,
  Lightbulb,
  Bot,
  Zap,
  Palette,
} from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { CompanionId, CompanionThemeId, COMPANION_DEFAULT_THEMES } from "@/constants/companion-themes";

interface StepCompanionProps {
  selectedMentor: string;
  onSelect: (mentorId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Typewriter Text Component with smooth blinking cursor & staggered reveal
// ---------------------------------------------------------------------------
interface TypewriterBubbleProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  accentColor?: string;
  onComplete?: () => void;
}

const TypewriterBubble = memo(function TypewriterBubble({
  text,
  delay = 0,
  speed = 15,
  className = "",
  style,
  accentColor = "#a855f7",
  onComplete,
}: TypewriterBubbleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIdx = 0;

    setDisplayedText("");
    setIsTyping(false);

    const timer = setTimeout(() => {
      setIsTyping(true);
      interval = setInterval(() => {
        currentIdx++;
        setDisplayedText(text.slice(0, currentIdx));
        if (currentIdx >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [text, delay, speed, onComplete]);

  return (
    <div className={className} style={style}>
      <span>{displayedText}</span>
      {isTyping && (
        <span
          className="inline-block w-1.5 h-3.5 ml-1 align-middle animate-pulse rounded-xs"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Discord-Style Chat Panel Component (Positive or Negative)
// ---------------------------------------------------------------------------
interface DiscordPanelProps {
  type: "positive" | "negative";
  mentor: MentorPersona;
}

const DiscordPanel = memo(function DiscordPanel({ type, mentor }: DiscordPanelProps) {
  const { theme } = useCompanionTheme();
  const isPositive = type === "positive";
  const scenario = isPositive
    ? mentor.conversationPreview.correct
    : mentor.conversationPreview.wrong;

  const headerBadgeStyle = isPositive
    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
    : "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-rose-500/10";

  const channelIconColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const userBubbleBg = isPositive
    ? (theme.isLight ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-emerald-950/30 border-emerald-800/40 text-emerald-100")
    : (theme.isLight ? "bg-rose-50 border-rose-200 text-rose-950" : "bg-rose-950/30 border-rose-800/40 text-rose-100");

  return (
    <div
      className="rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl relative h-full"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Top Glass Window Reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Discord Window Header Bar */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-3 shrink-0"
        style={{
          backgroundColor: theme.isLight ? "#f8fafc" : "rgba(2, 6, 23, 0.85)",
          borderColor: theme.borderSubtle,
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Hash className={`h-4 w-4 shrink-0 ${channelIconColor}`} />
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.text }}>
            {isPositive ? "Good Answer" : "Needs Improvement"}
          </span>
          {isPositive ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
          )}
        </div>

        {/* Mentor Emotion Tag in Header */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold shrink-0 ${headerBadgeStyle}`}
        >
          <span className={`h-2 w-2 rounded-full ${isPositive ? "bg-emerald-400" : "bg-rose-400"}`} />
          <span className="font-semibold">{scenario.emotionLabel}</span>
        </div>
      </div>

      {/* Discord Chat Body */}
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between space-y-3.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-4">
          {/* Question / Interview Prompt (Pinned Announcement Style) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="rounded-2xl p-4 border relative"
            style={{
              backgroundColor: theme.isLight ? "#f1f5f9" : "rgba(2, 6, 23, 0.70)",
              borderColor: theme.borderSubtle,
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: theme.textMuted }}>
              <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
              <span>Interview Prompt</span>
            </div>
            <p className="text-sm lg:text-[15px] font-semibold leading-relaxed" style={{ color: theme.text }}>
              {scenario.question}
            </p>
          </motion.div>

          {/* Student Answer Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="flex items-start gap-3.5"
          >
            {/* User Avatar */}
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 border border-purple-400/40 text-white flex items-center justify-center shrink-0 text-xs shadow-md">
              <User className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: theme.text }}>You (Student)</span>
                <span className="text-[10px]" style={{ color: theme.textMuted }}>Technical Round</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl rounded-tl-xs border text-xs sm:text-sm leading-relaxed font-medium shadow-sm ${userBubbleBg}`}
              >
                &ldquo;{scenario.userAnswer}&rdquo;
              </div>
            </div>
          </motion.div>

          {/* Mentor Response Row with Alive Expressive Avatar */}
          <div className="flex items-start gap-3.5 pt-2">
            {/* Expressive Mentor Avatar with Slide-Up Motion */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
              className="relative shrink-0"
            >
              <div
                className="p-1.5 rounded-2xl border shadow-lg"
                style={{
                  backgroundColor: `${mentor.signatureColor}18`,
                  borderColor: `${mentor.signatureColor}40`,
                }}
              >
                <CompanionAvatar
                  id={mentor.id}
                  size={88}
                  emotion={isPositive ? "correct" : "wrong"}
                />
              </div>

              {/* Status indicator floating badge */}
              <div
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border border-slate-950 flex items-center justify-center shadow-md"
                style={{ backgroundColor: mentor.signatureColor }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </motion.div>

            {/* Mentor Speech Bubbles */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs sm:text-sm font-bold tracking-tight"
                  style={{ color: mentor.signatureColor }}
                >
                  {mentor.name}
                </span>

                <span
                  className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex items-center gap-0.5"
                  style={{
                    backgroundColor: `${mentor.signatureColor}25`,
                    color: mentor.signatureColor,
                  }}
                >
                  <Bot className="h-2.5 w-2.5" />
                  <span>Coach</span>
                </span>

                <span className="text-[10px]" style={{ color: theme.textMuted }}>Evaluation</span>
              </div>

              {/* Staggered Typewriter Bubbles */}
              <div className="space-y-2">
                {scenario.companionResponse.map((bubble, i) => (
                  <motion.div
                    key={`${mentor.id}-${type}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.45 + i * 0.22,
                    }}
                  >
                    <TypewriterBubble
                      text={bubble}
                      delay={450 + i * 400}
                      speed={14}
                      accentColor={mentor.signatureColor}
                      className="px-4 py-3 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed border font-normal shadow-sm"
                      style={{
                        backgroundColor: `${mentor.signatureColor}${theme.isLight ? "15" : "12"}`,
                        borderColor: `${mentor.signatureColor}${theme.isLight ? "40" : "30"}`,
                        color: theme.text,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discord Embed: Key Coaching Takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.0 }}
          className="mt-4 pt-3 border-t shrink-0"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div
            className={`p-3.5 rounded-2xl border-l-4 border text-xs sm:text-[13px] leading-relaxed ${
              isPositive
                ? "border-l-emerald-400"
                : "border-l-rose-400"
            }`}
            style={{
              backgroundColor: theme.isLight ? "#f8fafc" : "rgba(2, 6, 23, 0.60)",
              borderColor: theme.borderSubtle,
              borderLeftColor: isPositive ? "#10b981" : "#f43f5e",
              color: theme.textSecondary,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Lightbulb
                className={`h-4 w-4 ${
                  isPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              />
              <span className={isPositive ? "text-emerald-500" : "text-rose-500"}>
                {isPositive ? "Key Strength Highlighted" : "Actionable Improvement Rule"}
              </span>
            </div>
            <p className="font-normal" style={{ color: theme.textSecondary }}>{scenario.takeaway}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

// ---------------------------------------------------------------------------
// Compact Coach Card for Fixed Right-Hand Dock
// ---------------------------------------------------------------------------
interface CompactCoachCardProps {
  mentor: MentorPersona;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
}

const CompactCoachCard = memo(function CompactCoachCard({
  mentor,
  isSelected,
  onSelect,
  onHover,
}: CompactCoachCardProps) {
  const { theme } = useCompanionTheme();

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${mentor.name}, ${mentor.title}`}
      tabIndex={0}
      onClick={() => onSelect(mentor.id)}
      onMouseEnter={() => onHover?.(mentor.id)}
      onMouseLeave={() => onHover?.(null)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
      className="group relative w-full text-left p-3.5 sm:p-4 rounded-3xl border transition-all duration-200 flex items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      style={{
        backgroundColor: isSelected
          ? (theme.isLight ? "#ffffff" : "rgba(30, 41, 59, 0.95)")
          : theme.surfaceMuted,
        borderColor: isSelected ? mentor.signatureColor : theme.borderSubtle,
        boxShadow: isSelected
          ? `0 0 28px ${mentor.glowColor}, 0 10px 24px ${theme.isLight ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.6)"}`
          : undefined,
      }}
    >
      {/* Animated Highlight Accent Bar behind selected card */}
      {isSelected && (
        <motion.div
          layoutId="activeCoachHighlight"
          className="absolute inset-0 rounded-3xl pointer-events-none -z-10"
          style={{
            background: `linear-gradient(135deg, ${mentor.signatureColor}20 0%, transparent 80%)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Prominent Coach Avatar (96px) with Alive Breathing Idle State */}
      <div className="relative shrink-0">
        <div
          className="p-1.5 rounded-2xl border transition-all shadow-md group-hover:scale-105"
          style={{
            backgroundColor: isSelected ? `${mentor.signatureColor}20` : (theme.isLight ? "rgba(241, 245, 249, 0.9)" : "rgba(15,23,42,0.6)"),
            borderColor: isSelected ? `${mentor.signatureColor}60` : theme.borderSubtle,
          }}
        >
          <CompanionAvatar id={mentor.id} size={96} emotion="idle" />
        </div>

        {/* Small Status Indicator Dot */}
        <div
          className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: mentor.signatureColor }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Coach Name, Subtitle & Personality Badge */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-black text-base sm:text-lg tracking-tight transition-colors truncate"
            style={{ color: isSelected ? (theme.isLight ? "#0f172a" : "#ffffff") : theme.text }}
          >
            {mentor.name}
          </span>

          {isSelected && (
            <span
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
              style={{
                backgroundColor: `${mentor.signatureColor}25`,
                color: mentor.signatureColor,
                borderColor: `${mentor.signatureColor}50`,
              }}
            >
              Active
            </span>
          )}
        </div>

        <div className="text-xs font-semibold truncate" style={{ color: theme.textSecondary }}>
          {mentor.title}
        </div>

        <div className="text-[11px] line-clamp-1 italic" style={{ color: theme.textMuted }}>
          &ldquo;{mentor.catchphrase}&rdquo;
        </div>

        <div className="pt-0.5 flex items-center gap-1.5 flex-wrap">
          <span
            className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${mentor.signatureColor}15`,
              color: mentor.signatureColor,
              borderColor: `${mentor.signatureColor}35`,
            }}
          >
            {mentor.role}
          </span>
          <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: theme.textMuted }}>
            <span>Theme:</span>
            <span className="font-medium" style={{ color: theme.textSecondary }}>
              {COMPANION_DEFAULT_THEMES[mentor.id as CompanionThemeId]?.label}
            </span>
          </span>
        </div>
      </div>

      {/* Status Radio Indicator */}
      <div className="shrink-0 flex items-center justify-center pl-1">
        <div
          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "border-transparent scale-110"
              : "border-slate-600 group-hover:border-slate-400"
          }`}
          style={{
            backgroundColor: isSelected ? mentor.signatureColor : "transparent",
            boxShadow: isSelected ? `0 0 10px ${mentor.signatureColor}` : undefined,
          }}
        >
          {isSelected ? (
            <div className="h-2 w-2 rounded-full bg-white shadow-xs" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
          )}
        </div>
      </div>
    </motion.button>
  );
});

// ---------------------------------------------------------------------------
// Main StepCompanion Component: Full-Page Edge-To-Edge Master-Detail Layout
// ---------------------------------------------------------------------------
export function StepCompanion({
  selectedMentor,
  onSelect,
  onNext,
  onBack,
}: StepCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCompanion, setPreviewCompanion, theme } = useCompanionTheme();

  // Active mentor data object
  const activeMentor = useMemo(() => {
    return (
      MENTOR_PERSONAS.find((m) => m.id === selectedMentor) || MENTOR_PERSONAS[0]
    );
  }, [selectedMentor]);

  const handleSelectMentor = useCallback(
    (mentorId: string) => {
      onSelect(mentorId);
      setCompanion(mentorId as CompanionId);
    },
    [onSelect, setCompanion]
  );

  // Keyboard navigation across the 6 mentors
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = MENTOR_PERSONAS.findIndex((m) => m.id === selectedMentor);
      if (currentIndex === -1) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % MENTOR_PERSONAS.length;
        handleSelectMentor(MENTOR_PERSONAS[nextIdx].id);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIdx =
          (currentIndex - 1 + MENTOR_PERSONAS.length) % MENTOR_PERSONAS.length;
        handleSelectMentor(MENTOR_PERSONAS[prevIdx].id);
      }
    },
    [selectedMentor, handleSelectMentor]
  );

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="w-full h-full flex flex-col lg:flex-row relative outline-none overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--cc-bg, #030712)", color: "var(--cc-text, #f8fafc)" }}
    >
      {/* =================================================================== */}
      {/* LEFT / CENTER PREVIEW AREA: Utilizes full remaining screen width   */}
      {/* =================================================================== */}
      <div className="flex-1 h-full p-3 sm:p-5 lg:p-6 flex flex-col justify-between overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative z-10">
        {/* Dynamic Ambient Glow Aura that smoothly interpolates mentor signature color */}
        <motion.div
          className="absolute -inset-10 rounded-full pointer-events-none blur-[160px] opacity-25 -z-10 transition-colors duration-700"
          animate={{
            backgroundColor: activeMentor.signatureColor,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Top Header Bar inside Preview: Mentor Identity & Catchphrase */}
        <div className="flex items-center justify-between gap-4 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Step 2 of 8 — AI Coach Selection</span>
            </div>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span
              className="text-xs font-medium hidden sm:inline truncate max-w-md"
              style={{ color: theme.textSecondary }}
            >
              &ldquo;{activeMentor.catchphrase}&rdquo;
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs shadow-sm border"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              <Palette className="h-3.5 w-3.5" style={{ color: activeMentor.signatureColor }} />
              <span>Recommended Theme:</span>
              <strong style={{ color: theme.text }} className="font-semibold">
                {COMPANION_DEFAULT_THEMES[activeMentor.id as CompanionThemeId]?.label}
              </strong>
              <span className="text-[10px] text-slate-500 hidden xl:inline">• Customizable in Settings</span>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeMentor.badgeColor}`}
            >
              {activeMentor.name} • {activeMentor.title}
            </span>
          </div>
        </div>

        {/* AnimatePresence with Cinematic Slide Transition:
            - Current slides LEFT (<---) and fades out (300ms)
            - New slides in from RIGHT (--->) and fades in (350ms)
            - Right dock stays completely stationary!
        */}
        <div className="flex-1 min-h-0 relative flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMentor.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{
                x: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.3, ease: "easeInOut" },
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 h-full"
            >
              {/* Left Panel: Positive Feedback (Good Answer) */}
              <DiscordPanel type="positive" mentor={activeMentor} />

              {/* Right Panel: Negative Feedback (Needs Improvement) */}
              <DiscordPanel type="negative" mentor={activeMentor} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Status & Info Bar (Visible on mobile/tablet) */}
        <div
          className="pt-4 flex lg:hidden items-center justify-between border-t shrink-0 mt-3"
          style={{ borderColor: theme.borderSubtle }}
        >
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border text-xs font-semibold transition-colors"
            style={{ borderColor: theme.borderSubtle, color: theme.textSecondary }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg flex items-center gap-2"
            style={{ backgroundColor: activeMentor.signatureColor }}
          >
            <span>Continue with {activeMentor.name}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT-HAND COMPANION DOCK: Full height, expanded width             */}
      {/* =================================================================== */}
      <div
        className="w-full lg:w-[440px] xl:w-[480px] 2xl:w-[520px] h-auto lg:h-full shrink-0 flex flex-col justify-between p-4 sm:p-6 border-t lg:border-t-0 lg:border-l rounded-tl-[36px] backdrop-blur-2xl shadow-2xl relative z-20 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-colors duration-300"
        style={{
          backgroundColor: theme.isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.8)",
          borderColor: theme.border,
        }}
      >
        <div className="space-y-4">
          {/* Right Dock Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <h4
                className="text-xs sm:text-sm font-black uppercase tracking-wider"
                style={{ color: theme.text }}
              >
                Available Companions
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.textSecondary,
              }}
            >
              {MENTOR_PERSONAS.length} Mentors
            </span>
          </div>

          {/* 6 Companions Stacked Vertically */}
          <div
            role="radiogroup"
            aria-label="Choose your AI Companion"
            className="space-y-2.5"
          >
            {MENTOR_PERSONAS.map((mentor) => (
              <CompactCoachCard
                key={mentor.id}
                mentor={mentor}
                isSelected={selectedMentor === mentor.id}
                onSelect={handleSelectMentor}
                onHover={(id) => setPreviewCompanion(id as CompanionId | null)}
              />
            ))}
          </div>
        </div>

        {/* Right Dock Footer: Primary Action & Navigation Buttons */}
        <div
          className="pt-5 border-t space-y-3 shrink-0"
          style={{ borderColor: theme.borderSubtle }}
        >
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedMentor}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            style={{
              backgroundColor: activeMentor.signatureColor,
              boxShadow: `0 8px 24px ${activeMentor.glowColor}`,
            }}
          >
            <span>Lock In {activeMentor.name} & Continue</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{ color: theme.textSecondary }}
            >
              ← Back to Welcome
            </button>

            <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
              You can switch mentors anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
