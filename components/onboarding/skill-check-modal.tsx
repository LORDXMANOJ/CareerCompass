"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { getSkillQuestion, getCompanionSkillTone } from "@/constants/skill-verification";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Brain,
} from "lucide-react";

interface SkillCheckModalProps {
  skillName: string | null;
  selectedMentorId: string;
  isOpen: boolean;
  onComplete: (skillName: string, isCorrect: boolean, selectedAnswer: string) => void;
  onClose: () => void;
}

export function SkillCheckModal({
  skillName,
  selectedMentorId,
  isOpen,
  onComplete,
  onClose,
}: SkillCheckModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state whenever a new skill modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [isOpen, skillName]);

  const mentor = useMemo(
    () => MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0],
    [selectedMentorId]
  );

  const questionData = useMemo(() => {
    if (!skillName) return null;
    return getSkillQuestion(skillName);
  }, [skillName]);

  const companionTone = useMemo(
    () => getCompanionSkillTone(mentor.id),
    [mentor.id]
  );

  if (!isOpen || !skillName || !questionData) return null;

  const isCorrect = selectedOption === questionData.correctAnswer;

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    if (!selectedOption) return;
    onComplete(skillName, isCorrect, selectedOption);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Subtle backdrop dimming */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-6 shadow-2xl shadow-purple-950/40 max-h-[90vh] overflow-y-auto"
          style={{
            borderColor: isSubmitted
              ? isCorrect
                ? "rgba(16, 185, 129, 0.45)"
                : "rgba(245, 158, 11, 0.4)"
              : `${mentor.signatureColor}35`,
          }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>Quick {skillName} Check</span>
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                </h3>
                <p className="text-[11px] text-slate-400">Basic familiarity verification</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close verification modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Companion Speech Bubble */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 mb-4">
            <CompanionAvatar id={mentor.id} size={40} className="rounded-xl shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-black text-white">{mentor.name}</span>
                <span className="text-[10px] text-slate-400">says:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {!isSubmitted
                  ? companionTone.intro
                  : isCorrect
                  ? companionTone.correctMsg
                  : companionTone.wrongMsg}
              </p>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <div className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
              {questionData.question}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-5">
            {questionData.options.map((option) => {
              const isSelected = selectedOption === option;
              const isOptionCorrect = option === questionData.correctAnswer;

              let optionStyle =
                "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white";

              if (isSubmitted) {
                if (isOptionCorrect) {
                  optionStyle = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200";
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle = "border-amber-500/80 bg-amber-950/40 text-amber-200";
                } else {
                  optionStyle = "border-slate-900 bg-slate-950/40 text-slate-600 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "border-purple-500 bg-purple-950/40 text-white shadow-md";
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                >
                  <span className="truncate">{option}</span>

                  <div className="shrink-0 flex items-center gap-1">
                    {isSubmitted ? (
                      isOptionCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isSelected ? (
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                      ) : null
                    ) : (
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-purple-400 bg-purple-600"
                            : "border-slate-700 bg-slate-950"
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Action Footer */}
          {!isSubmitted ? (
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                Skip Check
              </button>

              <button
                type="button"
                disabled={!selectedOption}
                onClick={handleCheckAnswer}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedOption
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer"
                    : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Check Answer
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-1 border-t border-slate-800/80"
            >
              {isCorrect ? (
                <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">Correct!</div>
                      <div className="text-[11px] text-slate-400">
                        {skillName} → Basic foundation verified
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +Verified
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-300">
                        Not quite — that&apos;s okay!
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {skillName} → Needs a little review
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1 border-t border-amber-500/20">
                    <strong className="text-amber-200">Correct answer: </strong>
                    {questionData.correctAnswer}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {questionData.explanation}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{isCorrect ? "Continue" : "Got it"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
