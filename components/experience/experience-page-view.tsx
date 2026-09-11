"use client";

import React from "react";
import { OnboardingState } from "@/types";
import { AppPageShell } from "@/components/layout/app-page-shell";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  FolderGit2,
  GitBranch,
  Cloud,
  Server,
  Database,
  Users,
  Code2,
  Info,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface ExperiencePageViewProps {
  onboardingState: OnboardingState;
  userName: string;
  userEmail: string;
  mentorId: string;
}

export function ExperiencePageView({
  onboardingState,
  userName,
  userEmail,
  mentorId,
}: ExperiencePageViewProps) {
  const { theme } = useCompanionTheme();
  const exp = onboardingState.experience;
  const conn = onboardingState.connectedAccounts;

  const cardStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    boxShadow: theme.isLight ? theme.shadowSm : undefined,
  };

  const experienceMetrics = [
    {
      title: "Project Portfolio",
      icon: FolderGit2,
      value: `${exp.projectCount || "0"} Projects Built`,
      status: "Self-Reported",
      statusType: "reported",
      detail: exp.representativeProject?.name
        ? `Lead Project: ${exp.representativeProject.name}`
        : "Representative projects captured in onboarding.",
    },
    {
      title: "Git & Version Control",
      icon: GitBranch,
      value: `Level: ${exp.gitUsage || "beginner"}`,
      status: conn.github ? (conn.githubVerified ? "Verified (GitHub)" : "Connected") : "Self-Reported",
      statusType: conn.githubVerified ? "verified" : "reported",
      detail: conn.github ? `Connected to GitHub: @${conn.github}` : "Connect your GitHub account in onboarding to verify commit history.",
    },
    {
      title: "Cloud & Deployment",
      icon: Cloud,
      value: `Experience: ${exp.deploymentExperience || "tried"}`,
      status: "Self-Reported",
      statusType: "reported",
      detail: "Live production URL evidence and deployment verification.",
    },
    {
      title: "Backend & API Architecture",
      icon: Server,
      value: `Proficiency: ${exp.apiExperience || "consumed"}`,
      status: "Self-Reported",
      statusType: "reported",
      detail: "Building REST/GraphQL endpoints and handling client integration.",
    },
    {
      title: "Databases & Schemas",
      icon: Database,
      value: `Proficiency: ${exp.databaseExperience || "basic_crud"}`,
      status: "Self-Reported",
      statusType: "reported",
      detail: "Relational indexing, joins, migrations, and schema design.",
    },
    {
      title: "Team & PR Workflow",
      icon: Users,
      value: `Experience: ${exp.teamExperience || "mostly_solo"}`,
      status: "Self-Reported",
      statusType: "reported",
      detail: "Collaborative Git branches, code reviews, and issue triage.",
    },
    {
      title: "DSA & Core Problem Solving",
      icon: Code2,
      value: `Level: ${exp.dsaLevel || "learning"}`,
      status: conn.leetcode ? "Connected (LeetCode)" : "Self-Reported",
      statusType: conn.leetcode ? "verified" : "reported",
      detail: conn.leetcode ? `Connected to LeetCode: @${conn.leetcode}` : "Connect LeetCode / Codeforces to verify problem counts.",
    },
  ];

  return (
    <AppPageShell
      userName={userName}
      userEmail={userEmail}
      mentorId={mentorId}
      title="Practical Experience"
      subtitle="Track the hands-on development, cloud deployment, and problem-solving depth that proves your capability."
      badge="Engineering Evidence v2.0"
      headerAction={
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-105"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
            color: theme.text,
          }}
        >
          <span>Update Experience</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border" style={cardStyle}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block mb-1"
              style={{ color: theme.primary }}
            >
              Practical Experience Index
            </span>
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: theme.text }}>
              Engineering Evidence Calibration
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textSecondary }}>
              Distinguishing student self-evaluations from cryptographically and repository-verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="p-4 rounded-2xl border text-center min-w-[140px]"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase block" style={{ color: theme.textMuted }}>
                Tracked Dimensions
              </span>
              <span className="text-2xl font-black font-mono" style={{ color: theme.primary }}>
                7 Areas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experienceMetrics.map((item, idx) => {
          const Icon = item.icon;
          const isVerified = item.statusType === "verified";

          return (
            <div
              key={idx}
              className="p-6 rounded-3xl border flex flex-col justify-between transition-all"
              style={cardStyle}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="h-10 w-10 rounded-2xl border flex items-center justify-center"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                    style={{
                      backgroundColor: isVerified ? "rgba(16, 185, 129, 0.15)" : theme.surfaceMuted,
                      borderColor: isVerified ? "rgba(16, 185, 129, 0.35)" : theme.borderSubtle,
                      color: isVerified ? theme.success : theme.textMuted,
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-black mb-1" style={{ color: theme.text }}>
                  {item.title}
                </h3>
                <div className="text-lg font-bold font-mono mb-3" style={{ color: theme.primary }}>
                  {item.value}
                </div>

                <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                  {item.detail}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t" style={{ borderColor: theme.borderSubtle }}>
                <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
                  Dimension evaluated for {onboardingState.targetRole}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Review Placeholder Notice */}
      <div
        className="p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3"
        style={{
          backgroundColor: theme.primarySoft,
          borderColor: theme.borderHighlight,
        }}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
        <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
          <strong className="font-bold" style={{ color: theme.text }}>
            Staff Review Note:
          </strong>{" "}
          Automatic GitHub repository commit parsers, Vercel deployment link inspectors, and LeetCode OAuth verification will populate real metrics on this practical experience canvas in future sprints.
        </p>
      </div>
    </AppPageShell>
  );
}
