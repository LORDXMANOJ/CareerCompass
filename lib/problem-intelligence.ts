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
  ProblemDifficulty,
  ConfidenceLevel,
  FrictionType,
  TopicMasteryState,
  TopicPerformance,
  DifficultyPerformance,
  AdaptivePracticeProfile,
  RecommendationCategory,
} from "@/types/problems";
import { ROLE_CATALOG } from "@/constants/roles";
import { DSA_TOPICS, PROBLEMS_CATALOG } from "@/constants/problems-catalog";

// ---------------------------------------------------------------------------
// Roadmap Phase Mapping
// ---------------------------------------------------------------------------
export function getRoadmapPhaseForTopic(topic: ProblemTopic): string {
  switch (topic) {
    case "Arrays":
    case "Strings":
    case "Hash Map":
    case "Two Pointers":
    case "Sliding Window":
    case "Prefix Sum":
      return "Roadmap Phase 1: Algorithmic Foundations & Core Patterns";

    case "Linked List":
    case "Stack":
    case "Queue":
    case "Binary Search":
    case "Trees":
    case "Binary Trees":
    case "Binary Search Trees":
    case "Heaps":
      return "Roadmap Phase 2: Core Data Structures & Optimization";

    case "Graphs":
    case "Dynamic Programming":
    case "Backtracking":
    case "Recursion":
    case "Greedy":
    case "Intervals":
    case "Trie":
    case "Union Find":
      return "Roadmap Phase 3: Advanced Problem Solving & Complex Algorithms";

    case "Bit Manipulation":
    case "Math":
    case "Matrix":
    case "Sorting":
    case "Implementation":
    case "Constructive":
    case "Brute Force":
    default:
      return "Roadmap Phase 4: Competitive Patterns & Production Architecture";
  }
}

