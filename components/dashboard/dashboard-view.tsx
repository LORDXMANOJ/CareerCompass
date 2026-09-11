"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { OnboardingState, UserActivity } from "@/types";
import { saveUserActivityAction } from "@/app/dashboard/actions";
import {
  computeDashboardReadiness,
  generateDailyMission,
  computeSkillGaps,
  computeCompanyReadinessCards,
  computeRoadmapPhases,
  computeCareerInsights,
  computeNextBestAction,
  getMentorDashboardAdvice,
} from "@/lib/dashboard-intelligence";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { ReadinessCard } from "@/components/dashboard/readiness-card";
import { TodaysMissionCard } from "@/components/dashboard/todays-mission-card";
import { CompanionCard } from "@/components/dashboard/companion-card";
import { RoadmapSection } from "@/components/dashboard/roadmap-section";
import { SkillGapSection } from "@/components/dashboard/skill-gap-section";
import { CompanyReadinessSection } from "@/components/dashboard/company-readiness-section";
import { PracticalExperienceCard } from "@/components/dashboard/practical-experience-card";
import { SkillVerificationCard } from "@/components/dashboard/skill-verification-card";
import { EvidenceConnectionsCard } from "@/components/dashboard/evidence-connections-card";
import { WeeklyProgressCard } from "@/components/dashboard/weekly-progress-card";
import { TodaysPracticeCard } from "@/components/dashboard/todays-practice-card";
import { PersistentCompanion } from "@/components/companion/persistent-companion";
import { CareerInsightsSection } from "@/components/dashboard/career-insights-section";
import { NextActionBanner } from "@/components/dashboard/next-action-banner";
import { QuickActionsGrid } from "@/components/dashboard/quick-actions-grid";

interface DashboardViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
}

