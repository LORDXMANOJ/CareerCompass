// =============================================================================
// CareerCompass — Coding Problem Intelligence Types
// =============================================================================

/** Supported external coding platforms */
export type ProblemProvider = "leetcode" | "codeforces" | "hackerrank";

/** Normalized difficulty tier */
export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

/** Primary DSA topic classification */
export type ProblemTopic =
  | "Arrays"
  | "Strings"
  | "Hash Map"
  | "Two Pointers"
  | "Sliding Window"
  | "Binary Search"
  | "Linked List"
  | "Stack"
  | "Queue"
  | "Trees"
  | "Binary Trees"
  | "Binary Search Trees"
  | "Heaps"
  | "Graphs"
  | "Dynamic Programming"
  | "Greedy"
  | "Backtracking"
  | "Recursion"
  | "Sorting"
  | "Math"
  | "Bit Manipulation"
  | "Trie"
  | "Union Find"
  | "Intervals"
  | "Prefix Sum"
  | "Matrix"
  | "Implementation"
  | "Constructive"
  | "Brute Force";

/** A single normalized coding problem in the catalog */
export interface CodingProblem {
  /** Internal stable identifier */
  id: string;
  /** Platform identifier */
  provider: ProblemProvider;
  /** External problem ID (e.g. "1" for LeetCode #1, "1A" for Codeforces) */
  externalId: string;
  /** Problem title */
  title: string;
  /** URL-safe slug */
  slug: string;
  /** Difficulty tier */
  difficulty: ProblemDifficulty;
  /** Direct link to the problem on the external platform */
  url: string;
  /** Primary DSA topic */
  topic: ProblemTopic;
  /** Secondary technique/pattern tags */
  tags: string[];
  /** Role relevance weights: roleId → relevance score (0.0 to 1.0) */
  roleRelevance: Record<string, number>;
  /** Company IDs (from VERIFIED_COMPANIES) known to ask this or similar problems */
  companyTags: string[];
}

// ---------------------------------------------------------------------------
// User Attempt Tracking Types
// ---------------------------------------------------------------------------

/** What the user did with the problem */
export type AttemptStatus =
  | "attempted"
  | "solved_with_help"
  | "solved_independent"
  | "skipped";

/** Self-reported confidence after attempting */
export type ConfidenceLevel =
  | "couldnt_start"
  | "understood_idea"
  | "needed_hints"
  | "solved_with_help"
  | "solved_independently";

/** Self-reported perceived difficulty */
export type PerceivedDifficulty =
  | "too_easy"
  | "right_level"
  | "hard"
  | "very_hard";

/** Primary friction point during the attempt */
export type FrictionType =
  | "concept_misunderstanding"
  | "approach_failure"
  | "coding_error"
  | "complexity_issue"
  | "edge_cases"
  | "none";

/** A single logged problem attempt by the user */
export interface UserProblemAttempt {
  /** Optional attempt log ID */
  id?: string;
  /** Internal problem ID (matches CodingProblem.id) */
  problemId: string;
  /** What happened */
  status: AttemptStatus;
  /** Self-assessed confidence */
  confidence: ConfidenceLevel;
  /** How hard the user felt it was */
  difficultyFeedback: PerceivedDifficulty;
  /** Alias for difficultyFeedback */
  perceivedDifficulty?: PerceivedDifficulty;
  /** Where the user got stuck */
  primaryFriction: FrictionType;
  /** Optional free-text notes */
  notes: string;
  /** Time spent in minutes */
  timeSpentMinutes: number;
  /** ISO timestamp when logged */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Recommendation & Analytics Types
// ---------------------------------------------------------------------------

/** Score breakdown for a recommended problem */
export interface RecommendationScoreBreakdown {
  skillGapWeight: number;
  roleRelevance: number;
  companyMatch: number;
  difficultyFit: number;
  solvedPenalty: number;
  totalScore: number;
}

/** A recommended problem with rationale */
export interface ProblemRecommendation {
  problem: CodingProblem;
  score: RecommendationScoreBreakdown;
  reason: string;
  /** Which skill gap this problem addresses (if any) */
  addressesGap?: string;
  /** Which target company frequently asks this */
  relevantCompany?: string;
  /** Category mix classification for diversity */
  category?: RecommendationCategory;
  /** Direct connection to Roadmap Phase */
  roadmapPhaseConnection?: string;
  /** Alias for roadmapPhaseConnection */
  roadmapConnection?: string;
  /** Associated roadmap phase number (1-4) */
  roadmapPhase?: number;
}

/** Coverage stats for a single DSA topic */
export interface TopicCoverageItem {
  topic: ProblemTopic;
  totalProblems: number;
  solvedCount: number;
  attemptedCount: number;
  coveragePercent: number;
}

/** Aggregate problem practice statistics */
export interface ProblemStats {
  totalAttempted: number;
  totalSolved: number;
  totalSkipped: number;
  solvedByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicCoverage: TopicCoverageItem[];
  averageConfidence: string;
  mostPracticedTopic: string;
  weakestTopic: string;
}

/** Labels for displaying confidence levels */
export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  couldnt_start: "Couldn't Start",
  understood_idea: "Understood the Idea",
  needed_hints: "Needed Hints",
  solved_with_help: "Solved with Help",
  solved_independently: "Solved Independently",
};

/** Labels for displaying perceived difficulty */
export const PERCEIVED_DIFFICULTY_LABELS: Record<PerceivedDifficulty, string> = {
  too_easy: "Too Easy",
  right_level: "Right Level",
  hard: "Hard",
  very_hard: "Very Hard",
};

