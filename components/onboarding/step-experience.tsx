"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ExperienceSelection } from "@/types";
import { PROJECT_COUNT_OPTIONS } from "@/constants";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import {
  UPDATED_GIT_OPTIONS,
  UPDATED_DSA_OPTIONS,
  DEPLOYMENT_OPTIONS,
  API_OPTIONS,
  DATABASE_OPTIONS,
  TEAM_OPTIONS,
  computePracticalProfile,
  getCompanionExperienceReaction,
} from "@/lib/practical-experience";
import {
  Sparkles,
  GitBranch,
  FolderGit2,
  Brain,
  Rocket,
  Globe,
  Database,
  Users,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";

interface StepExperienceProps {
  experience: ExperienceSelection;
  selectedMentorId?: string;
  onChange: (updated: ExperienceSelection) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepExperience({
  experience,
  selectedMentorId = "athena",
  onChange,
  onNext,
  onBack,
}: StepExperienceProps) {
  const mentor = useMemo(
    () => MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0],
    [selectedMentorId]
  );

  const practicalProfile = useMemo(
    () => computePracticalProfile(experience),
    [experience]
  );

  const companionReaction = useMemo(
    () => getCompanionExperienceReaction(mentor.id, experience),
    [mentor.id, experience]
  );

  return (
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
          <span>Step 7 of 8 • Practical Experience</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
          Experience & Practical Building
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          How much hands-on development have you done so far?
        </p>
      </div>

      {/* Dynamic Companion Live Reaction Banner */}
      <motion.div
        layout
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/50 border border-purple-500/25 backdrop-blur-xl flex items-center gap-5 mb-8 shadow-xl"
        style={{ borderColor: `${mentor.signatureColor}35` }}
      >
        <CompanionAvatar id={mentor.id} size={72} className="rounded-2xl shrink-0 shadow-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-sm sm:text-base font-black text-white">{mentor.name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-500/20 font-mono font-bold">
              Practical Coach
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {companionReaction}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6 mb-10">
        {/* ============================================================= */}
        {/* 1. GIT & GITHUB                                               */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-purple-400" />
              <span>How comfortable are you with Git & GitHub?</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-300 font-bold">
              {experience.gitUsage.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {UPDATED_GIT_OPTIONS.map((option) => {
              const isSelected = experience.gitUsage === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...experience, gitUsage: option.value })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/40 text-white shadow-lg shadow-purple-950/50"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold">{option.label}</span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">{option.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 2. PROJECT EXPERIENCE (COUNT ONLY)                            */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-blue-400" />
              <span>How many projects have you built?</span>
            </h3>
            <span className="text-[10px] font-mono text-blue-300 font-bold">
              {experience.projectCount}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PROJECT_COUNT_OPTIONS.map((option) => {
              const isSelected = experience.projectCount === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...experience,
                      projectCount: option.value as ExperienceSelection["projectCount"],
                    })
                  }
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/40 text-white shadow-md shadow-blue-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold">{option.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{option.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 3. DEPLOYMENT                                                 */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Rocket className="h-4 w-4 text-purple-400" />
              <span>Have you deployed an application?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {DEPLOYMENT_OPTIONS.map((opt) => {
              const isSelected = experience.deploymentExperience === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...experience, deploymentExperience: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/40 text-white shadow-md shadow-purple-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-purple-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 4. APIs                                                       */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <span>How comfortable are you working with APIs?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {API_OPTIONS.map((opt) => {
              const isSelected = experience.apiExperience === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...experience, apiExperience: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/40 text-white shadow-md shadow-blue-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-blue-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 5. DATABASES                                                  */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>How comfortable are you working with databases?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {DATABASE_OPTIONS.map((opt) => {
              const isSelected = experience.databaseExperience === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...experience, databaseExperience: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40 text-white shadow-md shadow-emerald-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 6. TEAM EXPERIENCE                                            */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Have you worked on software projects with other people?</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {TEAM_OPTIONS.map((opt) => {
              const isSelected = experience.teamExperience === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ ...experience, teamExperience: opt.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/40 text-white shadow-md shadow-amber-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">{opt.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 7. DSA / PROBLEM SOLVING                                      */}
        {/* ============================================================= */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Brain className="h-4 w-4 text-emerald-400" />
              <span>How comfortable are you solving coding problems?</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-300 font-bold">
              {experience.dsaLevel.toUpperCase()}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>
              This is an initial self-assessment. CareerCompass can measure your actual
              problem-solving ability later.
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {UPDATED_DSA_OPTIONS.map((option) => {
              const isSelected = experience.dsaLevel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...experience, dsaLevel: option.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40 text-white shadow-md shadow-emerald-950/40 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{option.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{option.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* PRACTICAL PROFILE SUMMARY CARD                                */}
        {/* ============================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Your Practical Experience
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Self-Reported Overview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5">
            {practicalProfile.items.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2"
              >
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                <span className="text-xs font-bold text-slate-200 truncate">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Initial Experience Estimate
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-lg border text-xs font-extrabold tracking-wide ${practicalProfile.estimateColorClass}`}
              >
                {practicalProfile.overallEstimate}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic max-w-md flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span>{practicalProfile.disclaimer}</span>
            </p>
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
          ← Back to Technical Stack
        </button>

        <button
          type="button"
          onClick={onNext}
          className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white font-bold text-xs shadow-xl shadow-[#9A1750]/30 transition-all flex items-center gap-2"
        >
          <span>Continue to Account Connections & Evidence</span>
          <span className="text-pink-200 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </motion.div>
  );
}
