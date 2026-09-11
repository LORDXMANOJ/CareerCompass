// =============================================================================
// CareerCompass — Problem Intelligence Engine
// =============================================================================
// Deterministic recommendation engine, topic coverage analytics, and problem
// filtering utilities. Zero fabrication — scores are computed from the user's
// actual onboarding profile, skill gaps, target role, and target companies.
// =============================================================================

import { OnboardingState } from "@/types";
import {
  CodingProblem,
  ProblemRecommendation,
  RecommendationScoreBreakdown,
  ProblemStats,
  TopicCoverageItem,
  UserProblemAttempt,
  ProblemTopic,
  ConfidenceLevel,
} from "@/types/problems";
import { ROLE_CATALOG } from "@/constants/roles";
import { DSA_TOPICS } from "@/constants/problems-catalog";

// ---------------------------------------------------------------------------
// Recommendation Weights
// ---------------------------------------------------------------------------
const W_GAP = 0.35;
const W_ROLE = 0.25;
const W_COMPANY = 0.25;
const W_DIFFICULTY = 0.15;
const SOLVED_PENALTY = 100; // Effectively removes solved problems

// ---------------------------------------------------------------------------
// Difficulty Fit Scoring
// ---------------------------------------------------------------------------
function difficultyFitScore(
  difficulty: CodingProblem["difficulty"],
  dsaLevel: string
): number {
  const levelMap: Record<string, number> = {
    never: 0,
    learning: 1,
    medium: 2,
    strong: 3,
    competitive: 4,
  };
  const diffMap: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
  const userLevel = levelMap[dsaLevel] ?? 1;
  const problemLevel = diffMap[difficulty] ?? 2;

  // Best fit: problem is at or slightly above user level
  const gap = problemLevel - userLevel;
  if (gap === 0) return 1.0;
  if (gap === 1) return 0.85;
  if (gap === -1) return 0.6;
  if (gap >= 2) return 0.4;
  return 0.3;
}

// ---------------------------------------------------------------------------
// Skill Gap Weight Computation
// ---------------------------------------------------------------------------
function computeSkillGapWeight(
  problem: CodingProblem,
  state: OnboardingState
): { weight: number; gapName?: string } {
  const skills = state.skills || { languages: [], frameworks: [], databases: [], aiTools: [] };
  const allClaimed = [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.databases || []),
    ...(skills.aiTools || []),
  ].map((s) => s.toLowerCase());

  const matchedRole = ROLE_CATALOG.find(
    (r) => r.name.toLowerCase() === state.targetRole.toLowerCase() || r.id === state.targetRole.toLowerCase()
  ) || ROLE_CATALOG[0];

  const roleTopSkills = matchedRole.topSkills.map((s) => s.toLowerCase());

  // Find skills required by the role that the user hasn't claimed
  const missingSkills = roleTopSkills.filter(
    (rs) => !allClaimed.some((cs) => cs.includes(rs) || rs.includes(cs))
  );

  // Check if the problem's topic/tags address any missing skill
  const problemTopicLower = problem.topic.toLowerCase();
  const problemTagsLower = problem.tags.map((t) => t.toLowerCase());

  for (const missing of missingSkills) {
    if (
      problemTopicLower.includes(missing) ||
      missing.includes(problemTopicLower) ||
      problemTagsLower.some((t) => t.includes(missing) || missing.includes(t))
    ) {
      return { weight: 1.0, gapName: missing };
    }
  }

  // DSA gap check — if DSA is weak and the problem is a DSA problem
  const dsaLevel = state.experience?.dsaLevel || "never";
  if (dsaLevel === "never" || dsaLevel === "learning") {
    const dsaTopics = ["arrays", "dynamic programming", "graphs", "trees", "sorting", "binary search", "stack", "linked list"];
    if (dsaTopics.some((t) => problemTopicLower.includes(t))) {
      return { weight: 0.85, gapName: "DSA" };
    }
  }

  // Check if problem tags match any claimed-but-unverified skill
  const verification = skills.verification || {};
  const unverifiedSkills = allClaimed.filter((s) => {
    const record = verification[s];
    return !record || !record.isCorrect;
  });

  for (const unverified of unverifiedSkills) {
    if (
      problemTopicLower.includes(unverified) ||
      unverified.includes(problemTopicLower) ||
      problemTagsLower.some((t) => t.includes(unverified) || unverified.includes(t))
    ) {
      return { weight: 0.6, gapName: unverified };
    }
  }

  return { weight: 0.2 };
}

