"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EducationDetails, SkillsSelection, ExperienceSelection, MentorPersona } from "@/types";
import { MENTOR_PERSONAS } from "@/constants";
import { CompanyLogo } from "@/components/company-logo";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { VERIFIED_COMPANIES } from "@/constants/companies-data";
import { recognizeInstitution } from "@/constants/college-intelligence";
import {
  computeAcademicMetrics,
  computePlacementReadiness,
  getMentorAcademicAdvice,
  generateAcademicSummary,
  getCompanyPrepReadiness,
  computePreparationRisk,
  getReadinessExplanation,
  getTodayCareerTip,
  getDetailedRoadmap,
  AcademicMetrics,
  DetailedRoadmapStage,
  CompanyPrepReadiness,
  CareerPreparationRisk,
  ReadinessExplanation,
  DailyCareerTip,
} from "@/lib/academic-intelligence";
import {
  Sparkles,
  GraduationCap,
  Edit2,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  Lightbulb,
  Target,
  FolderGit2,
  FileText,
  MessageSquare,
  Trophy,
  Loader2,
  CheckCircle2,
  Brain,
  Building2,
  Compass,
  BarChart3,
  Rocket,
  Clock,
  Award,
  Flag,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  X,
  Zap,
  Check,
  type LucideIcon,
} from "lucide-react";

interface StepEducationProps {
  education: EducationDetails;
  selectedMentorId: string;
  targetRole: string;
  targetCompanies: string[];
  skills: SkillsSelection;
  experience: ExperienceSelection;
  onChange: (updated: EducationDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const ORDINALS = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

function ordinal(n: number): string {
  const abs = Math.abs(n);
  const v = abs % 100;
  return `${n}${v >= 11 && v <= 13 ? "th" : ORDINALS[abs % 10] ?? "th"}`;
}

/** Smooth ease-out count-up used for the readiness score + progress bar. */
function useCountUp(target: number, active: boolean, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

/** Play the AI academic scan only once per browser session. */
let scanCompletedOnce = false;

const PERSONALIZATION_ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "Daily Missions", icon: Target },
  { label: "Interview Questions", icon: MessageSquare },
  { label: "Projects", icon: FolderGit2 },
  { label: "Resume", icon: FileText },
  { label: "ATS Optimization", icon: ShieldCheck },
  { label: "Placement Calendar", icon: CalendarDays },
  { label: "Skill Gap Analysis", icon: BarChart3 },
  { label: "Company Eligibility", icon: Building2 },
  { label: "Learning Roadmap", icon: Compass },
];

interface ScanOverlayProps {
  phase: number;
  collegeLabel: string;
}

/** Full-viewport AI academic scan that plays the first time Step 5 opens. */
function ScanOverlay({ phase, collegeLabel }: ScanOverlayProps) {
  const lines = [
    "Degree Found",
    "Branch Detected",
    "Graduation Year Verified",
    collegeLabel,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-7">
          <div className="relative h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-pulse" />
            <Sparkles className="h-6 w-6 relative" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Scanning Academic Profile...</h3>
            <p className="text-[11px] text-slate-400 font-mono">CareerCompass AI • Building your student profile</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {lines.map((label, i) => {
            const done = phase > i;
            const active = phase === i;
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.1, duration: 0.28 }}
                className="flex items-center gap-2.5 text-sm"
              >
                <span className="shrink-0">
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-700" />
                  )}
                </span>
                <span className={done ? "text-slate-200" : active ? "text-white" : "text-slate-600"}>
                  {label}
                </span>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 4 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 text-sm pt-1.5 border-t border-slate-800/70 mt-1.5"
          >
            {phase >= 5 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
            )}
            <span className={phase >= 5 ? "text-emerald-300 font-semibold" : "text-slate-200"}>
              {phase >= 5 ? "Academic Analysis Complete" : "Generating Personalized Roadmap..."}
            </span>
          </motion.div>
        </div>

