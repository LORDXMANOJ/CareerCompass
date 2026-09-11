"use client";

import React, { useState } from "react";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { MENTOR_PERSONAS } from "@/constants";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { MessageSquare, Sparkles, Send, Bot } from "lucide-react";

interface CompanionCardProps {
  mentorId: string;
  advice: {
    quote: string;
    focusArea: string;
  };
}

export function CompanionCard({ mentorId, advice }: CompanionCardProps) {
  const { theme } = useCompanionTheme();
  const mentor = MENTOR_PERSONAS.find((m) => m.id === mentorId) || MENTOR_PERSONAS[0];
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Deterministic instant coach advice response
    let coachReply = "";
    const qLower = question.toLowerCase();

    if (qLower.includes("dsa") || qLower.includes("leetcode") || qLower.includes("algorithm")) {
      coachReply = `${mentor.name}: Focus on solving 2 Medium problems daily rather than 10 Easies. Quality of asymptotic trade-offs matters most.`;
    } else if (qLower.includes("resume") || qLower.includes("ats")) {
      coachReply = `${mentor.name}: Use the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'. Quantifiable metrics beat walls of buzzwords.`;
    } else if (qLower.includes("project") || qLower.includes("portfolio")) {
      coachReply = `${mentor.name}: Deploy your project live with CI/CD and automated tests. A working Vercel/Render URL commands 5x more attention than localhost code.`;
    } else {
      coachReply = `${mentor.name}: "${mentor.catchphrase}" Keep your focus on today's single mission.`;
    }

    setReply(coachReply);
  };

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.surface,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      {/* Mentor Ambient Atmospheric Lighting */}
      <div
        className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: theme.primary,
          opacity: theme.isLight ? 0.04 : 0.25,
        }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{
          backgroundColor: theme.secondary,
          opacity: theme.isLight ? 0.03 : 0.15,
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Mentor Showcase: Large Avatar + Identity Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Prominent Large Avatar with Ambient Glow Border */}
          <div className="relative shrink-0 group">
            <div
              className="p-2.5 rounded-3xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: theme.primarySoft,
                borderColor: theme.borderHighlight,
                boxShadow: theme.isLight ? theme.shadowSm : `0 8px 24px ${theme.glow}`,
              }}
            >
              <CompanionAvatar
                id={mentor.id}
                size={104}
                className="rounded-2xl shrink-0 drop-shadow-md"
                emotion="idle"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
                {mentor.name}
              </h3>
              <span
                className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.border,
                  color: theme.primary,
                }}
              >
                {theme.personalityLabel}
              </span>
            </div>

            <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>{mentor.title}</p>
            <p className="text-xs leading-relaxed max-w-lg" style={{ color: theme.textSecondary }}>{mentor.role}</p>
          </div>
        </div>

        {/* Dynamic Strategic Quote / Mentor Advice */}
        <div
          className="p-5 rounded-2xl border space-y-2 relative"
          style={{
            backgroundColor: theme.primarySoft,
            borderColor: theme.border,
          }}
        >
          <div
            className="flex items-center gap-2 text-xs font-mono uppercase font-black tracking-wider"
            style={{ color: theme.primary }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Today&apos;s Strategic Focus</span>
          </div>
          <p className="text-sm sm:text-base font-medium italic leading-relaxed" style={{ color: theme.text }}>
            &ldquo;{advice.quote}&rdquo;
          </p>
        </div>

        {/* Target Focus Pillar */}
        <div
          className="flex items-center justify-between p-3.5 rounded-2xl border text-xs"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
          }}
        >
          <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: theme.textMuted }}>
            Target Focus Pillar
          </span>
          <div className="flex items-center gap-2 font-bold" style={{ color: theme.text }}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="text-xs sm:text-sm">{advice.focusArea}</span>
          </div>
        </div>

        {/* Interactive Q&A Form */}
        {isAsking && (
          <form onSubmit={handleAsk} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder={`Ask ${mentor.name} a question about algorithms, interviews, or architecture...`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none pr-12 transition-colors"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: question ? theme.primary : theme.borderSubtle,
                  color: theme.text,
                }}
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 p-2 rounded-xl text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme.primary }}
                title="Send Question"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            {reply && (
              <div
                className="p-4 rounded-2xl border text-sm leading-relaxed space-y-1"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.primary }}>
                  <Bot className="h-3.5 w-3.5" />
                  <span>Coach Guidance:</span>
                </div>
                <p>{reply}</p>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Action Button: 46px Height, 14px Font */}
      <button
        type="button"
        onClick={() => setIsAsking(!isAsking)}
        className="w-full h-11 sm:h-12 mt-6 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm group"
        style={{
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.borderSubtle,
          color: theme.text,
        }}
      >
        <MessageSquare className="h-4 w-4 transition-colors" style={{ color: theme.primary }} />
        <span>{isAsking ? "Close Coach Dialogue" : `Consult With ${mentor.name}`}</span>
      </button>
    </div>
  );
}

