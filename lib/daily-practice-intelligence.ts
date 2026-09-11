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
} from "@/types/problems";
import { computeAcademicMetrics } from "@/lib/academic-intelligence";
import { PROBLEMS_CATALOG } from "@/constants/problems-catalog";

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
 * Baseline problem budgets by academic phase.
 * Semester 1–2: 3 problems/day (range 2–4)
 * Semester 3–4: 6 problems/day (range 5–8)
 * Semester 5–6: 10 problems/day (range 8–12)
 * Semester 7–8: 12 problems/day (range 10–15)
 * Graduated / Placement Preparation: 15 problems/day (range 12–20)
 */
function getSemesterBaseline(currentSemester: number, isGraduated: boolean): { baseline: number; label: string } {
  if (isGraduated) {
    return { baseline: 15, label: "Placement Sprint (Graduated / Placement Ready)" };
  }
  if (currentSemester <= 2) {
    return { baseline: 3, label: `Foundational Sprint (Semester ${currentSemester})` };
  }
  if (currentSemester <= 4) {
    return { baseline: 6, label: `Core DSA Ramp-up (Semester ${currentSemester})` };
  }
  if (currentSemester <= 6) {
    return { baseline: 10, label: `Placement Acceleration (Semester ${currentSemester})` };
  }
  return { baseline: 12, label: `Final Interview Readiness (Semester ${currentSemester})` };
}

/**
 * Calculates difficulty breakdown appropriate for the student's readiness and semester.
 */
