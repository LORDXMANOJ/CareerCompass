"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VERIFIED_COMPANIES, VerifiedCompany, getVerifiedCompanyById } from "@/constants/companies-data";
import { MENTOR_PERSONAS } from "@/constants";
import { SkillsSelection } from "@/types";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { CompanyLogo } from "@/components/company-logo";
import {
  matchCompanies,
  getRoleRecommendedCompanies,
  calculateDeterministicCompanyScore,
} from "@/lib/company-matcher";
import {
  Search,
  Sparkles,
  Check,
  Building2,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Award,
  X,
  Bot,
  Zap,
  ShieldCheck,
  AlertCircle,
  Plus,
  CornerDownLeft,
  ChevronRight,
  SlidersHorizontal,
  Target,
} from "lucide-react";

interface StepCompaniesProps {
  selectedCompanies: string[];
  targetRole?: string;
  selectedMentorId?: string;
  userSkills?: SkillsSelection;
  onToggle: (company: string) => void;
  onNext: () => void;
  onBack: () => void;
}

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
// Category Tab Filters
// ---------------------------------------------------------------------------
const CATEGORY_FILTERS = [
  "All Sectors",
  "Big Tech / FAANG+",
  "AI Leaders & Research",
  "Global Product Unicorns",
  "FinTech & Payments",
  "Cyber Security",
  "Gaming & Interactive",
  "Indian Product Unicorns",
];

