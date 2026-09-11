// =============================================================================
// CareerCompass — Adaptive Daily Practice Intelligence Engine
// =============================================================================
// Deterministic engine that computes:
// 1. Personalized Daily Practice Budget (based on semester, readiness, gaps, telemetry)
// 2. Recommended Difficulty Distribution (Easy / Medium / Hard)
// 3. Today's Curated Practice Problem Set from catalog
// 4. Deterministic Daily Practice Score (0-100% or null if 0 solves)
// 5. 7-Day Historical Practice Aggregation without fabricated data
// =============================================================================

import { OnboardingState } from "@/types";
import {
  CodingProblem,
  UserProblemAttempt,
  DailyBudgetBreakdown,
  DailyPracticePlan,
  DailyPracticeScore,
  DailyHistoryItem,
  DifficultyDistribution,
  FrictionType,
  ConfidenceLevel,
  ProblemTopic,
} from "@/types/problems";
import { computeAcademicMetrics } from "@/lib/academic-intelligence";
import { PROBLEMS_CATALOG } from "@/constants/problems-catalog";
import { computeAdaptivePracticeProfile } from "@/lib/problem-intelligence";

/**
 * Returns the current date formatted as YYYY-MM-DD in the user's local timezone.
 * Avoids UTC mismatch issues across local midnight boundaries.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Baseline problem budgets by academic phase (Stage 3).
 * Semester 1–2: 2–4 problems/day (baseline 3)
 * Semester 3–4: 5–8 problems/day (baseline 6)
 * Semester 5–6: 8–12 problems/day (baseline 10)
 * Semester 7–8: 10–15 problems/day (baseline 12)
 * Graduated / Placement Preparation: 12–20 problems/day (baseline 15)
 */
function getSemesterBaseline(
  currentSemester: number,
  isGraduated: boolean
): { baseline: number; min: number; max: number; label: string } {
  if (isGraduated) {
    return { baseline: 15, min: 12, max: 20, label: "Placement Sprint (Graduated / Placement Ready)" };
  }
  if (currentSemester <= 2) {
    return { baseline: 3, min: 2, max: 4, label: `Foundational Sprint (Semester ${currentSemester})` };
  }
  if (currentSemester <= 4) {
    return { baseline: 6, min: 5, max: 8, label: `Core DSA Ramp-up (Semester ${currentSemester})` };
  }
  if (currentSemester <= 6) {
    return { baseline: 10, min: 8, max: 12, label: `Placement Acceleration (Semester ${currentSemester})` };
  }
  return { baseline: 12, min: 10, max: 15, label: `Final Interview Readiness (Semester ${currentSemester})` };
}

/**
 * Calculates difficulty breakdown appropriate for the student's readiness, semester, and mastery profile.
 */
function calculateDifficultyDistribution(
  budget: number,
  semester: number,
  dsaLevel: string,
  weakTopicCount: number = 0
): DifficultyDistribution {
  let easyRatio = 0.35;
  let medRatio = 0.55;

  if (semester <= 2 || dsaLevel === "never" || dsaLevel === "learning" || weakTopicCount >= 2) {
    easyRatio = 0.60;
    medRatio = 0.40;
  } else if (semester >= 6 && (dsaLevel === "strong" || dsaLevel === "competitive") && weakTopicCount === 0) {
    easyRatio = 0.15;
    medRatio = 0.60;
  } else {
    // Intermediate standard
    easyRatio = 0.30;
    medRatio = 0.60;
  }

  const easy = Math.max(1, Math.round(budget * easyRatio));
  let medium = Math.max(1, Math.round(budget * medRatio));
  let hard = Math.max(0, budget - easy - medium);

  if (hard < 0) {
    medium += hard;
    hard = 0;
  }

  const diff = budget - (easy + medium + hard);
  if (diff !== 0) {
    medium += diff;
  }

  return {
    easy: Math.max(1, easy),
    medium: Math.max(0, medium),
    hard: Math.max(0, hard),
  };
}