// ---------------------------------------------------------------------------
// Role Relevance Score
// ---------------------------------------------------------------------------
function computeRoleRelevance(problem: CodingProblem, targetRole: string): number {
  const matchedRole = ROLE_CATALOG.find(
    (r) => r.name.toLowerCase() === targetRole.toLowerCase() || r.id === targetRole.toLowerCase()
  ) || ROLE_CATALOG[0];

  return problem.roleRelevance[matchedRole.id] ?? 0.5;
}

// ---------------------------------------------------------------------------
// Company Match Score
// ---------------------------------------------------------------------------
function computeCompanyMatch(problem: CodingProblem, targetCompanies: string[]): { score: number; matchedCompany?: string } {
  if (!targetCompanies.length || !problem.companyTags.length) {
    return { score: 0.1 };
  }

  const normalizedTargets = targetCompanies.map((c) => c.toLowerCase());

  for (const tag of problem.companyTags) {
    if (normalizedTargets.some((tc) => tc.includes(tag) || tag.includes(tc))) {
      return { score: 1.0, matchedCompany: tag };
    }
  }

  return { score: 0.1 };
}

// ---------------------------------------------------------------------------
// Main Recommendation Engine
// ---------------------------------------------------------------------------
export function computeProblemRecommendations(
  state: OnboardingState,
  solvedIds: string[],
  catalog: CodingProblem[],
  maxResults: number = 10
): ProblemRecommendation[] {
  const solvedSet = new Set(solvedIds);
  const dsaLevel = state.experience?.dsaLevel || "never";

  const scored: ProblemRecommendation[] = catalog.map((problem) => {
    const isSolved = solvedSet.has(problem.id);
    const { weight: gapWeight, gapName } = computeSkillGapWeight(problem, state);
    const roleRel = computeRoleRelevance(problem, state.targetRole || "Software Engineer");
    const { score: companyScore, matchedCompany } = computeCompanyMatch(problem, state.targetCompanies || []);
    const diffFit = difficultyFitScore(problem.difficulty, dsaLevel);
    const penalty = isSolved ? SOLVED_PENALTY : 0;

    const totalScore =
      W_GAP * gapWeight * 100 +
      W_ROLE * roleRel * 100 +
      W_COMPANY * companyScore * 100 +
      W_DIFFICULTY * diffFit * 100 -
      penalty;

    const breakdown: RecommendationScoreBreakdown = {
      skillGapWeight: Math.round(gapWeight * 100),
      roleRelevance: Math.round(roleRel * 100),
      companyMatch: Math.round(companyScore * 100),
      difficultyFit: Math.round(diffFit * 100),
      solvedPenalty: penalty,
      totalScore: Math.round(totalScore),
    };

    // Build human-readable reason
    const reasons: string[] = [];
    if (gapName) reasons.push(`Addresses your ${gapName} gap`);
    if (matchedCompany) reasons.push(`Asked by ${matchedCompany}`);
    if (diffFit >= 0.85) reasons.push(`Right difficulty for your level`);
    if (roleRel >= 0.8) reasons.push(`Core for ${state.targetRole || "your target role"}`);
    const reason = reasons.length > 0 ? reasons.join(" · ") : `Relevant practice for ${problem.topic}`;

    return {
      problem,
      score: breakdown,
      reason,
      addressesGap: gapName,
      relevantCompany: matchedCompany,
    };
  });

  // Sort by total score descending, filter out solved
  return scored
    .filter((r) => r.score.solvedPenalty === 0)
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .slice(0, maxResults);
}

