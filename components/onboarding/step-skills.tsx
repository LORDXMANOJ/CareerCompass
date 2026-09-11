"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SkillsSelection, SkillVerificationRecord } from "@/types";
import { TECH_LANGUAGES, TECH_FRAMEWORKS, TECH_DATABASES, AI_TOOLS } from "@/constants";
import {
  Check,
  Sparkles,
  Code2,
  Layers,
  Database,
  Bot,
  RotateCcw,
  ShieldCheck,
  Brain,
} from "lucide-react";
import { SkillCheckModal } from "@/components/onboarding/skill-check-modal";

interface StepSkillsProps {
  skills: SkillsSelection;
  selectedMentorId?: string;
  onChange: (updated: SkillsSelection) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepSkills({
  skills,
  selectedMentorId = "athena",
  onChange,
  onNext,
  onBack,
}: StepSkillsProps) {
  const [verifyingSkill, setVerifyingSkill] = useState<{
    category: "languages" | "frameworks" | "databases" | "aiTools";
    name: string;
  } | null>(null);

  const handleSkillClick = (
    category: "languages" | "frameworks" | "databases" | "aiTools",
    item: string
  ) => {
    const isSelected = (skills[category] || []).includes(item);
    const hasVerification = skills.verification?.[item];

    if (isSelected) {
      // If already selected, clicking it toggles it off
      const updatedList = (skills[category] || []).filter((i) => i !== item);
      onChange({
        ...skills,
        [category]: updatedList,
      });
      return;
    }

    // If already verified during this onboarding session, reuse existing verification
    if (hasVerification) {
      const updatedList = [...(skills[category] || []), item];
      onChange({
        ...skills,
        [category]: updatedList,
      });
      return;
    }

    // First-time selection: trigger micro skill verification check!
    setVerifyingSkill({ category, name: item });
  };

  const handleVerificationComplete = (
    skillName: string,
    isCorrect: boolean,
    selectedAnswer: string
  ) => {
    if (!verifyingSkill) return;

    const record: SkillVerificationRecord = {
      status: isCorrect ? "verified_basic" : "needs_review",
      selectedAnswer,
      isCorrect,
      verifiedAt: new Date().toISOString(),
    };

    const currentList = skills[verifyingSkill.category] || [];
    const updatedList = currentList.includes(skillName)
      ? currentList
      : [...currentList, skillName];

    const updatedVerification = {
      ...(skills.verification || {}),
      [skillName]: record,
    };

    onChange({
      ...skills,
      [verifyingSkill.category]: updatedList,
      verification: updatedVerification,
    });

    setVerifyingSkill(null);
  };

  const handleSkipVerification = () => {
    if (!verifyingSkill) return;
    const currentList = skills[verifyingSkill.category] || [];
    const updatedList = currentList.includes(verifyingSkill.name)
      ? currentList
      : [...currentList, verifyingSkill.name];

    onChange({
      ...skills,
      [verifyingSkill.category]: updatedList,
    });

    setVerifyingSkill(null);
  };

  const totalSelected =
    (skills.languages?.length || 0) +
    (skills.frameworks?.length || 0) +
    (skills.databases?.length || 0) +
    (skills.aiTools?.length || 0);

  const totalVerifiedBasic = Object.values(skills.verification || {}).filter(
    (v) => v.status === "verified_basic"
  ).length;

  const renderSkillButton = (
    category: "languages" | "frameworks" | "databases" | "aiTools",
    item: string,
    categoryTheme: {
      selectedBg: string;
      selectedBorder: string;
      shadow: string;
    }
  ) => {
    const isSelected = (skills[category] || []).includes(item);
    const verification = skills.verification?.[item];
    const isCurrentlyVerifying = verifyingSkill?.name === item;

    return (
      <button
        key={item}
        type="button"
        onClick={() => handleSkillClick(category, item)}
        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
          isCurrentlyVerifying
            ? "ring-2 ring-purple-400 bg-purple-950/60 border border-purple-400 text-white shadow-lg shadow-purple-900/50 scale-[1.02]"
            : isSelected
            ? `${categoryTheme.selectedBg} border ${categoryTheme.selectedBorder} text-white shadow-md ${categoryTheme.shadow}`
            : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
        }`}
      >
        <span>{item}</span>

        {isSelected && (
          <>
            {verification?.status === "verified_basic" ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Basic verified</span>
              </span>
            ) : verification?.status === "needs_review" ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                <RotateCcw className="h-3 w-3 text-amber-400" />
                <span>Needs review</span>
              </span>
            ) : (
              <Check className="h-3.5 w-3.5 text-white" />
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Step 6 of 8 • Technical Stack</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
            Current Tech Stack & Tools
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Select technologies you know or are currently learning. Each new selection triggers a
            quick fundamental check with your mentor.
          </p>

          {/* Micro Verification Counter Pill */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-inner">
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-purple-400" />
              <span>{totalSelected} Technologies Selected</span>
            </span>
            <span className="h-3 w-px bg-slate-800" />
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{totalVerifiedBasic} Verified</span>
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-5 mb-8">
          {/* Programming Languages */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                <span>Programming Languages</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {skills.languages?.length || 0} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_LANGUAGES.map((lang) =>
                renderSkillButton("languages", lang, {
                  selectedBg: "bg-purple-600",
                  selectedBorder: "border-purple-400",
                  shadow: "shadow-purple-950/40",
                })
              )}
            </div>
          </div>

          {/* Frameworks & Libraries */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-400" />
                <span>Frameworks & Libraries</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {skills.frameworks?.length || 0} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_FRAMEWORKS.map((fw) =>
                renderSkillButton("frameworks", fw, {
                  selectedBg: "bg-blue-600",
                  selectedBorder: "border-blue-400",
                  shadow: "shadow-blue-950/40",
                })
              )}
            </div>
          </div>

          {/* Databases */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Databases & Cloud Storage</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {skills.databases?.length || 0} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_DATABASES.map((db) =>
                renderSkillButton("databases", db, {
                  selectedBg: "bg-emerald-600",
                  selectedBorder: "border-emerald-400",
                  shadow: "shadow-emerald-950/40",
                })
              )}
            </div>
          </div>

          {/* AI & Developer Tools */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.08)] transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-400" />
                <span>AI Assistants & IDE Tools</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {skills.aiTools?.length || 0} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AI_TOOLS.map((tool) =>
                renderSkillButton("aiTools", tool, {
                  selectedBg: "bg-amber-600",
                  selectedBorder: "border-amber-400",
                  shadow: "shadow-amber-950/40",
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-900">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            ← Back to Academic Intelligence
          </button>

          <button
            type="button"
            onClick={onNext}
            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white font-bold text-xs shadow-xl shadow-[#9A1750]/30 transition-all flex items-center gap-2"
          >
            <span>Continue to Experience & Projects</span>
            <span className="text-pink-200 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </motion.div>

      {/* Micro Skill Verification Modal */}
      <SkillCheckModal
        skillName={verifyingSkill?.name || null}
        selectedMentorId={selectedMentorId}
        isOpen={!!verifyingSkill}
        onComplete={handleVerificationComplete}
        onClose={handleSkipVerification}
      />
    </>
  );
}
