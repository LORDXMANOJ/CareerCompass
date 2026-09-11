"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OnboardingState } from "@/types";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepCompanion } from "@/components/onboarding/step-companion";
import { StepRole } from "@/components/onboarding/step-role";
import { StepCompanies } from "@/components/onboarding/step-companies";
import { StepEducation } from "@/components/onboarding/step-education";
import { StepSkills } from "@/components/onboarding/step-skills";
import { StepExperience } from "@/components/onboarding/step-experience";
import { StepConnections } from "@/components/onboarding/step-connections";
import { StepSynthesisReport } from "@/components/onboarding/step-synthesis-report";
import { MentorPanel } from "@/components/onboarding/mentor-panel";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { normalizeDashboardState } from "@/lib/dashboard-intelligence";
import { ThemeToggle } from "@/components/theme-toggle";

interface OnboardingFlowProps {
  initialEmail?: string;
  initialName?: string;
  savedProfile?: Record<string, unknown> | null;
}

export function OnboardingFlow(props: OnboardingFlowProps = {}) {
  const { theme } = useCompanionTheme();
  const [state, setState] = useState<OnboardingState>(() => {
    if (props.savedProfile && props.savedProfile.target_role) {
      const normalized = normalizeDashboardState(props.savedProfile);
      return { ...normalized, step: 1 };
    }
    return {
      step: 1,
      selectedMentor: "athena",
      targetRole: "Software Engineer",
      targetCompanies: ["Google", "Microsoft"],
      education: {
        degree: "B.Tech / B.E.",
        department: "Computer Science & Engineering",
        college: "National Institute of Technology",
        graduationYear: "2027",
      },
      skills: {
        languages: ["Java", "Python"],
        frameworks: ["React", "Spring Boot"],
        databases: ["PostgreSQL", "MongoDB"],
        aiTools: ["GitHub Copilot", "ChatGPT"],
      },
      experience: {
        gitUsage: "comfortable",
        projectCount: "3-5",
        dsaLevel: "medium",
        deploymentExperience: "once_or_twice",
        apiExperience: "built_rest",
        databaseExperience: "queries_joins",
        teamExperience: "college_team",
      },
      connectedAccounts: {
        github: "",
        linkedin: "",
        leetcode: "",
      },
      readinessSummary: null,
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // If the account has not completed onboarding, guarantee fresh Step 1 (Welcome)
    // and purge any stale localStorage state left over from previous browser sessions.
    if (props.savedProfile && props.savedProfile.onboarding_completed === false) {
      if (!props.savedProfile.target_role) {
        localStorage.removeItem("career_compass_onboarding");
      }
      setState((prev) => ({ ...prev, step: 1 }));
      return;
    }

    if (props.savedProfile && props.savedProfile.target_role) {
      const normalized = normalizeDashboardState(props.savedProfile);
      setState({ ...normalized, step: 1 });
      return;
    }

    const saved = localStorage.getItem("career_compass_onboarding");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // use default state
      }
    }
  }, [props.savedProfile]);

  const saveState = (newState: OnboardingState) => {
    setState(newState);
    localStorage.setItem("career_compass_onboarding", JSON.stringify(newState));
  };

  const nextStep = () => {
    const next = Math.min(state.step + 1, 9);
    saveState({ ...state, step: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    const prev = Math.max(state.step - 1, 1);
    saveState({ ...state, step: prev });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateReport = async () => {
    setIsSaving(false);
    const next = 9;
    saveState({ ...state, step: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 is full-page companion selection
  if (state.step === 2) {
    return (
      <div
        className="w-full h-screen flex flex-col transition-colors duration-200"
        style={{ backgroundColor: "var(--cc-bg, #030712)", color: "var(--cc-text, #f8fafc)" }}
      >
        <div
          className="h-14 px-4 sm:px-8 border-b flex items-center justify-between shrink-0 backdrop-blur-md"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderSubtle,
          }}
        >
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-md"
              style={{ backgroundColor: theme.primary }}
            >
              CC
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ color: theme.text }}>
              CareerCompass
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-28 sm:w-44 h-2 rounded-full overflow-hidden border"
              style={{
                backgroundColor: theme.isLight ? "#e2e8f0" : "#0f172a",
                borderColor: theme.borderSubtle,
              }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${((state.step - 1) / 7) * 100}%`,
                  background: theme.progressGradient,
                }}
              />
            </div>
            <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
              Step 1/7
            </span>

            {/* Global Light/Dark Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          <StepCompanion
            selectedMentor={state.selectedMentor}
            onSelect={(mentorId) => setState({ ...state, selectedMentor: mentorId })}
            onNext={nextStep}
            onBack={prevStep}
          />
        </div>
      </div>
    );
  }

  const isMentorStep = state.step >= 3 && state.step <= 8 && Boolean(state.selectedMentor);

  return (
    <div
      className="w-full min-h-screen transition-colors duration-200 flex flex-col justify-between"
      style={{ backgroundColor: "var(--cc-bg, #030712)", color: "var(--cc-text, #f8fafc)" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 py-6 flex-1">
        {/* Brand Header */}
        <div
          className="flex items-center justify-between mb-8 pb-4 border-b"
          style={{ borderColor: theme.borderSubtle }}
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-105 transition-transform duration-300"
              style={{
                backgroundColor: theme.primary,
                boxShadow: theme.isLight ? theme.shadowSm : `0 0 16px ${theme.glow}`,
              }}
            >
              CC
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: theme.text }}>
              CareerCompass
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {state.step > 1 && state.step < 9 && (
              <div className="hidden sm:flex items-center gap-3">
                <div
                  className="w-36 sm:w-56 h-2.5 rounded-full overflow-hidden border"
                  style={{
                    backgroundColor: theme.isLight ? "#e2e8f0" : "#0f172a",
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${((state.step - 1) / 7) * 100}%`,
                      background: theme.progressGradient,
                    }}
                  />
                </div>
                <span className="text-xs font-bold font-mono" style={{ color: theme.textMuted }}>
                  Step {state.step - 1}/7
                </span>
              </div>
            )}

            {/* Global Light/Dark Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Step Routing with Dedicated Mentor Column on Desktop */}
        {isMentorStep ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 xl:gap-10 items-start">
            {/* Primary Main Content Area */}
            <div className="min-w-0">
              {state.step === 3 && (
                <StepRole
                  targetRole={state.targetRole}
                  selectedMentorId={state.selectedMentor}
                  userSkills={state.skills}
                  onSelect={(role) => setState({ ...state, targetRole: role })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {state.step === 4 && (
                <StepCompanies
                  selectedCompanies={state.targetCompanies}
                  targetRole={state.targetRole}
                  selectedMentorId={state.selectedMentor}
                  userSkills={state.skills}
                  onToggle={(company) => {
                    const list = state.targetCompanies.includes(company)
                      ? state.targetCompanies.filter((c) => c !== company)
                      : [...state.targetCompanies, company];
                    setState({ ...state, targetCompanies: list });
                  }}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {state.step === 5 && (
                <StepEducation
                  education={state.education}
                  selectedMentorId={state.selectedMentor}
                  targetRole={state.targetRole}
                  targetCompanies={state.targetCompanies}
                  skills={state.skills}
                  experience={state.experience}
                  onChange={(edu) => setState({ ...state, education: edu })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {state.step === 6 && (
                <StepSkills
                  skills={state.skills}
                  selectedMentorId={state.selectedMentor}
                  onChange={(skills) => setState({ ...state, skills })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {state.step === 7 && (
                <StepExperience
                  experience={state.experience}
                  selectedMentorId={state.selectedMentor}
                  onChange={(exp) => setState({ ...state, experience: exp })}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {state.step === 8 && (
                <StepConnections
                  connections={state.connectedAccounts}
                  onChange={(conn) => setState({ ...state, connectedAccounts: conn })}
                  onNext={handleGenerateReport}
                  onBack={prevStep}
                />
              )}
            </div>

            {/* Desktop Dedicated Mentor Column */}
            <div className="hidden xl:block sticky top-8">
              <MentorPanel
                mentorId={state.selectedMentor}
                step={state.step}
                state={state}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {state.step === 1 && <StepWelcome onNext={nextStep} />}
            {state.step === 9 && (
              <StepSynthesisReport
                summary={state.readinessSummary}
                selectedMentorId={state.selectedMentor}
                isSaving={isSaving}
              />
            )}
          </div>
        )}
      </div>

      {/* Floating Mobile Mentor for smaller viewports */}
      {isMentorStep && (
        <div className="xl:hidden">
          <MentorPanel
            mentorId={state.selectedMentor}
            step={state.step}
            state={state}
          />
        </div>
      )}
    </div>
  );
}