/**
 * Deterministic Adaptive Daily Practice Budget Engine (Stage 3).
 * Adapts based on semester, readiness score, target role, target companies,
 * recent solve rate, confidence, friction, and consistency.
 */
export function computeDailyPracticeBudget(
  onboardingState: OnboardingState,
  recentAttempts: UserProblemAttempt[] = []
): DailyBudgetBreakdown {
  const academic = computeAcademicMetrics(onboardingState.education);
  const isGraduated = academic.semestersRemaining === 0;
  const { baseline, min: minBound, max: maxBound, label } = getSemesterBaseline(academic.currentSemester, isGraduated);

  // Factor 1: Readiness score adjustment
  const readiness = onboardingState.readinessSummary?.readinessScore ?? 50;
  let readinessAdjustment = 0;
  if (readiness < 35) {
    readinessAdjustment = -1; // Protect student from burnout to master fundamentals
  } else if (readiness > 75) {
    readinessAdjustment = 1; // High readiness can sustain higher volume
  }

  // Factor 2: Recent telemetry adjustment (last 6-8 attempts)
  const windowAttempts = recentAttempts.slice(-8);
  let performanceAdjustment = 0;
  let recentSolveRatePercent = 0;
  let frictionCount = 0;

  if (windowAttempts.length >= 3) {
    const solvedCount = windowAttempts.filter(
      (a) => a.status === "solved_independent" || a.status === "solved_with_help"
    ).length;
    const solveRate = solvedCount / windowAttempts.length;
    recentSolveRatePercent = Math.round(solveRate * 100);

    frictionCount = windowAttempts.filter(
      (a) => a.primaryFriction && a.primaryFriction !== "none"
    ).length;

    if (solveRate >= 0.8 && frictionCount <= 1) {
      performanceAdjustment = 1;
    } else if (solveRate <= 0.4 || frictionCount >= 3) {
      performanceAdjustment = -2; // High friction or low solve rate reduces workload to emphasize quality
    }
  }

  // Factor 3: Skill gap intensity & senior catch-up
  const dsaLevel = onboardingState.experience?.dsaLevel || "never";
  let gapIntensityAdjustment = 0;
  if (dsaLevel === "learning" && academic.currentSemester >= 5) {
    gapIntensityAdjustment = 1; // Senior needing catch-up
  }

  // Calculate final budget clamped to semester-specific boundaries
  const rawBudget = baseline + readinessAdjustment + performanceAdjustment + gapIntensityAdjustment;
  const recommendedBudget = Math.min(maxBound, Math.max(minBound, rawBudget));

  // Determine difficulty distribution
  const distribution = calculateDifficultyDistribution(
    recommendedBudget,
    academic.currentSemester,
    dsaLevel,
    frictionCount >= 2 ? 2 : 0
  );

  // Build explainable justification sentence
  const reasons: string[] = [
    `Semester ${academic.currentSemester} baseline (${baseline} problems)`
  ];
  if (readinessAdjustment > 0) reasons.push("elevated by strong readiness (+1)");
  else if (readinessAdjustment < 0) reasons.push("calibrated for concept consolidation (-1)");

  if (performanceAdjustment > 0) reasons.push(`recent solve rate ${recentSolveRatePercent}% (+1)`);
  else if (performanceAdjustment < 0) reasons.push(`reduced to manage recent friction (-${Math.abs(performanceAdjustment)})`);

  if (gapIntensityAdjustment > 0) reasons.push("placement catch-up bonus (+1)");

  const explanation = `Your current plan is ${recommendedBudget} problems/day (${label}): ${reasons.join(", ")}. Target mix: ${distribution.easy} Easy, ${distribution.medium} Medium, ${distribution.hard} Hard.`;

  return {
    semesterBaseline: baseline,
    readinessAdjustment,
    performanceAdjustment,
    gapIntensityAdjustment,
    recommendedBudget,
    distribution,
    explanation,
  };
}