export function DashboardView({
  onboardingState: initialOnboardingState,
  userName,
  userEmail,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(initialOnboardingState);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("cc_sidebar_collapsed");
    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === "true");
    }

    try {
      const savedOnboarding = localStorage.getItem("career_compass_onboarding");
      if (savedOnboarding) {
        const parsed = JSON.parse(savedOnboarding);
        if (parsed && typeof parsed === "object" && parsed.selectedMentor) {
          setOnboardingState((prev) => ({
            ...prev,
            ...parsed,
            targetCompanies: Array.isArray(parsed.targetCompanies) && parsed.targetCompanies.length > 0
              ? parsed.targetCompanies
              : prev.targetCompanies,
          }));
        }
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("cc_sidebar_collapsed", String(next));
      return next;
    });
  };

  const readiness = useMemo(
    () => computeDashboardReadiness(onboardingState),
    [onboardingState]
  );

  const dailyMission = useMemo(
    () => generateDailyMission(onboardingState),
    [onboardingState]
  );

  const skillGaps = useMemo(
    () => computeSkillGaps(onboardingState),
    [onboardingState]
  );

  const companyReadiness = useMemo(
    () => computeCompanyReadinessCards(onboardingState),
    [onboardingState]
  );

  const { phases, currentPhaseIndex } = useMemo(
    () => computeRoadmapPhases(onboardingState),
    [onboardingState]
  );

  const careerInsights = useMemo(
    () => computeCareerInsights(onboardingState),
    [onboardingState]
  );

  const nextBestAction = useMemo(
    () => computeNextBestAction(onboardingState),
    [onboardingState]
  );

  const mentorAdvice = useMemo(
    () => getMentorDashboardAdvice(onboardingState.selectedMentor),
    [onboardingState.selectedMentor]
  );

  const verifiedSkillsCount = useMemo(() => {
    if (!onboardingState.skills.verification) return 0;
    return Object.values(onboardingState.skills.verification).filter(
      (v) => v.isCorrect
    ).length;
  }, [onboardingState.skills.verification]);

  const totalSkillsCount = useMemo(() => {
    const s = onboardingState.skills;
    return s.languages.length + s.frameworks.length + s.databases.length;
  }, [onboardingState.skills]);

  const handleTaskToggle = (taskId: string) => {
    setOnboardingState((prev) => {
      const currentActivity = prev.userActivity || {
        completedMissionIds: [],
        completedTaskIds: [],
        dsaSolvedCount: 0,
        weeklyMissionsCompleted: 0,
      };

      const exists = currentActivity.completedTaskIds.includes(taskId);
      const nextTaskIds = exists
        ? currentActivity.completedTaskIds.filter((id) => id !== taskId)
        : [...currentActivity.completedTaskIds, taskId];

      const dailyMissionTaskIds = dailyMission.tasks.map((t) => t.id);
      const completedDailyCount = dailyMissionTaskIds.filter((id) =>
        nextTaskIds.includes(id)
      ).length;

      const isMissionFinished = completedDailyCount === dailyMissionTaskIds.length;
      const weeklyMissionsCompleted = isMissionFinished
        ? Math.max(currentActivity.weeklyMissionsCompleted, 1)
        : currentActivity.weeklyMissionsCompleted;

      const updatedActivity: UserActivity = {
        ...currentActivity,
        completedTaskIds: nextTaskIds,
        weeklyMissionsCompleted,
        lastActiveIso: new Date().toISOString(),
      };

      const updatedState = {
        ...prev,
        userActivity: updatedActivity,
      };

      try {
        localStorage.setItem(
          "career_compass_onboarding",
          JSON.stringify(updatedState)
        );
      } catch {
        // Ignore storage error
      }

      saveUserActivityAction(updatedActivity).catch(() => {});

      return updatedState;
    });
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 flex selection:bg-purple-500 selection:text-white"
      style={{
        backgroundColor: "var(--cc-bg, #030712)",
        color: "var(--cc-text, #f8fafc)",
      }}
    >
      {/* Collapsible Left Desktop Sidebar */}
      <DashboardSidebar
        mentorId={onboardingState.selectedMentor}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <DashboardNav
          userName={userName}
          userEmail={userEmail}
          mentorId={onboardingState.selectedMentor}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Wide Main Content Canvas */}
        <main className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-12 py-8 space-y-8 flex-1">
          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <DashboardHero
              userName={userName}
              targetRole={onboardingState.targetRole}
              targetCompanies={onboardingState.targetCompanies}
              graduationYear={onboardingState.education.graduationYear}
            />
          </motion.div>

          {/* Row 1: Readiness Command Center & Today's Mission */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
              <ReadinessCard readiness={readiness} />
            </div>
            <div className="xl:col-span-5">
              <TodaysMissionCard
                mission={dailyMission}
                onTaskToggle={handleTaskToggle}
                completedTaskIds={onboardingState.userActivity?.completedTaskIds}
              />
            </div>
          </div>

          {/* Row 2: Adaptive Daily Practice Budget & 7-Day Performance */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-7">
              <TodaysPracticeCard onboardingState={onboardingState} />
            </div>
            <div className="xl:col-span-5">
              <WeeklyProgressCard
                userActivity={onboardingState.userActivity}
                verifiedSkillsCount={verifiedSkillsCount}
                totalSkillsCount={totalSkillsCount}
              />
            </div>
          </div>

          {/* Row 3: Active Companion Coaching */}
          <div>
            <CompanionCard
              mentorId={onboardingState.selectedMentor}
              advice={mentorAdvice}
            />
          </div>

          {/* Row 3: Career Roadmap */}
          <RoadmapSection phases={phases} currentPhaseIndex={currentPhaseIndex} />

          {/* Row 4: Skill Gaps Analysis */}
          <SkillGapSection
            targetRoleName={skillGaps.targetRoleName}
            strongSkills={skillGaps.strongSkills}
            missingSkills={skillGaps.missingSkills}
          />

          {/* Row 5: Dream Company Readiness */}
          <CompanyReadinessSection companies={companyReadiness} />

          {/* Row 6: Practical Experience, Skill Verification, Evidence Connections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PracticalExperienceCard experience={onboardingState.experience} />
            <SkillVerificationCard skills={onboardingState.skills} />
            <EvidenceConnectionsCard connections={onboardingState.connectedAccounts} />
          </div>

          {/* Row 7: Deterministic Career Insights */}
          <CareerInsightsSection insights={careerInsights} />

          {/* Row 8: Next Best Action */}
          <NextActionBanner action={nextBestAction} />

          {/* Row 9: Quick Actions Grid */}
          <QuickActionsGrid />

          {/* Footer */}
          <footer className="pt-12 pb-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-md bg-purple-600/30 flex items-center justify-center text-purple-400 text-[10px] font-bold">
                CC
              </div>
              <span>CareerCompass © {new Date().getFullYear()} • AI Career Operating System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Deterministic Intelligence Engine</span>
              <span>•</span>
              <span>Placement Readiness v2.4</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Persistent Website-Wide Career Mentor Layer */}
      <PersistentCompanion
        mentorId={onboardingState.selectedMentor}
        onboardingState={onboardingState}
      />
    </div>
  );
}
