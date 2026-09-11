"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROLE_CATALOG } from "@/constants/roles";
import { MENTOR_PERSONAS } from "@/constants";
import { RoleDetails, SkillsSelection } from "@/types";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { matchCareerRoles, RoleMatchResult } from "@/lib/role-matcher";
import {
  Search,
  Sparkles,
  Check,
  CheckCircle2,
  ArrowRight,
  Star,
  Briefcase,
  TrendingUp,
  Clock,
  Lightbulb,
  HelpCircle,
  Wand2,
  X,
  Flame,
  Zap,
  Bot,
  Building2,
  Award,
  CornerDownLeft,
  Cpu,
} from "lucide-react";
import { RoleIcon } from "@/components/role-icon";

interface StepRoleProps {
  targetRole: string;
  selectedMentorId?: string;
  userSkills?: SkillsSelection;
  onSelect: (role: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Subtle Ambient Floating Background Particles
// ---------------------------------------------------------------------------
const AmbientParticles = memo(function AmbientParticles() {
  const particles = useMemo(
    () => [
      { id: 1, top: "12%", left: "10%", size: 4, duration: 6, delay: 0 },
      { id: 2, top: "25%", right: "12%", size: 5, duration: 7, delay: 1.2 },
      { id: 3, top: "55%", left: "6%", size: 3, duration: 8, delay: 0.5 },
      { id: 4, top: "78%", right: "15%", size: 4, duration: 6.5, delay: 2 },
      { id: 5, top: "90%", left: "18%", size: 5, duration: 7.5, delay: 1 },
    ],
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.15, y: 0 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
            backgroundColor: "#a855f7",
            borderRadius: "50%",
            filter: "blur(1px)",
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
          }}
        />
      ))}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Star Rating Renderer (1 to 5 stars)