function calculateDifficultyDistribution(budget: number, semester: number, dsaLevel: string): DifficultyDistribution {
  let easyRatio = 0.4;
  let medRatio = 0.5;

  if (semester <= 2 || dsaLevel === "never" || dsaLevel === "learning") {
    easyRatio = 0.7;
    medRatio = 0.3;
  } else if (semester >= 6 || dsaLevel === "strong" || dsaLevel === "competitive") {
    easyRatio = 0.2;
    medRatio = 0.6;
  } else {
    // Intermediate
    easyRatio = 0.35;
    medRatio = 0.55;
  }

  const easy = Math.max(1, Math.round(budget * easyRatio));
  let medium = Math.max(1, Math.round(budget * medRatio));
  let hard = Math.max(0, budget - easy - medium);

  // If hard is negative due to rounding, adjust medium
  if (hard < 0) {
    medium += hard;
    hard = 0;
  }

  // Ensure sum matches budget exactly
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
 * Deterministic Daily Practice Budget Engine.
 * Combines semester, readiness score, verified skills, recent attempts telemetry,
 * and friction to produce a personalized target.
 */
export function computeDailyPracticeBudget(
  onboardingState: OnboardingState,
  recentAttempts: UserProblemAttempt[] = []
): DailyBudgetBreakdown {
  const academic = computeAcademicMetrics(onboardingState.education);
  const isGraduated = academic.semestersRemaining === 0;
  const { baseline, label } = getSemesterBaseline(academic.currentSemester, isGraduated);

  // Factor 1: Readiness score adjustment
  const readiness = onboardingState.readinessSummary?.readinessScore ?? 50;
  let readinessAdjustment = 0;
  if (readiness < 40) {
    readinessAdjustment = -1; // Lower initial volume to prioritize mastering concepts
  } else if (readiness > 75) {
    readinessAdjustment = 1; // Capable of higher consistent workload
  }

  // Factor 2: Recent telemetry adjustment (last 6 attempts)
  const windowAttempts = recentAttempts.slice(-6);
  let performanceAdjustment = 0;
  if (windowAttempts.length >= 3) {
    const solvedCount = windowAttempts.filter(
      (a) => a.status === "solved_independent" || a.status === "solved_with_help"
    ).length;
    const solveRate = solvedCount / windowAttempts.length;

    // High friction or low solve rate reduces target to prevent burnout
    const frictionCount = windowAttempts.filter(
      (a) => a.primaryFriction && a.primaryFriction !== "none"
    ).length;

    if (solveRate >= 0.8 && frictionCount <= 1) {
      performanceAdjustment = 1;
    } else if (solveRate <= 0.4 || frictionCount >= 4) {
      performanceAdjustment = -2;
    }
  }

  // Factor 3: Skill gap intensity
  const dsaLevel = onboardingState.experience.dsaLevel;
  let gapIntensityAdjustment = 0;
  if (dsaLevel === "learning" && academic.currentSemester >= 5) {
    gapIntensityAdjustment = 1; // Senior needing catch-up
  }

  // Calculate final budget (bounded: minimum 2, maximum 20)
  const rawBudget = baseline + readinessAdjustment + performanceAdjustment + gapIntensityAdjustment;
  const recommendedBudget = Math.min(20, Math.max(2, rawBudget));

  // Determine difficulty distribution
  const distribution = calculateDifficultyDistribution(
    recommendedBudget,
    academic.currentSemester,
    dsaLevel
  );

  const explanation = `${label}: Base ${baseline} problems, adjusted by readiness (${readinessAdjustment >= 0 ? `+${readinessAdjustment}` : readinessAdjustment}) and recent performance (${performanceAdjustment >= 0 ? `+${performanceAdjustment}` : performanceAdjustment}). Target: ${distribution.easy} Easy, ${distribution.medium} Medium, ${distribution.hard} Hard.`;

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
 * Curates today's recommended problem set from the catalog based on the computed budget.
 * Prioritizes:
 * 1. Unsolved problems matching difficulty targets
 * 2. Problems addressing target role relevance
 * 3. Problems tagged with target companies
 * 4. Topic diversification across key DSA categories
 */
export function selectTodaysPracticeProblems(
  catalog: CodingProblem[] = PROBLEMS_CATALOG,
  budget: DailyBudgetBreakdown,
  solvedIds: Set<string>,
  onboardingState: OnboardingState
): CodingProblem[] {
  const targetRole = onboardingState.targetRole || "software-engineer";
  const targetCompanies = new Set(onboardingState.targetCompanies.map((c) => c.toLowerCase()));

  // Score problems for selection priority
  const scored = catalog.map((problem) => {
    let score = 0;
    // Downweight solved
    if (solvedIds.has(problem.id)) {
      score -= 500;
    }

    // Role relevance
    const roleWeight = problem.roleRelevance[targetRole] || 0.5;
    score += roleWeight * 50;

    // Company match
    const companyMatchCount = problem.companyTags.filter((c) => targetCompanies.has(c.toLowerCase())).length;
    score += companyMatchCount * 30;

    return { problem, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const { easy, medium, hard } = budget.distribution;
  const selected: CodingProblem[] = [];
  const selectedIds = new Set<string>();

  const pickForDifficulty = (diff: "Easy" | "Medium" | "Hard", count: number) => {
    let picked = 0;
    for (const item of scored) {
      if (picked >= count) break;
      if (item.problem.difficulty === diff && !selectedIds.has(item.problem.id)) {
        selected.push(item.problem);
        selectedIds.add(item.problem.id);
        picked++;
      }
    }
    // Fallback if catalog does not have enough of this difficulty
    if (picked < count) {
      for (const item of scored) {
        if (picked >= count) break;
        if (!selectedIds.has(item.problem.id)) {
          selected.push(item.problem);
          selectedIds.add(item.problem.id);
          picked++;
        }
      }
    }
  };

  pickForDifficulty("Easy", easy);
  pickForDifficulty("Medium", medium);
  pickForDifficulty("Hard", hard);

  return selected;
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

    // Maintain reference equality if computed fields are identical to existingPlan
    if (
      existingPlan.completedCount === completedCount &&
      existingPlan.solvedCount === solvedCount &&
      existingPlan.attemptedCount === attemptedCount &&
      existingPlan.dailyScore === scoreResult.score &&
      existingPlan.completionRate === scoreResult.completionRate &&
      existingPlan.averageConfidence === scoreResult.averageConfidence &&
      existingPlan.primaryFriction === frictionValue &&
      existingPlan.status === status
    ) {
      return existingPlan;
    }

    return {
      ...existingPlan,
      completedCount,
      solvedCount,
      attemptedCount,
      dailyScore: scoreResult.score,
      completionRate: scoreResult.completionRate,
      averageConfidence: scoreResult.averageConfidence,
      primaryFriction: frictionValue,
      status,
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
    onboardingState
  );

  const todayAttempts = existingAttempts.filter(
    (a) => getLocalDateString(new Date(a.createdAt)) === today
  );
  const solvedAttempts = todayAttempts.filter(
    (a) => a.status === "solved_independent" || a.status === "solved_with_help"
  );

  const scoreResult = calculateDailyPracticeScore(
    todayAttempts.length,
    solvedAttempts.length,
    todayAttempts.length,
    budget.recommendedBudget,
    todayAttempts
  );

  return {
    userId,
    date: today,
    recommendedCount: budget.recommendedBudget,
    easyTarget: budget.distribution.easy,
    mediumTarget: budget.distribution.medium,
    hardTarget: budget.distribution.hard,
    completedCount: todayAttempts.length,
    solvedCount: solvedAttempts.length,
    attemptedCount: todayAttempts.length,
    dailyScore: scoreResult.score,
    completionRate: scoreResult.completionRate,
    averageConfidence: scoreResult.averageConfidence,
    averageDifficulty: 1.5,
    primaryFriction: null,
    status: todayAttempts.length >= budget.recommendedBudget ? "completed" : todayAttempts.length > 0 ? "in_progress" : "not_started",
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

    if (todayPlan && dateStr === todayPlan.date) {
      // Calculate today's solved by difficulty
      const todayAttempts = allAttempts.filter(
        (a) => getLocalDateString(new Date(a.createdAt)) === dateStr
      );
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;
      for (const att of todayAttempts) {
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
      });
    } else if (historyMap.has(dateStr)) {
      result.push(historyMap.get(dateStr)!);
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