// ---------------------------------------------------------------------------
// Topic Performance & Gap Analysis Engine (Stage 4)
// ---------------------------------------------------------------------------
export function analyzeTopicPerformance(
  attempts: UserProblemAttempt[],
  catalog: CodingProblem[] = PROBLEMS_CATALOG
): Record<string, TopicPerformance> {
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));
  const topicTotal = new Map<ProblemTopic, number>();

  for (const problem of catalog) {
    topicTotal.set(problem.topic, (topicTotal.get(problem.topic) || 0) + 1);
  }

  const topicAttemptsMap = new Map<ProblemTopic, UserProblemAttempt[]>();

  for (const attempt of attempts) {
    const problem = catalogMap.get(attempt.problemId);
    if (problem) {
      const existing = topicAttemptsMap.get(problem.topic) || [];
      existing.push(attempt);
      topicAttemptsMap.set(problem.topic, existing);
    }
  }

  const result: Record<string, TopicPerformance> = {};

  const confidenceScoreMap: Record<ConfidenceLevel, number> = {
    couldnt_start: 1,
    understood_idea: 2,
    needed_hints: 3,
    solved_with_help: 4,
    solved_independently: 5,
  };

  for (const topic of DSA_TOPICS) {
    const totalCatalog = topicTotal.get(topic) || 0;
    if (totalCatalog === 0) continue;

    const topicAttempts = topicAttemptsMap.get(topic) || [];
    const attemptsCount = topicAttempts.length;

    const solvedAttempts = topicAttempts.filter(
      (a) => a.status === "solved_independent" || a.status === "solved_with_help"
    );
    const solvedCount = solvedAttempts.length;
    const solveRate = attemptsCount > 0 ? Number((solvedCount / attemptsCount).toFixed(2)) : 0;

    let totalConfidence = 0;
    for (const a of topicAttempts) {
      totalConfidence += confidenceScoreMap[a.confidence] ?? 3;
    }
    const averageConfidence =
      attemptsCount > 0 ? Number((totalConfidence / attemptsCount).toFixed(1)) : 0;

    // Difficulty breakdown
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    for (const a of solvedAttempts) {
      const p = catalogMap.get(a.problemId);
      if (p?.difficulty === "Hard") hardSolved++;
      else if (p?.difficulty === "Medium") mediumSolved++;
      else easySolved++;
    }

    // Identify primary friction
    const frictionCounts: Record<string, number> = {};
    for (const a of topicAttempts) {
      if (a.primaryFriction && a.primaryFriction !== "none") {
        frictionCounts[a.primaryFriction] = (frictionCounts[a.primaryFriction] || 0) + 1;
      }
    }
    const topFriction = Object.entries(frictionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as FrictionType | undefined;

    // Determine mastery state with conservative criteria (Zero Fabrication)
    let masteryState: TopicMasteryState = "Unknown";
    if (attemptsCount === 0) {
      masteryState = "Unknown";
    } else if (solvedCount === 0 || (attemptsCount >= 2 && solveRate < 0.4) || averageConfidence < 2.2) {
      masteryState = "Weak";
    } else if (solvedCount >= 5 && solveRate >= 0.8 && averageConfidence >= 4.0 && (mediumSolved >= 2 || hardSolved >= 1)) {
      masteryState = "Strong";
    } else if (solvedCount >= 2 && solveRate >= 0.65 && averageConfidence >= 3.2) {
      masteryState = "Competent";
    } else {
      masteryState = "Developing";
    }

    // Check if reinforcement is needed
    const lastAttempt = topicAttempts[topicAttempts.length - 1];
    const recentFriction = lastAttempt && lastAttempt.primaryFriction && lastAttempt.primaryFriction !== "none";
    const recentLowConfidence = lastAttempt && (lastAttempt.confidence === "couldnt_start" || lastAttempt.confidence === "needed_hints");
    const needsReinforcement = Boolean(masteryState === "Weak" || recentFriction || recentLowConfidence);

    result[topic] = {
      topic,
      totalCatalogProblems: totalCatalog,
      attemptsCount,
      solvedCount,
      solveRate,
      averageConfidence,
      masteryState,
      primaryFriction: topFriction || null,
      difficultyBreakdown: { easySolved, mediumSolved, hardSolved },
      lastPracticedDate: lastAttempt?.createdAt || null,
      needsReinforcement,
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Difficulty Performance Analysis (Stage 5)
// ---------------------------------------------------------------------------
export function analyzeDifficultyPerformance(
  attempts: UserProblemAttempt[],
  catalog: CodingProblem[] = PROBLEMS_CATALOG
): Record<ProblemDifficulty, DifficultyPerformance> {
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));
  const tiers: ProblemDifficulty[] = ["Easy", "Medium", "Hard"];

  const confMap: Record<ConfidenceLevel, number> = {
    couldnt_start: 1,
    understood_idea: 2,
    needed_hints: 3,
    solved_with_help: 4,
    solved_independently: 5,
  };

  const result: Record<ProblemDifficulty, DifficultyPerformance> = {
    Easy: { difficulty: "Easy", attemptedCount: 0, solvedCount: 0, solveRate: 0, averageConfidence: 0, primaryFriction: null },
    Medium: { difficulty: "Medium", attemptedCount: 0, solvedCount: 0, solveRate: 0, averageConfidence: 0, primaryFriction: null },
    Hard: { difficulty: "Hard", attemptedCount: 0, solvedCount: 0, solveRate: 0, averageConfidence: 0, primaryFriction: null },
  };

  for (const tier of tiers) {
    const tierAttempts = attempts.filter((a) => {
      const p = catalogMap.get(a.problemId);
      return p?.difficulty === tier;
    });

    const attemptedCount = tierAttempts.length;
    const solvedCount = tierAttempts.filter(
      (a) => a.status === "solved_independent" || a.status === "solved_with_help"
    ).length;
    const solveRate = attemptedCount > 0 ? Number((solvedCount / attemptedCount).toFixed(2)) : 0;

    let totalConf = 0;
    const frictionMap: Record<string, number> = {};
    for (const a of tierAttempts) {
      totalConf += confMap[a.confidence] ?? 3;
      if (a.primaryFriction && a.primaryFriction !== "none") {
        frictionMap[a.primaryFriction] = (frictionMap[a.primaryFriction] || 0) + 1;
      }
    }
    const averageConfidence = attemptedCount > 0 ? Number((totalConf / attemptedCount).toFixed(1)) : 0;
    const topFriction = Object.entries(frictionMap).sort((a, b) => b[1] - a[1])[0]?.[0] as FrictionType | undefined;

    result[tier] = {
      difficulty: tier,
      attemptedCount,
      solvedCount,
      solveRate,
      averageConfidence,
      primaryFriction: topFriction || null,
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Adaptive Practice Profile Synthesizer (Stage 2/5/8)
// ---------------------------------------------------------------------------
export function computeAdaptivePracticeProfile(
  attempts: UserProblemAttempt[],
  catalog: CodingProblem[] = PROBLEMS_CATALOG,
  state?: OnboardingState
): AdaptivePracticeProfile {
  const topicPerformances = analyzeTopicPerformance(attempts, catalog);
  const difficultyPerformances = analyzeDifficultyPerformance(attempts, catalog);

  const weakTopics: ProblemTopic[] = [];
  const developingTopics: ProblemTopic[] = [];
  const strongTopics: ProblemTopic[] = [];

  for (const [topicStr, perf] of Object.entries(topicPerformances)) {
    const topic = topicStr as ProblemTopic;
    if (perf.masteryState === "Weak") weakTopics.push(topic);
    else if (perf.masteryState === "Developing") developingTopics.push(topic);
    else if (perf.masteryState === "Strong") strongTopics.push(topic);
  }

  // Calculate overall metrics
  const totalAttempts = attempts.length;
  const totalSolved = attempts.filter(
    (a) => a.status === "solved_independent" || a.status === "solved_with_help"
  ).length;
  const overallSolveRate = totalAttempts > 0 ? Number((totalSolved / totalAttempts).toFixed(2)) : 0;

  const confMap: Record<ConfidenceLevel, number> = {
    couldnt_start: 1,
    understood_idea: 2,
    needed_hints: 3,
    solved_with_help: 4,
    solved_independently: 5,
  };
  const totalConfSum = attempts.reduce((acc, a) => acc + (confMap[a.confidence] ?? 3), 0);
  const overallConfidence = totalAttempts > 0 ? Number((totalConfSum / totalAttempts).toFixed(1)) : 3.0;

  // Recent friction points (last 8 attempts)
  const recentFrictionPoints = attempts
    .slice(-8)
    .map((a) => a.primaryFriction)
    .filter((f): f is FrictionType => Boolean(f && f !== "none"));

  // Consecutive active streak in days
  const activeDates = Array.from(
    new Set(attempts.map((a) => a.createdAt.slice(0, 10)))
  ).sort().reverse();

  let streak = 0;
  if (activeDates.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (activeDates[0] === today || activeDates[0] === yesterday) {
      streak = 1;
      let prev = new Date(activeDates[0]).getTime();
      for (let i = 1; i < activeDates.length; i++) {
        const curr = new Date(activeDates[i]).getTime();
        const diffDays = Math.round((prev - curr) / 86400000);
        if (diffDays === 1) {
          streak++;
          prev = curr;
        } else {
          break;
        }
      }
    }
  }

  // Recommended focus topic
  let recommendedFocusTopic: ProblemTopic = "Arrays";
  if (weakTopics.length > 0) {
    recommendedFocusTopic = weakTopics[0];
  } else if (developingTopics.length > 0) {
    recommendedFocusTopic = developingTopics[0];
  } else if (totalSolved < 4) {
    recommendedFocusTopic = state?.targetRole === "backend-developer" ? "Linked List" : "Arrays";
  } else {
    // Unpracticed topic with role relevance
    const unpracticed = Object.values(topicPerformances).filter((t) => t.masteryState === "Unknown");
    recommendedFocusTopic = unpracticed[0]?.topic || "Dynamic Programming";
  }

  // Recommended difficulty
  let recommendedDifficulty: ProblemDifficulty = "Easy";
  const easyPerf = difficultyPerformances.Easy;
  const medPerf = difficultyPerformances.Medium;

  if (easyPerf.solvedCount >= 3 && easyPerf.solveRate >= 0.7) {
    if (medPerf.solvedCount >= 5 && medPerf.solveRate >= 0.75 && overallConfidence >= 4.0) {
      recommendedDifficulty = "Hard";
    } else {
      recommendedDifficulty = "Medium";
    }
  } else {
    recommendedDifficulty = "Easy";
  }

  // Adaptive reasoning
  let adaptiveReasoning = `Adaptive focus calibrated to ${recommendedFocusTopic} at ${recommendedDifficulty} difficulty.`;
  if (weakTopics.length > 0) {
    adaptiveReasoning = `Reinforcing ${weakTopics[0]} based on recent friction notes and solve feedback. Foundational practice prioritized before advancing.`;
  } else if (easyPerf.solvedCount >= 4 && easyPerf.solveRate >= 0.75) {
    adaptiveReasoning = `Solid Easy problem mastery detected (${easyPerf.solvedCount} solved at ${(easyPerf.solveRate * 100).toFixed(0)}% solve rate). Escalating recommendation target to Medium tier.`;
  }

  return {
    overallConfidence,
    overallSolveRate,
    topicPerformances,
    difficultyPerformances,
    weakTopics,
    developingTopics,
    strongTopics,
    recentFrictionPoints,
    currentStreak: streak,
    recommendedFocusTopic,
    recommendedDifficulty,
    adaptiveReasoning,
  };
}

// ---------------------------------------------------------------------------
// Recommendation Weights
// ---------------------------------------------------------------------------
const W_WEAK_TOPIC = 0.30;
const W_GAP = 0.20;
const W_ROLE = 0.20;
const W_COMPANY = 0.15;
const W_DIFFICULTY = 0.15;
const SOLVED_PENALTY = 100;

// ---------------------------------------------------------------------------
// Topic-Specific Difficulty Fit Scoring (Stage 5)
// ---------------------------------------------------------------------------
function topicDifficultyFitScore(
  problem: CodingProblem,
  topicPerf: TopicPerformance | undefined,
  profileRecommendedDifficulty: ProblemDifficulty
): number {
  if (!topicPerf || topicPerf.masteryState === "Unknown") {
    // Default to Easy or Profile recommended
    if (problem.difficulty === profileRecommendedDifficulty) return 1.0;
    if (problem.difficulty === "Easy") return 0.9;
    if (problem.difficulty === "Medium") return 0.6;
    return 0.3;
  }

  if (topicPerf.masteryState === "Weak") {
    if (problem.difficulty === "Easy") return 1.0;
    if (problem.difficulty === "Medium") return 0.5;
    return 0.1; // Do not spam Hard on weak topics!
  }

  if (topicPerf.masteryState === "Developing") {
    if (problem.difficulty === "Medium") return 1.0;
    if (problem.difficulty === "Easy") return 0.75;
    return 0.4;
  }

  if (topicPerf.masteryState === "Competent") {
    if (problem.difficulty === "Medium") return 1.0;
    if (problem.difficulty === "Hard") return 0.85;
    return 0.5;
  }

  if (topicPerf.masteryState === "Strong") {
    if (problem.difficulty === "Hard") return 1.0;
    if (problem.difficulty === "Medium") return 0.85;
    return 0.4;
  }

  return 0.5;
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
    (r) => r.name.toLowerCase() === (state.targetRole || "").toLowerCase() || r.id === (state.targetRole || "").toLowerCase()
  ) || ROLE_CATALOG[0];

  const roleTopSkills = matchedRole.topSkills.map((s) => s.toLowerCase());

  const missingSkills = roleTopSkills.filter(
    (rs) => !allClaimed.some((cs) => cs.includes(rs) || rs.includes(cs))
  );

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

  const dsaLevel = state.experience?.dsaLevel || "never";
  if (dsaLevel === "never" || dsaLevel === "learning") {
    const dsaTopics = ["arrays", "dynamic programming", "graphs", "trees", "sorting", "binary search", "stack", "linked list"];
    if (dsaTopics.some((t) => problemTopicLower.includes(t))) {
      return { weight: 0.85, gapName: "DSA" };
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

  const normalizedTargets = targetCompanies.map((c) => ({ raw: c, lower: c.toLowerCase() }));

  for (const tag of problem.companyTags) {
    const match = normalizedTargets.find((tc) => tc.lower.includes(tag.toLowerCase()) || tag.toLowerCase().includes(tc.lower));
    if (match) {
      return { score: 1.0, matchedCompany: match.raw };
    }
  }

  return { score: 0.1 };
}

// ---------------------------------------------------------------------------
// Recommendation Engine V2 (Stage 6, 7, 8)
// ---------------------------------------------------------------------------
export function computeProblemRecommendations(
  state: OnboardingState,
  solvedIds: string[],
  catalog: CodingProblem[] = PROBLEMS_CATALOG,
  maxResults: number = 12,
  userAttempts: UserProblemAttempt[] = []
): ProblemRecommendation[] {
  const solvedSet = new Set(solvedIds);
  const profile = computeAdaptivePracticeProfile(userAttempts, catalog, state);
  const roleName = state.targetRole || "Software Engineer";

  const scored: ProblemRecommendation[] = catalog.map((problem) => {
    const isSolved = solvedSet.has(problem.id);
    const topicPerf = profile.topicPerformances[problem.topic];

    // Factor 1: Weak/Developing topic weight (Stage 4 & 8)
    let topicPriorityScore = 0.4;
    if (topicPerf) {
      if (topicPerf.masteryState === "Weak") topicPriorityScore = 1.0;
      else if (topicPerf.masteryState === "Developing") topicPriorityScore = 0.8;
      else if (topicPerf.masteryState === "Unknown") topicPriorityScore = 0.6;
      else if (topicPerf.masteryState === "Competent") topicPriorityScore = 0.5;
      else topicPriorityScore = 0.3; // Strong topics receive lower priority to diversify
    }

    // Factor 2: Skill gap weight
    const { weight: gapWeight, gapName } = computeSkillGapWeight(problem, state);

    // Factor 3: Target Role relevance
    const roleRel = computeRoleRelevance(problem, roleName);

    // Factor 4: Target Company match
    const { score: companyScore, matchedCompany } = computeCompanyMatch(problem, state.targetCompanies || []);

    // Factor 5: Adaptive difficulty fit per topic (Stage 5)
    const diffFit = topicDifficultyFitScore(problem, topicPerf, profile.recommendedDifficulty);

    // Reinforcement bonus if topic recently had high friction (Stage 8)
    let reinforcementBonus = 0;
    if (topicPerf?.needsReinforcement && problem.difficulty !== "Hard") {
      reinforcementBonus = 15;
    }

    const penalty = isSolved ? SOLVED_PENALTY : 0;

    const totalScore =
      W_WEAK_TOPIC * topicPriorityScore * 100 +
      W_GAP * gapWeight * 100 +
      W_ROLE * roleRel * 100 +
      W_COMPANY * companyScore * 100 +
      W_DIFFICULTY * diffFit * 100 +
      reinforcementBonus -
      penalty;

    const breakdown: RecommendationScoreBreakdown = {
      skillGapWeight: Math.round(gapWeight * 100),
      roleRelevance: Math.round(roleRel * 100),
      companyMatch: Math.round(companyScore * 100),
      difficultyFit: Math.round(diffFit * 100),
      solvedPenalty: penalty,
      totalScore: Math.round(totalScore),
    };

    // Determine recommendation category for diversity (Stage 7)
    let category: RecommendationCategory = "foundation";
    if (topicPerf?.masteryState === "Weak" || topicPerf?.needsReinforcement) {
      category = "targeted_weakness";
    } else if (companyScore >= 0.8 || roleRel >= 0.85) {
      category = "role_company";
    } else if (problem.difficulty === "Hard" || (problem.difficulty === "Medium" && profile.recommendedDifficulty === "Hard")) {
      category = "stretch";
    } else if (isSolved) {
      category = "review";
    } else {
      category = "foundation";
    }

    // Human-readable, explainable reason (Stage 6)
    const reasons: string[] = [];
    if (topicPerf?.needsReinforcement) {
      reasons.push(`Reinforces your ${problem.topic} foundations`);
    } else if (topicPerf?.masteryState === "Weak") {
      reasons.push(`${problem.topic} is currently a priority gap`);
    } else if (matchedCompany) {
      reasons.push(`High interview frequency at ${matchedCompany}`);
    } else if (roleRel >= 0.85) {
      reasons.push(`Core expectation for ${roleName}`);
    } else if (gapName) {
      reasons.push(`Addresses your ${gapName} gap`);
    } else if (diffFit >= 0.9) {
      reasons.push(`Optimal challenge for your current pace`);
    } else {
      reasons.push(`Builds ${problem.topic} pattern mastery`);
    }

    const reason = reasons.join(" · ");
    const roadmapPhaseConnection = getRoadmapPhaseForTopic(problem.topic);

    return {
      problem,
      score: breakdown,
      reason,
      category,
      roadmapPhaseConnection,
      addressesGap: gapName,
      relevantCompany: matchedCompany,
    };
  });

  // Filter out solved, sort by score descending
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