        <div className="mt-7 h-1.5 rounded-full bg-slate-800 overflow-hidden border border-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C]"
            initial={{ width: "0%" }}
            animate={{ width: phase >= 5 ? "100%" : `${Math.min(Math.round((phase / 5) * 100), 92)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="mt-2 text-[10px] font-mono text-slate-500 text-right">
          {phase >= 5 ? "100%" : `${Math.min(Math.round((phase / 5) * 100), 92)}%`}
        </div>
      </div>
    </motion.div>
  );
}

const ROADMAP_ICONS: Record<string, LucideIcon> = {
  today: Flag,
  dsa: Brain,
  projects: FolderGit2,
  resume: FileText,
  mocks: MessageSquare,
  placement: CalendarDays,
  dream: Rocket,
};

export function StepEducation({
  education,
  selectedMentorId,
  targetRole,
  targetCompanies,
  skills,
  experience,
  onChange,
  onNext,
  onBack,
}: StepEducationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isScanning, setIsScanning] = useState(!scanCompletedOnce);
  const [scanPhase, setScanPhase] = useState(0);
  const [formData, setFormData] = useState<EducationDetails>(education);

  // New interactive states
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [selectedRoadmapStageId, setSelectedRoadmapStageId] = useState<string>("dsa");
  const [isCelebrating, setIsCelebrating] = useState(false);

  const mentor: MentorPersona = MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0];

  const metrics: AcademicMetrics = useMemo(() => computeAcademicMetrics(education), [education]);
  const institution = useMemo(() => recognizeInstitution(education.college), [education.college]);
  const readiness = useMemo(
    () => computePlacementReadiness(education, skills, experience, metrics),
    [education, skills, experience, metrics]
  );
  const mentorAdvice = useMemo(
    () => getMentorAcademicAdvice(selectedMentorId, metrics),
    [selectedMentorId, metrics]
  );
  const shownScore = useCountUp(readiness, !isScanning);

  // New computed intelligence
  const academicSummary = useMemo(
    () => generateAcademicSummary(education, targetRole, targetCompanies, metrics),
    [education, targetRole, targetCompanies, metrics]
  );

  const prepReadinessList: CompanyPrepReadiness[] = useMemo(
    () => getCompanyPrepReadiness(targetCompanies, targetRole, skills, experience, metrics),
    [targetCompanies, targetRole, skills, experience, metrics]
  );

  const riskAnalysis: CareerPreparationRisk = useMemo(
    () => computePreparationRisk(education, skills, experience, metrics, targetCompanies),
    [education, skills, experience, metrics, targetCompanies]
  );

  const readinessExplanation: ReadinessExplanation = useMemo(
    () => getReadinessExplanation(education, skills, experience, metrics),
    [education, skills, experience, metrics]
  );

  const dailyTip: DailyCareerTip = useMemo(
    () => getTodayCareerTip(selectedMentorId, targetRole, metrics, experience),
    [selectedMentorId, targetRole, metrics, experience]
  );

  const detailedRoadmap: DetailedRoadmapStage[] = useMemo(
    () => getDetailedRoadmap(targetRole, metrics),
    [targetRole, metrics]
  );

  const activeRoadmapStage = useMemo(
    () => detailedRoadmap.find((s) => s.id === selectedRoadmapStageId) || detailedRoadmap[1],
    [detailedRoadmap, selectedRoadmapStageId]
  );

  useEffect(() => {
    if (!isScanning) return;
    const t1 = setTimeout(() => setScanPhase(1), 350);
    const t2 = setTimeout(() => setScanPhase(2), 620);
    const t3 = setTimeout(() => setScanPhase(3), 890);
    const t4 = setTimeout(() => setScanPhase(4), 1160);
    const t5 = setTimeout(() => setScanPhase(5), 1500);
    const t6 = setTimeout(() => {
      scanCompletedOnce = true;
      setIsScanning(false);
    }, 1950);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [isScanning]);

  const handleSave = () => {
    onChange(formData);
    setIsEditing(false);
  };

  const handleContinueWithCelebration = () => {
    setIsCelebrating(true);
    setTimeout(() => {
      setIsCelebrating(false);
      onNext();
    }, 1400);
  };

  const currentYearNum = Math.min(4, Math.ceil(metrics.currentSemester / 2));
  const collegeLabel = institution ? "College Recognized" : "College Detected";
  const companyByName = (name: string) =>
    VERIFIED_COMPANIES.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const confidence = {
    degree: 100,
    branch: 100,
    year: 98,
    semester: 98,
    graduation: 98,
    college: institution ? 92 : 48,
  };

  const intelTiles = [
    { label: "Degree", value: education.degree || "—", pct: confidence.degree },
    { label: "Branch", value: education.department || "—", pct: confidence.branch },
    { label: "Current Year", value: `${ordinal(currentYearNum)} Year`, pct: confidence.year },
    { label: "Current Semester", value: `Semester ${metrics.currentSemester}`, pct: confidence.semester },
    { label: "Expected Graduation", value: education.graduationYear || "—", pct: confidence.graduation },
    { label: "College / University", value: education.college || "—", pct: confidence.college },
  ];

  const timelineNodes = [
    {
      label: `Current: Semester ${metrics.currentSemester}`,
      caption: "Active foundation & skill building window",
      current: true,
      grad: false,
    },
    ...Array.from({ length: Math.min(metrics.semestersRemaining, 2) }, (_, i) => ({
      label: `Next: Semester ${Math.min(metrics.totalSemesters, metrics.currentSemester + i + 1)}`,
      caption: `Intensive projects & assessment prep`,
      current: false,
      grad: false,
    })),
    {
      label: "Placement Season & Graduation",
      caption: `Placement season ${metrics.placementSeasonLabel} • Class of ${education.graduationYear}`,
      current: false,
      grad: true,
    },
  ];

  return (
    <div className="relative w-full">
      {/* 1. Initial AI Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <ScanOverlay key="academic-scan" phase={scanPhase} collegeLabel={collegeLabel} />
        )}
      </AnimatePresence>

      {/* 2. Celebration Transition Overlay */}
      <AnimatePresence>
        {isCelebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 max-w-sm w-full text-center shadow-2xl shadow-purple-900/30"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">Academic Profile Saved ✓</h3>
              <p className="text-xs text-purple-300 font-medium mb-4">Updating Career Roadmap...</p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                <span>Preparing Skills Assessment...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto"
        >
          {/* ================================================================= */}
          {/* 1. HEADER                                                         */}
          {/* ================================================================= */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Step 5 of 8 • Academic Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
              Education & Academic Background
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              CareerCompass personalizes your preparation runway around your academic schedule,
              degree timeline, and dream company hiring standards.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold shadow-[0_0_24px_rgba(16,185,129,0.18)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              AI Academic Analysis Complete
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. DYNAMIC AI ACADEMIC SUMMARY BANNER                             */}
          {/* ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/50 border border-purple-500/25 backdrop-blur-xl flex items-start gap-3.5 mb-6 shadow-xl"
          >
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                  AI Academic Summary
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-500/20 font-mono">
                  Personalized
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {academicSummary}
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* ================================================================= */}
            {/* 3. ACADEMIC INTELLIGENCE CARD                                     */}
            {/* ================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-purple-950/10 p-5 sm:p-6 relative overflow-hidden hover:shadow-[0_0_34px_rgba(139,92,246,0.14)] transition-shadow"
            >
              <div className="absolute -top-24 -right-24 h-56 w-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Academic Intelligence Card</h3>
                    <p className="text-xs text-slate-400">Auto-detected from your academic profile</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    AI Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-purple-400 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{isEditing ? "Cancel" : "Edit Details"}</span>
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Degree</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Department / Branch</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full py-3 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-500 transition-colors"
                  >
                    Save Academic Updates
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {intelTiles.map((tile) => (
                    <div key={tile.label} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        {tile.label}
                      </div>
                      <div className="text-sm font-bold text-white truncate" title={tile.value}>
                        {tile.value}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${tile.pct >= 90 ? "bg-emerald-400/90" : "bg-amber-400/90"}`}
                            style={{ width: `${tile.pct}%` }}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-bold shrink-0 ${tile.pct >= 90 ? "text-emerald-300" : "text-amber-300"}`}
                        >
                          {tile.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="lg:col-span-3 flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      {metrics.semestersRemaining} semester(s) until graduation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-purple-400" />
                      Placement season {metrics.placementSeasonLabel}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300/90">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      AI Verified • edit any field to update your analysis
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ================================================================= */}
            {/* 4. READINESS + TIMELINE + COLLEGE INTEL + MENTOR ADVICE           */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column: Readiness + Timeline + College */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 4A: READINESS ESTIMATE WITH TRANSPARENT BREAKDOWN */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span>CareerCompass Readiness Estimate</span>
                    </h4>
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-black text-white tracking-tight tabular-nums">
                        {shownScore}%
                      </span>
                      <span className="text-[11px] text-slate-400 mb-1 font-semibold">Preparation Level</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalculationModal(true)}
                      className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 underline underline-offset-2 mb-1 transition-colors"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>How is this calculated?</span>
                    </button>
                  </div>

                  <div className="relative h-2.5 rounded-full bg-slate-800/80 border border-slate-800 mb-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] transition-all duration-1000 ease-out"
                      style={{ width: `${shownScore}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-full bg-emerald-400/80"
                      style={{ left: "90%" }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-slate-800/60 font-medium">
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Education
                    </span>
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Skills
                    </span>
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Experience
                    </span>
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Targets
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 italic">
                    CareerCompass Estimate · Not a hiring probability or guarantee.
                  </div>
                </motion.div>

                {/* 4B: GRADUATION TIMELINE */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.14 }}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-emerald-400" />
                      <span>Graduation Timeline</span>
                    </h4>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold">
                      {metrics.monthsRemaining} Months Remaining
                    </span>
                  </div>

                  <div className="relative pl-5">
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/60 via-slate-700 to-emerald-500/60" />
                    <div className="space-y-3.5">
                      {timelineNodes.map((node, i) => (
                        <motion.div
                          key={`${node.label}-${i}`}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
                          className="relative"
                        >
                          <span
                            className={`absolute -left-5 top-1 h-[11px] w-[11px] rounded-full border-2 ${
                              node.current
                                ? "bg-purple-400 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                                : node.grad
                                ? "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                                : "bg-slate-800 border-slate-600"
                            }`}
                          />
                          <div>
                            <div
                              className={`text-xs font-bold ${
                                node.current ? "text-white" : node.grad ? "text-emerald-300" : "text-slate-300"
                              }`}
                            >
                              {node.label}
                            </div>
                            <div className="text-[10px] text-slate-500">{node.caption}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* 4C: COLLEGE INTELLIGENCE WITH VERIFIED STATS OR CLEAN FALLBACK */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className="sm:col-span-2 p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-400" />
                      <span>College Intelligence</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {institution ? "Verified Institution" : "Standardized Evaluation"}
                    </span>
                  </div>

                  {institution ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white">{education.college}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold">
                            {institution.tier}
                          </span>
                          {institution.naac && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-bold">
                              {institution.naac}
                            </span>
                          )}
                        </div>
                      </div>

                      {institution.verifiedStats ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div>
                            <div className="text-[10px] text-slate-400 font-medium">Average Package</div>
                            <div className="text-xs font-extrabold text-emerald-400">
                              {institution.verifiedStats.avgPackage}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-medium">Highest Package</div>
                            <div className="text-xs font-extrabold text-purple-300">
                              {institution.verifiedStats.highestPackage}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400 font-medium">Top Recruiters</div>
                            <div className="text-[10px] text-slate-300 truncate" title={institution.verifiedStats.topRecruiters?.join(", ")}>
                              {institution.verifiedStats.topRecruiters?.slice(0, 3).join(", ")}
                            </div>
                          </div>
                          <div className="sm:col-span-3 text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                            <span>Source: {institution.verifiedStats.source}</span>
                            <span>Report: {institution.verifiedStats.reportYear}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400">
                          <div className="text-slate-300 font-semibold mb-0.5">
                            Verified placement statistics unavailable.
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            CareerCompass benchmarks your academic profile against peer curricula, technical hiring bars, and required role skills without fabricating college figures.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400">
                      <div className="text-sm font-bold text-white mb-1">{education.college || "—"}</div>
                      <div className="text-amber-300 font-medium mb-0.5">Verified placement statistics unavailable.</div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        We don&apos;t invent placement metrics. Your learning roadmap is calibrated directly from your degree, branch, and targeted industry competencies.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column: AI Companion Commentary */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl flex flex-col hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CompanionAvatar id={mentor.id} size={64} className="rounded-2xl" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-white">{mentor.name}</span>
                      <span className="text-base">{mentor.emoji}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{mentor.title} · {mentor.role}</div>
                    <div className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${mentor.badgeColor}`}>
                      {mentor.traits.slice(0, 2).join(" · ")}
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: mentor.signatureColor }}>
                  {mentorAdvice.title}
                </h4>
                <div className="space-y-2">
                  {mentorAdvice.lines.map((line, i) => (
                    <motion.p
                      key={line}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                      className="text-xs text-slate-300 leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
                <div className="mt-auto pt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  Advice adapts to your academic profile
                </div>
              </motion.div>
            </div>

            {/* ================================================================= */}
            {/* 5. COMPANY PREPARATION READINESS (WITH DETAILED SKILL CHECKS)     */}
            {/* ================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-6 hover:shadow-[0_0_34px_rgba(139,92,246,0.12)] transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/70">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Company Preparation Readiness</h4>
                    <p className="text-[10px] text-slate-500">
                      Preparation indicators benchmarked against {targetRole} technical loops
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  CareerCompass Estimate
                </span>
              </div>

              {prepReadinessList.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No target companies selected yet — they&apos;ll appear here after Step 4.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prepReadinessList.map((item, i) => {
                    const comp = companyByName(item.name);
                    return (
                      <motion.div
                        key={`${item.name}-${i}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
                        className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <CompanyLogo
                                company={
                                  comp ?? {
                                    id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                                    name: item.name,
                                    logo: "🏢",
                                  }
                                }
                                size="md"
                                className="shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">{item.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{item.verdict}</div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-sm font-black text-purple-300">
                                {item.readinessPercentage}%
                              </div>
                              <div className="text-[9px] text-slate-500">Readiness</div>
                            </div>
                          </div>

                          {/* Skill Checks Checklist */}
                          <div className="space-y-1.5 mb-3">
                            {item.checks.map((check) => (
                              <div
                                key={check.label}
                                className="flex items-center justify-between text-[11px] py-0.5"
                              >
                                <span className="flex items-center gap-1.5 text-slate-300">
                                  {check.status === "ready" ? (
                                    <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                                  )}
                                  <span>{check.label}</span>
                                </span>
                                <span
                                  className={`text-[10px] font-medium truncate max-w-[140px] ${
                                    check.status === "ready" ? "text-emerald-400" : "text-amber-400"
                                  }`}
                                  title={check.note}
                                >
                                  {check.note}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 text-[9px] text-slate-500 italic">
                          Preparation indicator only, not a hiring probability or guarantee.
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* ================================================================= */}
            {/* 6. CLICKABLE ROADMAP WITH EXPANDABLE STAGES                       */}
            {/* ================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-6 hover:shadow-[0_0_34px_rgba(139,92,246,0.12)] transition-shadow"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/70">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Clickable Learning Roadmap</h4>
                    <p className="text-[10px] text-slate-500">
                      Click any milestone stage below to inspect weekly targets & topic breakdown
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  Interactive Syllabus
                </span>
              </div>

              {/* Horizontal Scrollable Stage Buttons */}
              <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
                {detailedRoadmap.map((m) => {
                  const Icon = ROADMAP_ICONS[m.id] || Flag;
                  const isSelected = selectedRoadmapStageId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedRoadmapStageId(m.id)}
                      className={`shrink-0 w-36 text-left p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-purple-600 text-white shadow-lg"
                              : "bg-purple-600/15 border border-purple-500/25 text-purple-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400">{m.duration}</span>
                      </div>
                      <div className={`text-xs font-bold ${m.highlight ? "text-emerald-300" : "text-white"}`}>
                        {m.label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{m.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Expanded Stage Detail Drawer */}
              <AnimatePresence mode="wait">
                {activeRoadmapStage && (
                  <motion.div
                    key={activeRoadmapStage.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-purple-300">
                          {activeRoadmapStage.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                          {activeRoadmapStage.duration}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Pace: ~{activeRoadmapStage.recommendedHoursPerWeek} hrs/week
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {activeRoadmapStage.description}
                    </p>

                    <div className="mb-3">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                        Key Focus Topics:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeRoadmapStage.topics.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] font-medium text-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                      <Target className="h-4 w-4 shrink-0 text-purple-400" />
                      <span>
                        <strong>Milestone:</strong> {activeRoadmapStage.keyMilestone}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ================================================================= */}
            {/* 7. CAREER PREPARATION RISK ANALYSIS + TODAY'S CAREER TIP          */}
            {/* ================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 7A: RISK ANALYSIS */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                    <span>Career Preparation Risk</span>
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${riskAnalysis.badgeColor}`}
                  >
                    {riskAnalysis.level} RISK
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {riskAnalysis.summary}
                </p>

                <div className="space-y-2">
                  {riskAnalysis.factors.map((factor) => (
                    <div
                      key={factor.label}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                    >
                      <span className="flex items-center gap-2 text-slate-200">
                        {factor.status === "good" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        )}
                        <span>{factor.label}</span>
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          factor.status === "good" ? "text-slate-400" : "text-amber-300"
                        }`}
                      >
                        {factor.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 7B: TODAY'S CAREER TIP */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                      <span>Today&apos;s Career Tip</span>
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                      {dailyTip.category}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white mb-2">{dailyTip.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{dailyTip.tip}</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 text-xs text-purple-200 flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Action Item: </span>
                    {dailyTip.actionItem}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ================================================================= */}
            {/* 8. WHAT THIS INFORMATION PERSONALIZES                            */}
            {/* ================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.26 }}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-shadow"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <Compass className="h-4 w-4 text-blue-400" />
                <span>What This Information Personalizes</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PERSONALIZATION_ITEMS.map(({ label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.28 + i * 0.05, duration: 0.3 }}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex items-center gap-2 hover:border-slate-600 transition-colors"
                  >
                    <span className="h-4 w-4 shrink-0 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-purple-400" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-200 leading-tight">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ================================================================= */}
          {/* FOOTER                                                         */}
          {/* ================================================================= */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-10">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              ← Back to Dream Companies
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline">
                <strong className="text-purple-400 font-bold">{metrics.daysRemaining}</strong>{" "}
                days to graduation
              </span>
              <button
                type="button"
                onClick={handleContinueWithCelebration}
                className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white font-bold text-xs shadow-xl shadow-[#9A1750]/30 transition-all flex items-center gap-2"
              >
                <div className="text-left">
                  <div>Continue to Skills & Tech Stack</div>
                  <div className="text-[10px] text-pink-200 font-medium">Next: Step 6 of 8</div>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================= */}
      {/* 9. "HOW IS THIS CALCULATED?" TRANSPARENCY MODAL               */}
      {/* ============================================================= */}
      <AnimatePresence>
        {showCalculationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowCalculationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span>How Readiness is Calculated</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transparent criteria powering your CareerCompass benchmark
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                {readinessExplanation.explanationSummary}
              </div>

              <div className="space-y-2.5 mb-5">
                {readinessExplanation.factors.map((factor) => (
                  <div
                    key={factor.category}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span>{factor.category}</span>
                      <span className="text-purple-300 font-mono">
                        {factor.pointsEarned} / {factor.maxPoints} pts ({factor.weight})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{factor.detail}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[10px] text-slate-500 italic mb-4">
                {readinessExplanation.transparencyNote}
              </div>

              <button
                type="button"
                onClick={() => setShowCalculationModal(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
              >
                Close Explanation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}