/** Labels for displaying friction types */
export const FRICTION_LABELS: Record<FrictionType, string> = {
  concept_misunderstanding: "Concept Misunderstanding",
  approach_failure: "Approach / Strategy Failure",
  coding_error: "Coding / Implementation Error",
  complexity_issue: "Time / Space Complexity",
  edge_cases: "Edge Cases",
  none: "No Issues",
};

/** Labels for displaying attempt statuses */
export const ATTEMPT_STATUS_LABELS: Record<AttemptStatus, string> = {
  attempted: "Attempted",
  solved_with_help: "Solved with Help",
  solved_independent: "Solved Independently",
  skipped: "Skipped",
};

// ---------------------------------------------------------------------------
// Adaptive Daily Practice & Problem Performance Types (Phase 8/9 Expansion)
// ---------------------------------------------------------------------------

export type DailyPracticeStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "exceeded";

/** Target counts per difficulty tier for today's recommended practice */
export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

/** Deterministic Daily Practice Budget computation breakdown */
export interface DailyBudgetBreakdown {
  semesterBaseline: number;
  readinessAdjustment: number;
  performanceAdjustment: number;
  gapIntensityAdjustment: number;
  recommendedBudget: number;
  distribution: DifficultyDistribution;
  explanation: string;
}

/** Transparent Deterministic Daily Practice Score */
export interface DailyPracticeScore {
  /** Overall score out of 100, or null if 0 problems solved today */
  score: number | null;
  completionRate: number; // 0.0 to 1.0
  solveRate: number; // 0.0 to 1.0
  averageConfidence: number; // 1.0 to 5.0
  difficultyIndex: number; // weighted difficulty factor
  summaryLabel: string; // e.g. "Optimal", "Progressing", "No score yet"
}

// ---------------------------------------------------------------------------
// Phase 9 — Adaptive Mastery & Performance Types
// ---------------------------------------------------------------------------

/** Topic-level competence assessment based on authentic practice evidence */
export type TopicMasteryState = "Unknown" | "Weak" | "Developing" | "Competent" | "Strong";

/** Recommendation mix category for practice diversity */
export type RecommendationCategory =
  | "foundation"
  | "targeted_weakness"
  | "role_company"
  | "stretch"
  | "review";

/** Detailed performance metrics for a specific DSA topic */
export interface TopicPerformance {
  topic: ProblemTopic;
  totalCatalogProblems: number;
  attemptsCount: number;
  solvedCount: number;
  solveRate: number; // 0.0 to 1.0
  averageConfidence: number; // 1.0 to 5.0
  masteryState: TopicMasteryState;
  primaryFriction: FrictionType | null;
  difficultyBreakdown: {
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  };
  lastPracticedDate: string | null;
  needsReinforcement: boolean;
}

/** Performance metrics for a difficulty tier */
export interface DifficultyPerformance {
  difficulty: ProblemDifficulty;
  attemptedCount: number;
  solvedCount: number;
  solveRate: number;
  averageConfidence: number;
  primaryFriction: FrictionType | null;
}

/** Post-problem user feedback bundle */
export interface PracticeFeedback {
  problemId: string;
  status: AttemptStatus;
  confidence: ConfidenceLevel;
  difficultyFeedback: PerceivedDifficulty;
  primaryFriction: FrictionType;
  notes?: string;
  timeSpentMinutes?: number;
}

/** Comprehensive adaptive profile synthesizing user's practice telemetry */
export interface AdaptivePracticeProfile {
  overallConfidence: number; // 1.0 to 5.0
  overallSolveRate: number; // 0.0 to 1.0
  topicPerformances: Record<string, TopicPerformance>;
  difficultyPerformances: Record<ProblemDifficulty, DifficultyPerformance>;
  weakTopics: ProblemTopic[];
  developingTopics: ProblemTopic[];
  strongTopics: ProblemTopic[];
  recentFrictionPoints: FrictionType[];
  currentStreak: number;
  recommendedFocusTopic: ProblemTopic;
  recommendedDifficulty: ProblemDifficulty;
  adaptiveReasoning: string;
}

/** Alias for backward compatibility */
export type PracticeAttempt = UserProblemAttempt;

/** A single student's daily practice plan entity */
export interface DailyPracticePlan {
  userId: string;
  /** Local calendar date YYYY-MM-DD */
  date: string;
  recommendedCount: number;
  easyTarget: number;
  mediumTarget: number;
  hardTarget: number;
  completedCount: number;
  solvedCount: number;
  attemptedCount: number;
  remainingCount?: number;
  dailyScore: number | null;
  completionRate: number;
  averageConfidence: number;
  averageDifficulty: number;
  primaryFriction: FrictionType | null;
  status: DailyPracticeStatus;
  /** Current priority focus topic for today */
  focusTopic?: ProblemTopic;
  /** Primary next recommended problem */
  nextRecommendedProblem?: CodingProblem;
  /** Concise explainable reason for next problem */
  nextProblemReason?: string;
  /** List of problem IDs recommended for today */
  problemIds: string[];
  createdAt: string;
  updatedAt: string;
}

/** Historical practice summary record for 7-day trend analytics */
export interface DailyHistoryItem {
  /** Local date string YYYY-MM-DD */
  date: string;
  recommendedCount: number;
  completedCount: number;
  solvedCount: number;
  attemptedCount: number;
  dailyScore: number | null;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  strongestTopic?: string;
  weakestTopic?: string;
  averageConfidence?: number;
}