// ---------------------------------------------------------------------------
function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, idx) => {
        const isFilled = idx < count;
        return (
          <Star
            key={idx}
            className={`h-3 w-3 ${
              isFilled
                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                : "text-slate-700"
            }`}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge Renderer
// ---------------------------------------------------------------------------
function RoleBadgePill({ badge }: { badge: RoleDetails["badge"] }) {
  if (!badge) return null;

  const styleMap = {
    trending: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    beginner: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    growth: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    hiring: "bg-purple-500/15 border-purple-500/30 text-purple-300",
    ai: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
  };

  const renderBadgeIcon = (type: string) => {
    switch (type) {
      case "trending":
        return <Flame className="h-3 w-3 text-rose-400" />;
      case "beginner":
        return <Sparkles className="h-3 w-3 text-emerald-400" />;
      case "growth":
        return <TrendingUp className="h-3 w-3 text-sky-400" />;
      case "hiring":
        return <Briefcase className="h-3 w-3 text-purple-400" />;
      case "ai":
        return <Cpu className="h-3 w-3 text-indigo-400" />;
      default:
        return <Sparkles className="h-3 w-3 text-purple-400" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-sm ${
        styleMap[badge.type] || "bg-purple-500/15 border-purple-500/30 text-purple-300"
      }`}
    >
      {renderBadgeIcon(badge.type)}
      <span>{badge.text}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// AI Mini Wizard: "Can't Decide? Help Me Choose"
// ---------------------------------------------------------------------------
interface MiniWizardProps {
  onSelectRole: (role: string) => void;
  onClose: () => void;
}

function MiniWizard({ onSelectRole, onClose }: MiniWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendedResult, setRecommendedResult] = useState<RoleDetails | null>(null);

  const questions = useMemo(
    () => [
      {
        question: "What kind of challenges spark your curiosity most?",
        options: [
          { label: "Building beautiful user interfaces & product visuals", scoreRole: "Frontend Developer" },
          { label: "Engineering high-performance backend systems & databases", scoreRole: "Backend Developer" },
          { label: "Building full-stack products from start to finish", scoreRole: "Full Stack Engineer" },
          { label: "Creating autonomous AI agents, LLMs, and intelligent apps", scoreRole: "AI Engineer" },
        ],
      },
      {
        question: "How do you prefer to spend your daily coding time?",
        options: [
          { label: "Crafting reactive components and design systems", scoreRole: "Frontend Developer" },
          { label: "Optimizing SQL queries, caching, and server architecture", scoreRole: "Backend Developer" },
          { label: "Training models, fine-tuning prompts, and analyzing data", scoreRole: "Machine Learning Engineer" },
          { label: "Automating cloud deployments, Docker & CI/CD pipelines", scoreRole: "DevOps Engineer" },
        ],
      },
      {
        question: "Which type of tech stack appeals to you most?",
        options: [
          { label: "AWS / Azure / GCP Cloud architectures & serverless", scoreRole: "Cloud Engineer" },
          { label: "Unity / Unreal 3D gameplay and graphics programming", scoreRole: "Game Developer" },
          { label: "Ethical hacking, penetration testing & network defense", scoreRole: "Cyber Security Analyst" },
          { label: "Figma design systems and user journey research", scoreRole: "UI/UX Designer" },
        ],
      },
      {
        question: "Which type of company environment appeals to you most?",
        options: [
          { label: "Fast-moving AI startups building generative tools", scoreRole: "AI Engineer" },
          { label: "Top mobile product companies with millions of daily users", scoreRole: "Android Engineer" },
          { label: "Tier-1 Big Tech / FAANG hiring at high salary scales", scoreRole: "Software Engineer" },
          { label: "FinTech & Enterprise handling billions in transactions", scoreRole: "Backend Developer" },
        ],
      },
    ],
    []
  );

  const handleAnswer = (scoreRole: string) => {
    const updated = { ...answers, [currentStep]: scoreRole };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner
      const counts: Record<string, number> = {};
      Object.values(updated).forEach((r) => {
        counts[r] = (counts[r] || 0) + 1;
      });
      let bestRole = "Software Engineer";
      let highestCount = 0;
      Object.entries(counts).forEach(([role, count]) => {
        if (count > highestCount) {
          highestCount = count;
          bestRole = role;
        }
      });
      const found = ROLE_CATALOG.find((r) => r.name === bestRole) || ROLE_CATALOG[0];
      setRecommendedResult(found);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 rounded-3xl border border-purple-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 relative mb-8"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
        aria-label="Close Quiz"
      >
        <X className="h-4 w-4" />
      </button>

      {!recommendedResult ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-4 w-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              AI Career Pathfinder • Question {currentStep + 1} of {questions.length}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-4">
            {questions[currentStep].question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {questions[currentStep].options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(opt.scoreRole)}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-purple-950/30 hover:border-purple-500/40 text-left text-xs sm:text-sm font-medium text-slate-200 transition-all flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 mb-3 shadow-lg">
            <RoleIcon roleNameOrId={recommendedResult.id || recommendedResult.name} className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            We Recommend: <span className="text-purple-400">{recommendedResult.name}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1.5 mb-5 leading-relaxed">
            Based on your answers, this career track aligns seamlessly with your technical interests and salary expectations.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onSelectRole(recommendedResult.name)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Select {recommendedResult.name}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(0);
                setAnswers({});
                setRecommendedResult(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main StepRole Component
// ---------------------------------------------------------------------------
export function StepRole({
  targetRole,
  selectedMentorId = "athena",
  userSkills,
  onSelect,
  onNext,
  onBack,
}: StepRoleProps) {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active mentor data
  const mentor = useMemo(() => {
    return (
      MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0]
    );
  }, [selectedMentorId]);

  // Selected role object
  const activeRoleDetails = useMemo(() => {
    return ROLE_CATALOG.find((r) => r.name === targetRole) || ROLE_CATALOG[0];
  }, [targetRole]);

  // AI-Powered Role Matcher results
  const roleMatches: RoleMatchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return matchCareerRoles(query);
  }, [query]);

  // Reset active keyboard index when query changes
  useEffect(() => {
    setActiveMatchIndex(0);
  }, [query]);

  // Filtered / Ordered roles for the card grid
  const filteredRoles = useMemo(() => {
    if (!query.trim()) return ROLE_CATALOG;

    if (roleMatches.length > 0) {
      const matchedNames = new Set<string>(roleMatches.map((m) => m.role));
      const matchedInCatalog = roleMatches
        .map((m) => ROLE_CATALOG.find((r) => r.name === m.role))
        .filter(Boolean) as RoleDetails[];
      const others = ROLE_CATALOG.filter((r) => !matchedNames.has(r.name));
      return [...matchedInCatalog, ...others];
    }

    const q = query.toLowerCase().trim();
    return ROLE_CATALOG.filter((role) => {
      return (
        role.name.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q) ||
        role.topSkills.some((skill) => skill.toLowerCase().includes(q))
      );
    });
  }, [query, roleMatches]);

  // AI Recommendation banner calculation
  const aiRecommendedRole = useMemo(() => {
    const knownSkills = [
      ...(userSkills?.languages || []),
      ...(userSkills?.frameworks || []),
      ...(userSkills?.databases || []),
    ].map((s) => s.toLowerCase());

    if (knownSkills.some((s) => s.includes("react") || s.includes("next") || s.includes("node"))) {
      return {
        role: ROLE_CATALOG.find((r) => r.name === "Full Stack Engineer") || ROLE_CATALOG[3],
        score: 94,
        reason: "Based on your interest in React, Node.js, and modern full-stack web architecture.",
      };
    }
    if (knownSkills.some((s) => s.includes("python") || s.includes("chatgpt"))) {
      return {
        role: ROLE_CATALOG.find((r) => r.name === "AI Engineer") || ROLE_CATALOG[4],
        score: 96,
        reason: "High synergy with your Python background and generative AI exploration.",
      };
    }
    // Default fallback recommendation
    return {
      role: ROLE_CATALOG.find((r) => r.name === "Software Engineer") || ROLE_CATALOG[0],
      score: 92,
      reason: "Premier foundational track for top-tier Big Tech & high-scale product engineering rounds.",
    };
  }, [userSkills]);

  // Keyboard navigation on input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (roleMatches.length > 0) {
        e.preventDefault();
        setActiveMatchIndex((prev) => (prev + 1) % roleMatches.length);
      }
    } else if (e.key === "ArrowUp") {
      if (roleMatches.length > 0) {
        e.preventDefault();
        setActiveMatchIndex((prev) => (prev - 1 + roleMatches.length) % roleMatches.length);
      }
    } else if (e.key === "Enter") {
      if (roleMatches.length > 0 && roleMatches[activeMatchIndex]) {
        e.preventDefault();
        onSelect(roleMatches[activeMatchIndex].role);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setQuery("");
      setShowWizard(false);
    }
  };

  // Keyboard navigation for whole screen
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuery("");
        setShowWizard(false);
      }
    },
    []
  );

  return (
    <div
      onKeyDown={handleKeyDown}
      className="w-full relative outline-none"
    >
      {/* Background Particles */}
      <AmbientParticles />

      {/* Screen Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Step 3 of 8 • Career Pathway Targeting</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
          What is Your Dream Role?
        </h2>

        <p className="text-slate-400 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
          This helps your AI mentor personalize projects, interview preparation, resume advice, and your learning roadmap.
        </p>

        {/* Profile Completion Meter */}
        <div className="mt-4 inline-flex flex-col items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl">
          <div className="flex items-center justify-between w-48 text-[11px] font-bold text-slate-300">
            <span>Profile Completion</span>
            <span className="text-purple-400">35%</span>
          </div>
          <div className="w-48 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "35%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* AI COMPANION INTRODUCTION CARD (Floating, Alive & Interactive)      */}
      {/* =================================================================== */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="max-w-3xl mx-auto mb-8 p-4 sm:p-5 rounded-3xl border bg-slate-900/80 backdrop-blur-xl shadow-xl relative overflow-hidden"
        style={{
          borderColor: `${mentor.signatureColor}35`,
          boxShadow: `0 8px 30px ${mentor.glowColor}`,
        }}
      >
        <div className="flex items-start gap-4">
          <div className="relative shrink-0 mt-0.5">
            <div
              className="p-1 rounded-2xl border"
              style={{
                backgroundColor: `${mentor.signatureColor}20`,
                borderColor: `${mentor.signatureColor}40`,
              }}
            >
              <CompanionAvatar
                id={mentor.id}
                size={58}
                emotion="idle"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-extrabold text-white">
                {mentor.name}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${mentor.signatureColor}15`,
                  borderColor: `${mentor.signatureColor}35`,
                  color: mentor.signatureColor,
                }}
              >
                Your AI Companion
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
              &ldquo;Hey! Let&apos;s decide where you&apos;re heading. Don&apos;t worry if you&apos;re unsure—you can always change this later. Your dream role helps me craft your personalized roadmap, mock interview rounds, daily missions, and resume enhancements.&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* =================================================================== */}
      {/* AI-POWERED ROLE MATCHER SEARCH (Raycast Style)                      */}
      {/* =================================================================== */}
      <div className="max-w-3xl mx-auto mb-8 space-y-3 relative z-30">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4 text-purple-400" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search any technology, framework, language, or title (e.g. .NET, React, Unity, Docker, AWS)..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl border border-slate-800 bg-slate-950/95 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-12 pr-2 flex items-center text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500">
              ESC
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RAYCAST-STYLE INTELLIGENT RESULTS DROPDOWN                        */}
        {/* ================================================================= */}
        <AnimatePresence>
          {query.trim().length > 0 && isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="p-3 rounded-2xl bg-slate-950/98 border border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl space-y-2.5"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Bot className="h-3.5 w-3.5 text-purple-400" />
                  <span>AI Career Role Matcher</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {roleMatches.length > 0 ? (
                    <span>
                      Found <strong className="text-white">{roleMatches.length}</strong> matching standard paths
                    </span>
                  ) : (
                    <span>No direct standard match</span>
                  )}
                </div>
              </div>

              {/* Match Items */}
              {roleMatches.length > 0 ? (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {roleMatches.map((match, idx) => {
                    const isSelectedMatch = idx === activeMatchIndex;
                    const isCurrentlyTargetRole = targetRole === match.role;

                    return (
                      <div
                        key={match.role}
                        onMouseDown={() => {
                          onSelect(match.role);
                          setQuery("");
                        }}
                        onMouseEnter={() => setActiveMatchIndex(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                          isSelectedMatch
                            ? "bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50"
                            : "bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="shrink-0 p-2 rounded-lg bg-slate-950 border border-slate-800 text-purple-400">
                              <RoleIcon roleNameOrId={match.roleDetails.id || match.role} className="h-5 w-5 text-purple-400" />
                            </span>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-extrabold text-white">
                                  {match.role}
                                </span>

                                {match.isBestMatch ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                                    <Sparkles className="h-2.5 w-2.5" /> Best Match
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700">
                                    Related Track
                                  </span>
                                )}

                                {isCurrentlyTargetRole && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    ✓ Selected
                                  </span>
                                )}
                              </div>

                              {match.matchedChips.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap text-[11px] text-slate-400">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Matches:
                                  </span>
                                  {match.matchedChips.map((chip) => (
                                    <span
                                      key={chip}
                                      className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-medium text-purple-300"
                                    >
                                      {chip}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-xs">
                              {match.confidence}% Match
                            </span>

                            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono font-medium">
                              <span>Select</span>
                              <CornerDownLeft className="h-2.5 w-2.5 text-purple-400" />
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation Pill */}
                        <div className="text-[11px] text-slate-300 bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 flex items-start gap-2 leading-relaxed">
                          <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{match.explanation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-400 mb-3">
                    No exact technology pattern found for &ldquo;<strong className="text-white">{query}</strong>&rdquo;.
                    CareerCompass standardizes software paths into 14 core tracks.
                  </p>
                  <button
                    type="button"
                    onMouseDown={() => {
                      onSelect("Software Engineer");
                      setQuery("");
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                  >
                    Select Foundational Track (Software Engineer)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Launcher Helper Row */}
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredRoles.length}</strong> standardized career paths
          </span>

          <button
            type="button"
            onClick={() => setShowWizard((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Not sure? Help me choose</span>
          </button>
        </div>
      </div>

      {/* Interactive AI Mini Wizard (Modal / Card) */}
      <AnimatePresence>
        {showWizard && (
          <MiniWizard
            onSelectRole={(role) => {
              setQuery("");
              onSelect(role);
              setShowWizard(false);
            }}
            onClose={() => setShowWizard(false)}
          />
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* AI RECOMMENDATION BANNER (If Available)                              */}
      {/* =================================================================== */}
      {aiRecommendedRole && (
        <div className="w-full mx-auto mb-6">
          <div className="p-4 sm:p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-950/90 to-purple-950/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/10">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner text-emerald-400">
                <RoleIcon roleNameOrId={aiRecommendedRole.role.id || aiRecommendedRole.role.name} className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Recommended For You
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {aiRecommendedRole.score}% Match
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {aiRecommendedRole.role.name}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {aiRecommendedRole.reason}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                onSelect(aiRecommendedRole.role.name);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                targetRole === aiRecommendedRole.role.name
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/50"
              }`}
            >
              {targetRole === aiRecommendedRole.role.name ? "✓ Selected" : "Select Recommended"}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 14 STANDARDIZED INTERACTIVE ROLE CARDS GRID                         */}
      {/* =================================================================== */}
      <div
        role="radiogroup"
        aria-label="Select your dream role"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 w-full mx-auto"
      >
        {filteredRoles.map((role) => {
          const isSelected = targetRole === role.name;

          return (
            <motion.div
              key={role.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(role.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(role.name);
                }
              }}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className={`group relative p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                isSelected
                  ? "bg-slate-900/95 border-2 shadow-2xl"
                  : "bg-slate-950/70 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
              style={{
                borderColor: isSelected ? "#a855f7" : undefined,
                boxShadow: isSelected
                  ? "0 0 28px rgba(168, 85, 247, 0.35), 0 12px 24px -6px rgba(0,0,0,0.7)"
                  : undefined,
              }}
            >
              {/* Dynamic Purple Highlight behind selected card */}
              {isSelected && (
                <motion.div
                  layoutId="selectedRoleCardHighlight"
                  className="absolute inset-0 rounded-3xl pointer-events-none -z-10 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div>
                {/* Top Row: Icon + Badge + Checkmark */}
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <RoleIcon roleNameOrId={role.id || role.name} className="h-6 w-6 text-purple-400" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                        {role.name}
                      </h3>
                      <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                        {role.salaryRange}
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator Badge or Popular Badge */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-6 w-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </motion.div>
                    ) : (
                      role.badge && <RoleBadgePill badge={role.badge} />
                    )}
                  </div>
                </div>

                {/* Short Role Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4 line-clamp-2">
                  {role.description}
                </p>

                {/* Top Hiring Companies */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-purple-400" />
                    <span>Top Recruiters</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.topCompanies.map((company) => (
                      <span
                        key={company}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Metrics: Demand & Difficulty Meters */}
              <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] font-medium block mb-0.5">
                    Hiring Demand
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StarRating count={role.demandLevel} />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] font-medium block mb-0.5">
                    Prep Difficulty
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    <StarRating count={role.difficultyLevel} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* ROLE INFORMATION DEEP-DIVE PANEL (Opens for active role)            */}
      {/* =================================================================== */}
      {activeRoleDetails && (
        <motion.div
          key={activeRoleDetails.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full mx-auto mb-8 p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-950/90 backdrop-blur-2xl shadow-xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <RoleIcon roleNameOrId={activeRoleDetails.id || activeRoleDetails.name} className="h-7 w-7 text-purple-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {activeRoleDetails.name} Career Profile
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Selected Target
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed benchmark expectations and market parameters for this path.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-semibold text-slate-400 block">
                Compensation Range
              </span>
              <span className="text-base font-black text-emerald-400">
                {activeRoleDetails.salaryRange}
              </span>
            </div>
          </div>

          {/* 4-Box Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>Estimated Prep</span>
              </div>
              <div className="text-sm sm:text-base font-black text-white">
                {activeRoleDetails.estimatedMonths} Months
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                <span>Hiring Demand</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-white">
                <StarRating count={activeRoleDetails.demandLevel} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span>Competition</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-white">
                <StarRating count={activeRoleDetails.competition} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                <span>Market Growth</span>
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-400">
                {activeRoleDetails.growth}
              </div>
            </div>
          </div>

          {/* Top In-Demand Skills Required */}
          <div className="mb-4">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>Core Technologies Interviewers Test For:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeRoleDetails.topSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 text-xs font-semibold shadow-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Mentor Advice Quote */}
          {activeRoleDetails.mentorTip && (
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 italic flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-purple-300 not-italic font-bold mr-1">
                  {mentor.name}&apos;s Advice:
                </strong>
                &ldquo;{activeRoleDetails.mentorTip}&rdquo;
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* =================================================================== */}
      {/* WHY WE ASK THIS INFORMATION CARD                                    */}
      {/* =================================================================== */}
      <div className="w-full mx-auto mb-10 p-6 rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
          <HelpCircle className="h-4 w-4 text-purple-400" />
          <span>Why are we asking this?</span>
        </div>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Selecting your dream role allows CareerCompass to calibrate your hiring readiness algorithm and tailor your journey:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Projects</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Daily Missions</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Resume ATS</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Roadmap</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Interview Qs</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>AI Chats</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SCREEN NAVIGATION FOOTER                                            */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-900 w-full mx-auto relative z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
        >
          ← Back to Companion
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Targeting:{" "}
            <strong className="text-purple-400 font-bold">
              {targetRole || "None Selected"}
            </strong>
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={!targetRole}
            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div className="text-left">
              <div>Continue</div>
              <div className="text-[10px] text-purple-200 font-medium">
                Next: Dream Companies →
              </div>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
