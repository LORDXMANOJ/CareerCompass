"use client";

// =============================================================================
// CareerCompass — Problem Tracker Hook
// =============================================================================
// Client-side state management for problem attempts and adaptive daily practice.
// Persists to localStorage and syncs to Supabase profiles.user_activity JSONB.
// =============================================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { OnboardingState } from "@/types";
import {
  UserProblemAttempt,
  AttemptStatus,
  DailyPracticePlan,
  DailyHistoryItem,
  DailyBudgetBreakdown,
} from "@/types/problems";
import {
  getLocalDateString,
  initializeDailyPlan,
  buildSevenDayHistory,
  computeDailyPracticeBudget,
} from "@/lib/daily-practice-intelligence";

const STORAGE_KEY_PREFIX = "cc_problem_attempts";
const DAILY_PLAN_KEY_PREFIX = "cc_daily_practice_plan";
const DAILY_HISTORY_KEY_PREFIX = "cc_daily_practice_history";

interface UseProblemTrackerResult {
  /** All recorded attempts in chronological order */
  attempts: UserProblemAttempt[];
  /** Set of problem IDs that are solved */
  solvedIds: string[];
  /** Log a new problem attempt */
  logAttempt: (attempt: UserProblemAttempt, onboardingState?: OnboardingState) => void;
  /** Check if a specific problem has been solved */
  isAlreadySolved: (problemId: string) => boolean;
  /** Check if a specific problem has any attempt logged */
  hasAttempt: (problemId: string) => boolean;
  /** Get the latest attempt for a specific problem */
  getLatestAttempt: (problemId: string) => UserProblemAttempt | null;
  /** Count of total solved problems */
  totalSolved: number;
  /** Count of total attempted problems (unique) */
  totalAttempted: number;
  /** Clear all attempts (for testing) */
  clearHistory: () => void;
  /** Whether state has been loaded from storage */
  isLoaded: boolean;
  /** Today's active daily practice plan */
  dailyPlan: DailyPracticePlan | null;
  /** Authentic 7-day practice history array [T-6, ..., T] */
  sevenDayHistory: DailyHistoryItem[];
  /** Computed budget breakdown for today */
  getBudget: (onboardingState: OnboardingState) => DailyBudgetBreakdown;
  /** Refresh or initialize today's plan with onboarding state */
  syncDailyPlan: (onboardingState: OnboardingState) => DailyPracticePlan;
}

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}_${userId}`;
}

function getDailyPlanKey(userId: string): string {
  return `${DAILY_PLAN_KEY_PREFIX}_${userId}`;
}

function getDailyHistoryKey(userId: string): string {
  return `${DAILY_HISTORY_KEY_PREFIX}_${userId}`;
}

function loadAttemptsFromStorage(userId: string): UserProblemAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAttemptsToStorage(userId: string, attempts: UserProblemAttempt[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(attempts));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

function loadDailyPlanFromStorage(userId: string): DailyPracticePlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getDailyPlanKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveDailyPlanToStorage(userId: string, plan: DailyPracticePlan | null): void {
  if (typeof window === "undefined" || !plan) return;
  try {
    localStorage.setItem(getDailyPlanKey(userId), JSON.stringify(plan));
  } catch {
    // Silently fail
  }
}

function loadDailyHistoryFromStorage(userId: string): DailyHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getDailyHistoryKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDailyHistoryToStorage(userId: string, history: DailyHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getDailyHistoryKey(userId), JSON.stringify(history));
  } catch {
    // Silently fail
  }
}

function isSolvedStatus(status: AttemptStatus): boolean {
  return status === "solved_independent" || status === "solved_with_help";
}

export function useProblemTracker(userId: string): UseProblemTrackerResult {
  const [attempts, setAttempts] = useState<UserProblemAttempt[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPracticePlan | null>(null);
  const [storedHistory, setStoredHistory] = useState<DailyHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep references to latest attempts and dailyPlan to avoid circular callback dependencies
  const attemptsRef = useRef<UserProblemAttempt[]>(attempts);
  attemptsRef.current = attempts;

  const dailyPlanRef = useRef<DailyPracticePlan | null>(dailyPlan);
  dailyPlanRef.current = dailyPlan;

  // Load from localStorage on mount
  useEffect(() => {
    const loadedAttempts = loadAttemptsFromStorage(userId);
    const loadedPlan = loadDailyPlanFromStorage(userId);
    const loadedHistory = loadDailyHistoryFromStorage(userId);

    setAttempts(loadedAttempts);
    setDailyPlan(loadedPlan);
    setStoredHistory(loadedHistory);
    setIsLoaded(true);
  }, [userId]);

  // Persist attempts whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveAttemptsToStorage(userId, attempts);
    }
  }, [attempts, userId, isLoaded]);

  // Persist daily plan whenever it changes
  useEffect(() => {
    if (isLoaded && dailyPlan) {
      saveDailyPlanToStorage(userId, dailyPlan);
    }
  }, [dailyPlan, userId, isLoaded]);

  // Persist history whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveDailyHistoryToStorage(userId, storedHistory);
    }
  }, [storedHistory, userId, isLoaded]);

  // Synchronize daily practice plan without triggering recursive render loop
  const syncDailyPlan = useCallback(
    (onboardingState: OnboardingState): DailyPracticePlan => {
      const currentPlan = dailyPlanRef.current;
      const plan = initializeDailyPlan(userId, onboardingState, attemptsRef.current, currentPlan);
      if (plan !== currentPlan) {
        setDailyPlan(plan);
      }
      return plan;
    },
    [userId]
  );

  const getBudget = useCallback(
    (onboardingState: OnboardingState): DailyBudgetBreakdown => {
      return computeDailyPracticeBudget(onboardingState, attemptsRef.current);
    },
    []
  );

  const logAttempt = useCallback(
    (attempt: UserProblemAttempt, onboardingState?: OnboardingState) => {
      const prev = attemptsRef.current;
      const existingSolve = prev.find(
        (a) =>
          a.problemId === attempt.problemId &&
          a.status === "solved_independent"
      );
      if (existingSolve && attempt.status === "solved_independent") {
        return;
      }
      const updated = [...prev, attempt];
      setAttempts(updated);

      // Update daily plan if onboardingState is provided
      if (onboardingState) {
        const currentPlan = dailyPlanRef.current;
        const updatedPlan = initializeDailyPlan(userId, onboardingState, updated, currentPlan);
        if (updatedPlan !== currentPlan) {
          setDailyPlan(updatedPlan);
        }

        // Update daily history entry
        const today = getLocalDateString();
        setStoredHistory((prevHist) => {
          const existingIdx = prevHist.findIndex((h) => h.date === today);
          const historyEntry: DailyHistoryItem = {
            date: today,
            recommendedCount: updatedPlan.recommendedCount,
            completedCount: updatedPlan.completedCount,
            solvedCount: updatedPlan.solvedCount,
            attemptedCount: updatedPlan.attemptedCount,
            dailyScore: updatedPlan.dailyScore,
            easySolved: updated.filter((a) => a.status === "solved_independent" || a.status === "solved_with_help").length,
            mediumSolved: 0,
            hardSolved: 0,
          };

          if (existingIdx >= 0) {
            const copy = [...prevHist];
            copy[existingIdx] = historyEntry;
            return copy;
          }
          return [...prevHist, historyEntry];
        });
      }
    },
    [userId]
  );

  const solvedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of attempts) {
      if (isSolvedStatus(a.status)) {
        ids.add(a.problemId);
      }
    }
    return Array.from(ids);
  }, [attempts]);

  const isAlreadySolved = useCallback(
    (problemId: string) => solvedIds.includes(problemId),
    [solvedIds]
  );

  const hasAttempt = useCallback(
    (problemId: string) => attempts.some((a) => a.problemId === problemId),
    [attempts]
  );

  const getLatestAttempt = useCallback(
    (problemId: string): UserProblemAttempt | null => {
      const matching = attempts.filter((a) => a.problemId === problemId);
      return matching.length > 0 ? matching[matching.length - 1] : null;
    },
    [attempts]
  );

  const totalSolved = solvedIds.length;

  const totalAttempted = useMemo(() => {
    const uniqueIds = new Set(attempts.map((a) => a.problemId));
    return uniqueIds.size;
  }, [attempts]);

  const sevenDayHistory = useMemo(() => {
    return buildSevenDayHistory(storedHistory, dailyPlan, attempts);
  }, [storedHistory, dailyPlan, attempts]);

  const clearHistory = useCallback(() => {
    setAttempts([]);
    setDailyPlan(null);
    setStoredHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(getStorageKey(userId));
      localStorage.removeItem(getDailyPlanKey(userId));
      localStorage.removeItem(getDailyHistoryKey(userId));
    }
  }, [userId]);

  return useMemo(
    () => ({
      attempts,
      solvedIds,
      logAttempt,
      isAlreadySolved,
      hasAttempt,
      getLatestAttempt,
      totalSolved,
      totalAttempted,
      clearHistory,
      isLoaded,
      dailyPlan,
      sevenDayHistory,
      getBudget,
      syncDailyPlan,
    }),
    [
      attempts,
      solvedIds,
      logAttempt,
      isAlreadySolved,
      hasAttempt,
      getLatestAttempt,
      totalSolved,
      totalAttempted,
      clearHistory,
      isLoaded,
      dailyPlan,
      sevenDayHistory,
      getBudget,
      syncDailyPlan,
    ]
  );
}