// ---------------------------------------------------------------------------
// Problem Statistics Computation
// ---------------------------------------------------------------------------
export function computeProblemStats(
  attempts: UserProblemAttempt[],
  catalog: CodingProblem[]
): ProblemStats {
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));
  const solvedIds = new Set<string>();
  const attemptedIds = new Set<string>();
  const skippedIds = new Set<string>();

  let confidenceSum = 0;
  let confidenceCount = 0;

  for (const attempt of attempts) {
    if (attempt.status === "solved_independent" || attempt.status === "solved_with_help") {
      solvedIds.add(attempt.problemId);
    }
    if (attempt.status === "attempted") {
      attemptedIds.add(attempt.problemId);
    }
    if (attempt.status === "skipped") {
      skippedIds.add(attempt.problemId);
    }

    const confMap: Record<ConfidenceLevel, number> = {
      couldnt_start: 1,
      understood_idea: 2,
      needed_hints: 3,
      solved_with_help: 4,
      solved_independently: 5,
    };
    confidenceSum += confMap[attempt.confidence] ?? 3;
    confidenceCount++;
  }

  const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const id of solvedIds) {
    const problem = catalogMap.get(id);
    if (problem) {
      if (problem.difficulty === "Easy") solvedByDifficulty.easy++;
      else if (problem.difficulty === "Medium") solvedByDifficulty.medium++;
      else if (problem.difficulty === "Hard") solvedByDifficulty.hard++;
    }
  }

  const topicCoverage = getTopicCoverage(attempts, catalog);

  const avgConf = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;
  const avgConfLabel =
    avgConf >= 4.5 ? "Strong" :
    avgConf >= 3.5 ? "Good" :
    avgConf >= 2.5 ? "Developing" :
    avgConf >= 1.5 ? "Beginner" : "Not Started";

  const sorted = [...topicCoverage].sort((a, b) => b.solvedCount - a.solvedCount);
  const mostPracticed = sorted.find((t) => t.solvedCount > 0)?.topic || "None";
  const weakest = [...topicCoverage]
    .filter((t) => t.totalProblems > 0)
    .sort((a, b) => a.coveragePercent - b.coveragePercent)[0]?.topic || "None";

  return {
    totalAttempted: attemptedIds.size + solvedIds.size,
    totalSolved: solvedIds.size,
    totalSkipped: skippedIds.size,
    solvedByDifficulty,
    topicCoverage,
    averageConfidence: avgConfLabel,
    mostPracticedTopic: mostPracticed,
    weakestTopic: weakest,
  };
}

// ---------------------------------------------------------------------------
// Topic Coverage Analysis
// ---------------------------------------------------------------------------
export function getTopicCoverage(
  attempts: UserProblemAttempt[],
  catalog: CodingProblem[]
) : TopicCoverageItem[] {
  const solvedIds = new Set(
    attempts
      .filter((a) => a.status === "solved_independent" || a.status === "solved_with_help")
      .map((a) => a.problemId)
  );
  const attemptedIds = new Set(
    attempts.filter((a) => a.status === "attempted").map((a) => a.problemId)
  );

  // Count total problems per topic in the catalog
  const topicTotal = new Map<ProblemTopic, number>();
  const topicSolved = new Map<ProblemTopic, number>();
  const topicAttempted = new Map<ProblemTopic, number>();

  for (const problem of catalog) {
    topicTotal.set(problem.topic, (topicTotal.get(problem.topic) || 0) + 1);

    if (solvedIds.has(problem.id)) {
      topicSolved.set(problem.topic, (topicSolved.get(problem.topic) || 0) + 1);
    }
    if (attemptedIds.has(problem.id)) {
      topicAttempted.set(problem.topic, (topicAttempted.get(problem.topic) || 0) + 1);
    }
  }

  // Only include topics that have problems in the catalog
  const topicsWithProblems = DSA_TOPICS.filter((t) => (topicTotal.get(t) || 0) > 0);

  return topicsWithProblems.map((topic) => {
    const total = topicTotal.get(topic) || 0;
    const solved = topicSolved.get(topic) || 0;
    const attempted = topicAttempted.get(topic) || 0;

    return {
      topic,
      totalProblems: total,
      solvedCount: solved,
      attemptedCount: attempted,
      coveragePercent: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Filtering Utilities
// ---------------------------------------------------------------------------

export function getProblemsByTopic(catalog: CodingProblem[], topic: string): CodingProblem[] {
  return catalog.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
}

export function getProblemsByCompany(catalog: CodingProblem[], companyId: string): CodingProblem[] {
  const normalized = companyId.toLowerCase();
  return catalog.filter((p) =>
    p.companyTags.some((ct) => ct.toLowerCase() === normalized)
  );
}

export function getProblemsByRole(catalog: CodingProblem[], roleId: string): CodingProblem[] {
  const normalized = roleId.toLowerCase();
  return catalog.filter((p) => (p.roleRelevance[normalized] ?? 0) >= 0.7);
}

export function getProblemsByDifficulty(catalog: CodingProblem[], difficulty: CodingProblem["difficulty"]): CodingProblem[] {
  return catalog.filter((p) => p.difficulty === difficulty);
}

export function getProblemsByProvider(catalog: CodingProblem[], provider: CodingProblem["provider"]): CodingProblem[] {
  return catalog.filter((p) => p.provider === provider);
}