export function StepCompanies({
  selectedCompanies,
  targetRole = "Software Engineer",
  selectedMentorId = "athena",
  userSkills,
  onToggle,
  onNext,
  onBack,
}: StepCompaniesProps) {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Sectors");
  const [inspectedCompanyId, setInspectedCompanyId] = useState<string>("google");
  const [showValidationModal, setShowValidationModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active mentor
  const mentor = useMemo(() => {
    return MENTOR_PERSONAS.find((m) => m.id === selectedMentorId) || MENTOR_PERSONAS[0];
  }, [selectedMentorId]);

  // Role-prioritized catalog
  const roleRecommended = useMemo(() => {
    return getRoleRecommendedCompanies(targetRole, userSkills);
  }, [targetRole, userSkills]);

  // Inspected company data
  const inspectedCompany = useMemo(() => {
    return (
      getVerifiedCompanyById(inspectedCompanyId) ||
      roleRecommended[0] ||
      VERIFIED_COMPANIES[0]
    );
  }, [inspectedCompanyId, roleRecommended]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return matchCompanies(query, targetRole, userSkills);
  }, [query, targetRole, userSkills]);

  // Reset keyboard highlight on query change
  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [query]);

  // Set default inspected company to first selected or first role recommendation
  useEffect(() => {
    if (selectedCompanies.length > 0) {
      const found = VERIFIED_COMPANIES.find((c) => c.name === selectedCompanies[0]);
      if (found) setInspectedCompanyId(found.id);
    }
  }, [selectedCompanies]);

  // Filtered companies based on category tabs
  const filteredCatalog = useMemo(() => {
    if (selectedCategory === "All Sectors") {
      return roleRecommended;
    }
    return roleRecommended.filter((c) => c.category === selectedCategory);
  }, [selectedCategory, roleRecommended]);

  // Top peer recommendations ("Students Like You")
  const peersTargetList = useMemo(() => {
    return roleRecommended.slice(0, 5);
  }, [roleRecommended]);

  // Aggregate metrics for validation modal
  const validationMetrics = useMemo(() => {
    const selectedObjs = selectedCompanies
      .map((name) => VERIFIED_COMPANIES.find((c) => c.name === name))
      .filter(Boolean) as VerifiedCompany[];

    if (selectedObjs.length === 0) {
      return {
        avgDifficulty: 4,
        avgPrepMonths: 6,
        salaryRange: "₹20L–50L",
      };
    }

    const totalDiff = selectedObjs.reduce((acc, c) => acc + c.hiringDifficulty, 0);
    const totalPrep = selectedObjs.reduce((acc, c) => acc + c.estimatedPrepMonths, 0);

    return {
      avgDifficulty: Math.round(totalDiff / selectedObjs.length),
      avgPrepMonths: Math.round(totalPrep / selectedObjs.length),
      salaryRange: selectedObjs[0]?.salaryRange || "₹22L–58L",
    };
  }, [selectedCompanies]);

  // Handle Search Input Keys
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (searchResults.length > 0) {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev + 1) % searchResults.length);
      }
    } else if (e.key === "ArrowUp") {
      if (searchResults.length > 0) {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
      }
    } else if (e.key === "Enter") {
      if (searchResults.length > 0 && searchResults[activeSuggestionIndex]) {
        e.preventDefault();
        const comp = searchResults[activeSuggestionIndex].company;
        onToggle(comp.name);
        setInspectedCompanyId(comp.id);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <div className="w-full relative outline-none space-y-8">
      {/* Screen Header */}
      <div className="text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Step 4 of 8 • AI Company Benchmarking</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
          Target Dream Companies
        </h2>

        <p className="text-slate-400 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
          Search products, developer tools, cloud ecosystems, or verified companies to benchmark your placement readiness.
        </p>

        {/* Target Role Context Pill */}
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500 font-medium">Target Track:</span>
          <span className="text-purple-400 font-bold">{targetRole}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* AI-POWERED COMPANY INTELLIGENCE SEARCH BAR                          */}
      {/* =================================================================== */}
      <div className="max-w-3xl mx-auto relative z-30">
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
            placeholder="Search company, product, cloud, or tool (e.g. VS Code, AWS, React, .NET, DeepMind, CUDA)..."
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
        {/* RAYCAST-STYLE INTELLIGENT COMPANY RESULTS DROPDOWN                */}
        {/* ================================================================= */}
        <AnimatePresence>
          {query.trim().length > 0 && isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="p-3 rounded-2xl bg-slate-950/98 border border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl space-y-2.5 mt-2"
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <Bot className="h-3.5 w-3.5 text-purple-400" />
                  <span>Company Ecosystem Recognition Engine</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {searchResults.length > 0 ? (
                    <span>
                      Found <strong className="text-white">{searchResults.length}</strong> verified organizations
                    </span>
                  ) : (
                    <span>No verified company found</span>
                  )}
                </div>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {searchResults.map((result, idx) => {
                    const isSelectedMatch = idx === activeSuggestionIndex;
                    const isChecked = selectedCompanies.includes(result.company.name);

                    return (
                      <div
                        key={result.company.id}
                        onMouseDown={() => {
                          onToggle(result.company.name);
                          setInspectedCompanyId(result.company.id);
                          setQuery("");
                        }}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                          isSelectedMatch
                            ? "bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50"
                            : "bg-slate-900/70 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-950 border border-slate-800">
                              <CompanyLogo company={result.company} size="md" />
                            </span>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-extrabold text-white">
                                  {result.company.name}
                                </span>

                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                  {result.matchedTrigger}
                                </span>

                                {isChecked && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    ✓ Added to Target List
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-400 mt-0.5">
                                {result.company.industry} • {result.company.headquarters}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-xs">
                              {result.matchScore}% Match
                            </span>

                            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
                              <span>Select</span>
                              <CornerDownLeft className="h-2.5 w-2.5 text-purple-400" />
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation & Skill Diagnostics */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1.5 leading-relaxed">
                          <div className="flex items-start gap-1.5 text-slate-300">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <span>{result.explanation}</span>
                          </div>

                          {/* Matched vs Missing Skills diagnostic */}
                          <div className="flex items-center gap-3 pt-1 border-t border-slate-900 text-[10px] flex-wrap">
                            {result.matchedSkills.length > 0 && (
                              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                                <Check className="h-3 w-3 stroke-[3]" />
                                <span>Matched: {result.matchedSkills.slice(0, 3).join(", ")}</span>
                              </div>
                            )}

                            {result.missingSkills.length > 0 && (
                              <div className="flex items-center gap-1 text-slate-400 font-medium">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>Prep Priority: {result.missingSkills.slice(0, 2).join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center space-y-3">
                  <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    We couldn&apos;t confidently identify this company
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    CareerCompass only benchmarks against verified engineering organizations to guarantee accurate placement readiness scores.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    <span className="text-[11px] text-slate-400 self-center mr-1">Try verified targets:</span>
                    {["Google", "Microsoft", "Amazon", "OpenAI"].map((cName) => (
                      <button
                        key={cName}
                        type="button"
                        onMouseDown={() => {
                          onToggle(cName);
                          const f = VERIFIED_COMPANIES.find((c) => c.name === cName);
                          if (f) setInspectedCompanyId(f.id);
                          setQuery("");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 text-xs font-semibold"
                      >
                        + {cName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =================================================================== */}
      {/* SELECTED TARGET COMPANIES TRAY                                      */}
      {/* =================================================================== */}
      <div className="w-full mx-auto p-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-400 shrink-0" />
          <span className="text-xs font-bold text-white">
            Targeting {selectedCompanies.length} Dream Companies:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 flex-1 justify-start sm:justify-end">
          {selectedCompanies.length > 0 ? (
            selectedCompanies.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-xs"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => onToggle(name)}
                  className="hover:text-white text-purple-400 ml-0.5"
                  aria-label={`Remove ${name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">
              No companies selected yet. Select 2 or more below to benchmark against.
            </span>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* "STUDENTS LIKE YOU" ROLE-BASED RECOMMENDATIONS STRIP                 */}
      {/* =================================================================== */}
      <div className="w-full mx-auto p-4 sm:p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-slate-950/80 to-indigo-950/20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-extrabold text-white tracking-tight">
              Students targeting <strong className="text-purple-300">{targetRole}</strong> usually benchmark against:
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            AI Personalized Cohort
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {peersTargetList.map((comp) => {
            const isAdded = selectedCompanies.includes(comp.name);
            const scoreData = calculateDeterministicCompanyScore(comp, targetRole, userSkills);

            return (
              <div
                key={comp.id}
                onClick={() => {
                  onToggle(comp.name);
                  setInspectedCompanyId(comp.id);
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isAdded
                    ? "bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-950/40"
                    : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0">
                    <CompanyLogo company={comp} size="sm" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{comp.name}</div>
                    <div className="text-[10px] font-semibold text-purple-300">
                      {scoreData.score}% Fit
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isAdded ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {isAdded ? <Check className="h-3 w-3 stroke-[3]" /> : <Plus className="h-3 w-3" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* CATEGORY TABS                                                       */}
      {/* =================================================================== */}
      <div className="w-full mx-auto flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 shrink-0 mr-1 hidden sm:block" />
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/50"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* =================================================================== */}
      {/* RICH COMPANY CARDS GRID                                             */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mx-auto">
        {filteredCatalog.map((comp) => {
          const isSelected = selectedCompanies.includes(comp.name);
          const isInspected = inspectedCompanyId === comp.id;
          const scoreData = calculateDeterministicCompanyScore(comp, targetRole, userSkills);

          return (
            <motion.div
              key={comp.id}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 450, damping: 26 }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                isSelected
                  ? "bg-slate-900/95 border-2 border-purple-500 shadow-xl shadow-purple-950/40"
                  : "bg-slate-950/70 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              } ${isInspected && !isSelected ? "ring-1 ring-purple-400/50" : ""}`}
            >
              <div>
                {/* Card Top: Logo + Name + Star Rating + Checkbox */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                      <CompanyLogo company={comp} size="lg" />
                    </span>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          {comp.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-purple-300">
                          {scoreData.score}% Fit
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{comp.workMode}</span>
                        <span>•</span>
                        <span>{comp.scale}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(comp.name);
                    }}
                    className={`h-7 w-7 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-600/40"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>

                {/* Salary Benchmark & Difficulty */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-900/70 border border-slate-800/80 mb-3.5">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block">Typical CTC</span>
                    <span className="font-extrabold text-emerald-400">{comp.salaryRange}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-slate-400 block">Interview Bar</span>
                    <StarRating count={comp.hiringDifficulty} />
                  </div>
                </div>

                {/* Tech Ecosystem Chips */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {comp.primaryTechnologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {comp.primaryTechnologies.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-medium">
                      +{comp.primaryTechnologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action: Inspect Intelligence Panel */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setInspectedCompanyId(comp.id)}
                  className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 text-[11px] transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Inspect Intelligence</span>
                </button>

                <span className="text-[10px] font-medium text-slate-400">
                  {comp.estimatedPrepMonths} Mo. Prep
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* COMPANY INTELLIGENCE DEEP-DIVE PANEL                                */}
      {/* =================================================================== */}
      {inspectedCompany && (
        <motion.div
          key={inspectedCompany.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full mx-auto p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                <CompanyLogo company={inspectedCompany} size="xl" />
              </span>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {inspectedCompany.name} Company Intelligence
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {inspectedCompany.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {inspectedCompany.industry} • Headquartered in {inspectedCompany.headquarters} • {inspectedCompany.scale}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onToggle(inspectedCompany.name)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
                  selectedCompanies.includes(inspectedCompany.name)
                    ? "bg-purple-600 text-white shadow-purple-600/30"
                    : "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white"
                }`}
              >
                {selectedCompanies.includes(inspectedCompany.name) ? (
                  <>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Selected Target</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to Targets</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span>Interview Difficulty</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-white">
                <StarRating count={inspectedCompany.hiringDifficulty} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>Preparation Timeline</span>
              </div>
              <div className="text-sm sm:text-base font-black text-white">
                {inspectedCompany.estimatedPrepMonths} Months
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>Compensation Range</span>
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-400">
                {inspectedCompany.salaryRange}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mb-1">
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span>Role Alignment</span>
              </div>
              <div className="text-sm sm:text-base font-black text-purple-300">
                {calculateDeterministicCompanyScore(inspectedCompany, targetRole, userSkills).score}% Match
              </div>
            </div>
          </div>

          {/* INTERVIEW STAGES PIPELINE (OA -> Technical -> System Design -> Manager -> HR) */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Typical Interview Pipeline Stages:</span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 text-xs">
              {inspectedCompany.interviewStages.map((stage, idx) => (
                <React.Fragment key={stage.name}>
                  <div className="flex-1 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-400 block mb-0.5">
                        STAGE {idx + 1}
                      </span>
                      <strong className="text-white text-xs block">{stage.name}</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block leading-tight">
                      {stage.desc}
                    </span>
                  </div>

                  {idx < inspectedCompany.interviewStages.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-600 hidden md:block shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* DYNAMIC AI MENTOR COMMENTARY (Speaks in Active Companion Voice) */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
            <div
              className="p-1 rounded-xl border shrink-0 mt-0.5"
              style={{
                backgroundColor: `${mentor.signatureColor}20`,
                borderColor: `${mentor.signatureColor}40`,
              }}
            >
              <CompanionAvatar id={mentor.id} size={42} emotion="idle" />
            </div>

            <div className="text-xs text-slate-200 leading-relaxed">
              <div className="flex items-center gap-1.5 mb-1 font-bold text-white">
                <span style={{ color: mentor.signatureColor }}>{mentor.name}&apos;s Benchmark Verdict:</span>
              </div>
              <p className="italic text-slate-300">
                &ldquo;
                {inspectedCompany.mentorCommentary[
                  (mentor.id as keyof typeof inspectedCompany.mentorCommentary) || "athena"
                ]}
                &rdquo;
              </p>
            </div>
          </div>

          {/* Related Companies Strip */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Frequently Targeted Together:
            </div>
            <div className="flex flex-wrap gap-2">
              {inspectedCompany.relatedCompanyIds.map((rId) => {
                const rComp = getVerifiedCompanyById(rId);
                if (!rComp) return null;
                const isAdded = selectedCompanies.includes(rComp.name);

                return (
                  <button
                    key={rId}
                    type="button"
                    onClick={() => {
                      onToggle(rComp.name);
                      setInspectedCompanyId(rComp.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? "bg-purple-950/60 border border-purple-500/50 text-purple-200"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>
                      <CompanyLogo company={rComp} size="xs" />
                    </span>
                    <span>{rComp.name}</span>
                    {isAdded ? <Check className="h-3 w-3 text-emerald-400" /> : <Plus className="h-3 w-3 text-slate-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* =================================================================== */}
      {/* FINAL VALIDATION CONFIRMATION MODAL                                 */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showValidationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="max-w-md w-full p-6 rounded-3xl border border-purple-500/40 bg-slate-950 shadow-2xl shadow-purple-950/60 text-center space-y-4"
            >
              <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                <Target className="h-6 w-6 text-purple-400" />
              </div>

              <h3 className="text-xl font-extrabold text-white">
                Confirm Benchmark Targets
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                CareerCompass will calibrate your placement readiness roadmap against these verified target companies:
              </p>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Target Organizations ({selectedCompanies.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompanies.map((name) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 rounded-lg bg-purple-950/50 border border-purple-600/40 text-purple-200 text-xs font-semibold"
                      >
                        ✔ {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Average Difficulty</span>
                    <strong className="text-amber-400 font-bold">
                      {"★".repeat(validationMetrics.avgDifficulty)} ({validationMetrics.avgDifficulty}/5 Bar)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Timeline</span>
                    <strong className="text-white font-bold">
                      ~{validationMetrics.avgPrepMonths} Months Prep
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowValidationModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Edit Targets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowValidationModal(false);
                    onNext();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                >
                  Confirm & Benchmark Readiness →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* SCREEN NAVIGATION FOOTER                                            */}
      {/* =================================================================== */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-900 w-full mx-auto relative z-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
        >
          ← Back to Dream Role
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            <strong className="text-purple-400 font-bold">
              {selectedCompanies.length}
            </strong>{" "}
            Companies Selected
          </span>

          <button
            type="button"
            onClick={() => {
              if (selectedCompanies.length > 0) {
                setShowValidationModal(true);
              }
            }}
            disabled={selectedCompanies.length === 0}
            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div className="text-left">
              <div>Continue</div>
              <div className="text-[10px] text-purple-200 font-medium">
                Next: Education Background →
              </div>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