/**
 * Curates today's recommended problem set from the catalog with balanced diversity (Stage 7 & 8).
 * Composes a balanced mix:
 * 1. Targeted Weakness: Addresses topics where user has low confidence or high friction
 * 2. Foundation / Core: Foundational algorithm patterns
 * 3. Role / Company Relevance: Problems asked by target companies or core to target role
 * 4. Stretch Problem: At or slightly above current comfort level
 * 5. Review: Reinforces previously solved concepts if friction was noted
 */
export function selectTodaysPracticeProblems(
  catalog: CodingProblem[] = PROBLEMS_CATALOG,
  budget: DailyBudgetBreakdown,
  solvedIds: Set<string>,
  onboardingState: OnboardingState,
  userAttempts: UserProblemAttempt[] = []
): CodingProblem[] {
  const targetRole = onboardingState.targetRole || "software-engineer";
  const targetCompanies = new Set(onboardingState.targetCompanies.map((c) => c.toLowerCase()));
  const profile = computeAdaptivePracticeProfile(userAttempts, catalog, onboardingState);

  // Score problems with multi-factor weighting
  const scored = catalog.map((problem) => {
    let score = 0;
    const isSolved = solvedIds.has(problem.id);
    if (isSolved) {
      score -= 400; // Deprioritize already solved, but keep available if catalog is exhausted
    }

    // Role relevance
    const roleWeight = problem.roleRelevance[targetRole] || 0.5;
    score += roleWeight * 40;

    // Company relevance
    const companyMatchCount = problem.companyTags.filter((c) => targetCompanies.has(c.toLowerCase())).length;
    score += companyMatchCount * 35;

    // Topic priority from profile
    const topicPerf = profile.topicPerformances[problem.topic];
    if (topicPerf) {
      if (topicPerf.masteryState === "Weak") score += 45;
      else if (topicPerf.needsReinforcement) score += 35;
      else if (topicPerf.masteryState === "Developing") score += 25;
      else if (topicPerf.masteryState === "Strong") score += 10;
    }

    // Focus topic bonus
    if (problem.topic === profile.recommendedFocusTopic) {
      score += 30;
    }

    return { problem, score, isSolved };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: CodingProblem[] = [];
  const selectedIds = new Set<string>();
  const topicCounts = new Map<ProblemTopic, number>();

  const canAddTopic = (topic: ProblemTopic): boolean => {
    const current = topicCounts.get(topic) || 0;
    // Allow at most 2 problems per topic unless budget is large
    return current < (budget.recommendedBudget > 10 ? 3 : 2);
  };

  const pickMatching = (
    predicate: (item: { problem: CodingProblem; score: number; isSolved: boolean }) => boolean,
    limit: number
  ) => {
    let count = 0;
    for (const item of scored) {
      if (count >= limit) break;
      if (!selectedIds.has(item.problem.id) && predicate(item) && canAddTopic(item.problem.topic)) {
        selected.push(item.problem);
        selectedIds.add(item.problem.id);
        topicCounts.set(item.problem.topic, (topicCounts.get(item.problem.topic) || 0) + 1);
        count++;
      }
    }
  };

  const { easy, medium, hard } = budget.distribution;

  // Slot 1: Targeted Weakness (prioritize weak/developing topic)
  pickMatching(
    (item) => !item.isSolved && profile.weakTopics.includes(item.problem.topic) && item.problem.difficulty !== "Hard",
    1
  );

  // Slot 2: Company / Role Core match
  pickMatching(
    (item) => !item.isSolved && item.problem.companyTags.some((c) => targetCompanies.has(c.toLowerCase())),
    1
  );

  // Slot 3: Easy problems to fulfill easy quota
  const remainingEasy = Math.max(0, easy - selected.filter((p) => p.difficulty === "Easy").length);
  if (remainingEasy > 0) {
    pickMatching((item) => !item.isSolved && item.problem.difficulty === "Easy", remainingEasy);
  }

  // Slot 4: Medium problems to fulfill medium quota
  const remainingMed = Math.max(0, medium - selected.filter((p) => p.difficulty === "Medium").length);
  if (remainingMed > 0) {
    pickMatching((item) => !item.isSolved && item.problem.difficulty === "Medium", remainingMed);
  }

  // Slot 5: Hard problems if budget allows
  const remainingHard = Math.max(0, hard - selected.filter((p) => p.difficulty === "Hard").length);
  if (remainingHard > 0) {
    pickMatching((item) => !item.isSolved && item.problem.difficulty === "Hard", remainingHard);
  }

  // Fallback if needed to fulfill total recommendedBudget
  if (selected.length < budget.recommendedBudget) {
    for (const item of scored) {
      if (selected.length >= budget.recommendedBudget) break;
      if (!selectedIds.has(item.problem.id)) {
        selected.push(item.problem);
        selectedIds.add(item.problem.id);
      }
    }
  }

  return selected.slice(0, budget.recommendedBudget);
}

const CONFIDENCE_WEIGHT_MAP: Record<ConfidenceLevel, number> = {
  couldnt_start: 1,
  understood_idea: 2,
  needed_hints: 3,
  solved_with_help: 4,
  solved_independently: 5,
};

/**
 * Transparent Deterministic Daily Practice Score.
 *
 * CRITICAL RULE:
 * If the user has solved 0 problems today, returns score: null ("No score yet").
 * Does NOT fabricate scores.
 *
 * Formula when solved > 0:
 * 1. Completion Rate (30% weight): min(1.0, completedCount / recommendedCount) * 30
 * 2. Solve Rate (30% weight): (solvedCount / attemptedCount) * 30
 * 3. Confidence Factor (20% weight): (avgConfidence / 5.0) * 20
 * 4. Difficulty Factor (20% weight): weighted difficulty sum / (solvedCount * 2.0) * 20
 *    (Easy = 1.0, Medium = 1.5, Hard = 2.0)
 *
 * Total max score = 100 points.
 */
export function calculateDailyPracticeScore(
  completedCount: number,
  solvedCount: number,
  attemptedCount: number,
  recommendedCount: number,
  attemptsToday: UserProblemAttempt[]
): DailyPracticeScore {
  if (solvedCount === 0 || attemptsToday.length === 0) {
    return {
      score: null,
      completionRate: 0,
      solveRate: 0,
      averageConfidence: 0,
      difficultyIndex: 0,
      summaryLabel: "No score yet",
    };
  }

  const completionRate = Math.min(1.0, completedCount / Math.max(1, recommendedCount));
  const solveRate = Math.min(1.0, solvedCount / Math.max(1, attemptedCount));

  // Average confidence across today's attempts
  const totalConfidence = attemptsToday.reduce(
    (acc, att) => acc + (CONFIDENCE_WEIGHT_MAP[att.confidence] || 3),
    0
  );
  const avgConfidence = totalConfidence / attemptsToday.length;
  const confidenceNormalized = Math.min(1.0, avgConfidence / 5.0);

  // Difficulty index based on catalog lookups
  let diffWeightSum = 0;
  for (const att of attemptsToday) {
    const prob = PROBLEMS_CATALOG.find((p) => p.id === att.problemId);
    if (prob?.difficulty === "Hard") diffWeightSum += 2.0;
    else if (prob?.difficulty === "Medium") diffWeightSum += 1.5;
    else diffWeightSum += 1.0;
  }
  const difficultyIndex = Math.min(1.0, diffWeightSum / (attemptsToday.length * 2.0));

  // Deterministic weighted formula
  const calculatedScore = Math.round(
    completionRate * 30 +
    solveRate * 30 +
    confidenceNormalized * 20 +
    difficultyIndex * 20
  );

  const finalScore = Math.min(100, Math.max(10, calculatedScore));

  let summaryLabel = "Progressing";
  if (finalScore >= 85) summaryLabel = "Optimal Focus";
  else if (finalScore >= 70) summaryLabel = "Solid Consistency";
  else if (finalScore >= 50) summaryLabel = "Foundational Effort";
  else summaryLabel = "Needs Recalibration";

  return {
    score: finalScore,
    completionRate,
    solveRate,
    averageConfidence: Number(avgConfidence.toFixed(1)),
    difficultyIndex: Number(difficultyIndex.toFixed(2)),
    summaryLabel,
  };
}

/**
 * Initializes or updates a DailyPracticePlan for today's date.
 */
export function initializeDailyPlan(
  userId: string,
  onboardingState: OnboardingState,
  existingAttempts: UserProblemAttempt[],
  existingPlan?: DailyPracticePlan | null
): DailyPracticePlan {
  const today = getLocalDateString();
  const profile = computeAdaptivePracticeProfile(existingAttempts, PROBLEMS_CATALOG, onboardingState);

  // If we already have a plan for today, verify and return with live progress
  if (existingPlan && existingPlan.date === today) {
    const todayAttempts = existingAttempts.filter(
      (a) => getLocalDateString(new Date(a.createdAt)) === today
    );
    const solvedAttempts = todayAttempts.filter(
      (a) => a.status === "solved_independent" || a.status === "solved_with_help"
    );

    const completedCount = todayAttempts.length;
    const solvedCount = solvedAttempts.length;
    const attemptedCount = todayAttempts.length;
    const remainingCount = Math.max(0, existingPlan.recommendedCount - completedCount);

    const scoreResult = calculateDailyPracticeScore(
      completedCount,
      solvedCount,
      attemptedCount,
      existingPlan.recommendedCount,
      todayAttempts
    );

    let status: DailyPracticePlan["status"] = "not_started";
    if (completedCount >= existingPlan.recommendedCount) {
      status = completedCount > existingPlan.recommendedCount ? "exceeded" : "completed";
    } else if (completedCount > 0) {
      status = "in_progress";
    }

    // Find primary friction of the day if any
    const frictionMap: Record<string, number> = {};
    for (const att of todayAttempts) {
      if (att.primaryFriction && att.primaryFriction !== "none") {
        frictionMap[att.primaryFriction] = (frictionMap[att.primaryFriction] || 0) + 1;
      }
    }
    const topFriction = Object.entries(frictionMap).sort((a, b) => b[1] - a[1])[0]?.[0] as FrictionType | undefined;
    const frictionValue = topFriction || null;

    // Find next uncompleted problem
    const completedProblemIds = new Set(todayAttempts.map((a) => a.problemId));
    const nextId = existingPlan.problemIds.find((id) => !completedProblemIds.has(id));
    const nextRecommendedProblem = nextId ? PROBLEMS_CATALOG.find((p) => p.id === nextId) : undefined;
    const nextProblemReason = nextRecommendedProblem
      ? `Recommended next to reinforce ${nextRecommendedProblem.topic} (${nextRecommendedProblem.difficulty}) for your daily practice.`
      : undefined;

    // Maintain reference equality if computed fields are identical to existingPlan
    if (
      existingPlan.completedCount === completedCount &&
      existingPlan.solvedCount === solvedCount &&
      existingPlan.attemptedCount === attemptedCount &&
      existingPlan.remainingCount === remainingCount &&
      existingPlan.dailyScore === scoreResult.score &&
      existingPlan.completionRate === scoreResult.completionRate &&
      existingPlan.averageConfidence === scoreResult.averageConfidence &&
      existingPlan.primaryFriction === frictionValue &&
      existingPlan.status === status &&
      existingPlan.nextRecommendedProblem?.id === nextRecommendedProblem?.id
    ) {
      return existingPlan;
    }

    return {
      ...existingPlan,
      completedCount,
      solvedCount,
      attemptedCount,
      remainingCount,
      dailyScore: scoreResult.score,
      completionRate: scoreResult.completionRate,
      averageConfidence: scoreResult.averageConfidence,
      primaryFriction: frictionValue,
      status,
      focusTopic: profile.recommendedFocusTopic,
      nextRecommendedProblem,
      nextProblemReason,
      updatedAt: new Date().toISOString(),
    };
  }

  // Create new plan for today
  const budget = computeDailyPracticeBudget(onboardingState, existingAttempts);
  const solvedIds = new Set(
    existingAttempts
      .filter((a) => a.status === "solved_independent" || a.status === "solved_with_help")
      .map((a) => a.problemId)
  );
  const recommendedProblems = selectTodaysPracticeProblems(
    PROBLEMS_CATALOG,
    budget,
    solvedIds,
    onboardingState,
    existingAttempts
  );

  const todayAttempts = existingAttempts.filter(
    (a) => getLocalDateString(new Date(a.createdAt)) === today
  );
  const solvedAttempts = todayAttempts.filter(
    (a) => a.status === "solved_independent" || a.status === "solved_with_help"
  );

  const completedCount = todayAttempts.length;
  const solvedCount = solvedAttempts.length;
  const remainingCount = Math.max(0, budget.recommendedBudget - completedCount);

  const scoreResult = calculateDailyPracticeScore(
    completedCount,
    solvedCount,
    completedCount,
    budget.recommendedBudget,
    todayAttempts
  );

  const completedProblemIds = new Set(todayAttempts.map((a) => a.problemId));
  const nextProblem = recommendedProblems.find((p) => !completedProblemIds.has(p.id));
  const nextProblemReason = nextProblem
    ? `Recommended next to strengthen ${nextProblem.topic} (${nextProblem.difficulty}) based on your adaptive profile.`
    : undefined;

  return {
    userId,
    date: today,
    recommendedCount: budget.recommendedBudget,
    easyTarget: budget.distribution.easy,
    mediumTarget: budget.distribution.medium,
    hardTarget: budget.distribution.hard,
    completedCount,
    solvedCount,
    attemptedCount: completedCount,
    remainingCount,
    dailyScore: scoreResult.score,
    completionRate: scoreResult.completionRate,
    averageConfidence: scoreResult.averageConfidence,
    averageDifficulty: 1.5,
    primaryFriction: null,
    status: completedCount >= budget.recommendedBudget ? "completed" : completedCount > 0 ? "in_progress" : "not_started",
    focusTopic: profile.recommendedFocusTopic,
    nextRecommendedProblem: nextProblem,
    nextProblemReason,
    problemIds: recommendedProblems.map((p) => p.id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Builds an authentic 7-day practice history array [T-6, T-5, ..., Today].
 * Real recorded days display their recorded score and solved count.
 * Missing days remain zeroed with score: null (no fabricated data!).
 */
export function buildSevenDayHistory(
  storedHistory: DailyHistoryItem[] = [],
  todayPlan?: DailyPracticePlan | null,
  allAttempts: UserProblemAttempt[] = []
): DailyHistoryItem[] {
  const result: DailyHistoryItem[] = [];
  const now = new Date();

  // Create map from stored history
  const historyMap = new Map<string, DailyHistoryItem>();
  for (const item of storedHistory) {
    historyMap.set(item.date, item);
  }

  // Iterate over last 7 calendar days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);

    const dayAttempts = allAttempts.filter(
      (a) => getLocalDateString(new Date(a.createdAt)) === dateStr
    );

    // Calculate topics and confidence if day has attempts
    let strongestTopic: string | undefined = undefined;
    let weakestTopic: string | undefined = undefined;
    let avgConf: number | undefined = undefined;

    if (dayAttempts.length > 0) {
      const topicSolvedCount: Record<string, number> = {};
      const topicFailCount: Record<string, number> = {};
      let totalConfidence = 0;

      for (const att of dayAttempts) {
        totalConfidence += CONFIDENCE_WEIGHT_MAP[att.confidence] || 3;
        const prob = PROBLEMS_CATALOG.find((p) => p.id === att.problemId);
        if (prob) {
          if (att.status === "solved_independent" || att.status === "solved_with_help") {
            topicSolvedCount[prob.topic] = (topicSolvedCount[prob.topic] || 0) + 1;
          } else {
            topicFailCount[prob.topic] = (topicFailCount[prob.topic] || 0) + 1;
          }
        }
      }

      avgConf = Number((totalConfidence / dayAttempts.length).toFixed(1));
      const topSolved = Object.entries(topicSolvedCount).sort((a, b) => b[1] - a[1])[0];
      if (topSolved) strongestTopic = topSolved[0];
      const topFailed = Object.entries(topicFailCount).sort((a, b) => b[1] - a[1])[0];
      if (topFailed) weakestTopic = topFailed[0];
    }

    if (todayPlan && dateStr === todayPlan.date) {
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;
      for (const att of dayAttempts) {
        if (att.status === "solved_independent" || att.status === "solved_with_help") {
          const prob = PROBLEMS_CATALOG.find((p) => p.id === att.problemId);
          if (prob?.difficulty === "Hard") hardSolved++;
          else if (prob?.difficulty === "Medium") mediumSolved++;
          else easySolved++;
        }
      }

      result.push({
        date: dateStr,
        recommendedCount: todayPlan.recommendedCount,
        completedCount: todayPlan.completedCount,
        solvedCount: todayPlan.solvedCount,
        attemptedCount: todayPlan.attemptedCount,
        dailyScore: todayPlan.dailyScore,
        easySolved,
        mediumSolved,
        hardSolved,
        strongestTopic,
        weakestTopic,
        averageConfidence: avgConf,
      });
    } else if (historyMap.has(dateStr)) {
      const stored = historyMap.get(dateStr)!;
      result.push({
        ...stored,
        strongestTopic: stored.strongestTopic || strongestTopic,
        weakestTopic: stored.weakestTopic || weakestTopic,
        averageConfidence: stored.averageConfidence || avgConf,
      });
    } else if (dayAttempts.length > 0) {
      // Historical day that had attempts but wasn't stored in historyMap
      const solvedAttempts = dayAttempts.filter(
        (a) => a.status === "solved_independent" || a.status === "solved_with_help"
      );
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;
      for (const att of solvedAttempts) {
        const prob = PROBLEMS_CATALOG.find((p) => p.id === att.problemId);
        if (prob?.difficulty === "Hard") hardSolved++;
        else if (prob?.difficulty === "Medium") mediumSolved++;
        else easySolved++;
      }

      const scoreResult = calculateDailyPracticeScore(
        dayAttempts.length,
        solvedAttempts.length,
        dayAttempts.length,
        dayAttempts.length,
        dayAttempts.length > 0 ? dayAttempts : []
      );

      result.push({
        date: dateStr,
        recommendedCount: dayAttempts.length,
        completedCount: dayAttempts.length,
        solvedCount: solvedAttempts.length,
        attemptedCount: dayAttempts.length,
        dailyScore: scoreResult.score,
        easySolved,
        mediumSolved,
        hardSolved,
        strongestTopic,
        weakestTopic,
        averageConfidence: avgConf,
      });
    } else {
      // Missing day — unrecorded, NOT fabricated
      result.push({
        date: dateStr,
        recommendedCount: 0,
        completedCount: 0,
        solvedCount: 0,
        attemptedCount: 0,
        dailyScore: null,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
      });
    }
  }

  return result;
}
