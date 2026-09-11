import { OnboardingState, SkillsSelection, SkillVerificationRecord } from "@/types";
import { ROLE_CATALOG } from "@/constants/roles";
import { VERIFIED_COMPANIES } from "@/constants/companies-data";
import { calculateDeterministicCompanyScore } from "@/lib/company-matcher";

export type SkillStatusType =
  | "verified"
  | "evidence_backed"
  | "self_reported"
  | "claimed"
  | "needs_review"
  | "missing";

export interface EnrichedSkillItem {
  name: string;
  category: "Languages" | "Frameworks" | "Databases" | "Cloud & DevOps" | "AI & Tools" | "Core Engineering";
  status: SkillStatusType;
  statusLabel: string;
  isVerified: boolean;
  needsReview: boolean;
  roleRelevance: "High" | "Medium" | "Supporting";
  whyItMatters: string;
  whatWeKnow: string;
  roadmapPhase: string;
  roadmapTask: string;
  relatedCompanies: string[];
  hasVerificationQuiz: boolean;
  actionText: string;
  actionHref: string;
}

export interface TargetRoleSkillRequirement {
  name: string;
  type: "Core Required" | "Supporting";
  status: SkillStatusType;
  priority: "High" | "Medium" | "Standard";
  reason: string;
}

export interface SkillGapMatrixRow {
  skillName: string;
  yourState: SkillStatusType;
  yourStateLabel: string;
  roleNeed: "Required" | "Supporting" | "Recommended";
  priority: "High" | "Medium" | "Low";
  actionText: string;
  actionHref: string;
}

export interface PrioritySkillGap {
  name: string;
  priority: "High" | "Medium";
  why: string;
  recommendedAction: string;
  actionHref: string;
  actionButtonText: string;
}

export interface SkillsWorkspaceData {
  targetRole: string;
  targetCompanies: string[];
  totalClaimedCount: number;
  totalVerifiedCount: number;
  needsReviewCount: number;
  priorityGapsCount: number;
  inventory: {
    languages: EnrichedSkillItem[];
    frameworks: EnrichedSkillItem[];
    databases: EnrichedSkillItem[];
    aiAndTools: EnrichedSkillItem[];
  };
  targetRoleRequirements: TargetRoleSkillRequirement[];
  skillGapMatrix: SkillGapMatrixRow[];
  priorityGaps: PrioritySkillGap[];
  strongestArea: string;
  largestGap: string;
  nextRecommendedSkill: string;
  companionMessage: string;
  companionFocusPillar: string;
}

/**
 * Categorizes and enriches candidate skills into comprehensive workspace data.
 */
export function computeSkillsWorkspace(state: OnboardingState): SkillsWorkspaceData {
  const skills: SkillsSelection = state.skills || {
    languages: [],
    frameworks: [],
    databases: [],
    aiTools: [],
    verification: {},
  };

  const verifications: Record<string, SkillVerificationRecord> = skills.verification || {};
  const matchedRole = ROLE_CATALOG.find(
    (r) => r.name.toLowerCase() === state.targetRole.toLowerCase() || r.id === state.targetRole.toLowerCase()
  ) || ROLE_CATALOG[0];

  const roleTopSkills = matchedRole.topSkills.map((s) => s.toLowerCase());

  // Helper to determine status
  const evaluateStatus = (skillName: string): { status: SkillStatusType; label: string; verified: boolean; needsReview: boolean } => {
    const key = skillName.toLowerCase();
    const record = verifications[key];

    if (record) {
      if (record.isCorrect) {
        return { status: "verified", label: "Verified", verified: true, needsReview: false };
      }
      return { status: "needs_review", label: "Needs Review", verified: false, needsReview: true };
    }

    // Check evidence connection for git / github
    if (key.includes("git") && (state.connectedAccounts.githubVerified || state.experience.gitUsage === "daily")) {
      return { status: "evidence_backed", label: "Evidence-Backed", verified: true, needsReview: false };
    }

    return { status: "self_reported", label: "Self-Reported", verified: false, needsReview: false };
  };

  // Helper to find related companies that look for this skill
  const getRelatedCompanies = (skillName: string): string[] => {
    const matched: string[] = [];
    for (const compName of state.targetCompanies) {
      const verified = VERIFIED_COMPANIES.find(
        (c) => c.name.toLowerCase() === compName.toLowerCase() || c.id === compName.toLowerCase()
      );
      if (verified) {
        const score = calculateDeterministicCompanyScore(verified, state.targetRole, state.skills);
        if (score.matchedSkills.some((s) => s.toLowerCase().includes(skillName.toLowerCase()))) {
          matched.push(verified.name);
        }
      }
    }
    return matched;
  };

  // Enrich a skill item
  const enrichItem = (name: string, category: EnrichedSkillItem["category"]): EnrichedSkillItem => {
    const { status, label, verified, needsReview } = evaluateStatus(name);
    const isCoreRole = roleTopSkills.some((rs) => rs.includes(name.toLowerCase()) || name.toLowerCase().includes(rs));
    const roleRelevance = isCoreRole ? "High" : "Medium";
    const companies = getRelatedCompanies(name);

    return {
      name,
      category,
      status,
      statusLabel: label,
      isVerified: verified,
      needsReview,
      roleRelevance,
      whyItMatters: isCoreRole
        ? `Essential core competency for ${matchedRole.name} hiring rounds and technical interviews.`
        : `Supporting competency that broadens system integration capability for modern software teams.`,
      whatWeKnow: verified
        ? `Concept question answered correctly in verification assessment.`
        : needsReview
        ? `Concept question attempted; review recommended to solidify mental model.`
        : `Self-reported in active profile stack. Awaiting conceptual verification.`,
      roadmapPhase: category === "Languages" ? "Phase 1: Foundations & Version Control" : category === "Frameworks" ? "Phase 3: Flagship Projects" : "Phase 2: Core Engineering",
      roadmapTask: category === "Languages" ? "Language syntax & memory model" : "Fullstack architecture & APIs",
      relatedCompanies: companies.length > 0 ? companies : state.targetCompanies.slice(0, 2),
      hasVerificationQuiz: true,
      actionText: verified ? "View in Roadmap" : "Verify Skill",
      actionHref: verified ? "/roadmap" : "#verify",
    };
  };

  const enrichedLanguages = (skills.languages || []).map((s) => enrichItem(s, "Languages"));
  const enrichedFrameworks = (skills.frameworks || []).map((s) => enrichItem(s, "Frameworks"));
  const enrichedDatabases = (skills.databases || []).map((s) => enrichItem(s, "Databases"));
  const enrichedAiTools = (skills.aiTools || []).map((s) => enrichItem(s, "AI & Tools"));

  const allClaimedSkills = [
    ...enrichedLanguages,
    ...enrichedFrameworks,
    ...enrichedDatabases,
    ...enrichedAiTools,
  ];

  const totalClaimedCount = allClaimedSkills.length;
  const totalVerifiedCount = allClaimedSkills.filter((s) => s.isVerified).length;
  const needsReviewCount = allClaimedSkills.filter((s) => s.needsReview).length;

  // Target Role Skill Requirements
  const targetRoleRequirements: TargetRoleSkillRequirement[] = matchedRole.topSkills.map((reqSkill, idx) => {
    const existing = allClaimedSkills.find(
      (s) => s.name.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.name.toLowerCase())
    );

    return {
      name: reqSkill,
      type: idx < 3 ? "Core Required" : "Supporting",
      status: existing ? existing.status : "missing",
      priority: idx < 2 ? "High" : idx < 4 ? "Medium" : "Standard",
      reason: `Tested during technical evaluations and screening rounds for ${matchedRole.name}.`,
    };
  });

  // Gap Matrix
  const skillGapMatrix: SkillGapMatrixRow[] = [];

  // Add role required skills to matrix
  matchedRole.topSkills.forEach((reqSkill, idx) => {
    const match = allClaimedSkills.find((s) => s.name.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.name.toLowerCase()));

    if (match) {
      skillGapMatrix.push({
        skillName: reqSkill,
        yourState: match.status,
        yourStateLabel: match.statusLabel,
        roleNeed: idx < 3 ? "Required" : "Supporting",
        priority: match.status === "verified" ? "Low" : "Medium",
        actionText: match.status === "verified" ? "View Roadmap" : "Verify Concept",
        actionHref: match.status === "verified" ? "/roadmap" : "#verify",
      });
    } else {
      skillGapMatrix.push({
        skillName: reqSkill,
        yourState: "missing",
        yourStateLabel: "Missing",
        roleNeed: idx < 3 ? "Required" : "Supporting",
        priority: "High",
        actionText: "Add to Plan",
        actionHref: "/roadmap",
      });
    }
  });

  // Ensure DSA entry is in gap matrix
  const dsaLevel = state.experience.dsaLevel || "never";
  const dsaState: SkillStatusType = dsaLevel === "competitive" || dsaLevel === "strong" ? "verified" : dsaLevel === "medium" ? "self_reported" : "missing";
  const dsaLabel = dsaLevel === "competitive" || dsaLevel === "strong" ? "Strong" : dsaLevel === "medium" ? "Developing" : "Missing / Beginner";

  if (!skillGapMatrix.some((m) => m.skillName.toLowerCase().includes("dsa") || m.skillName.toLowerCase().includes("algorithm"))) {
    skillGapMatrix.unshift({
      skillName: "Data Structures & Algorithms (DSA)",
      yourState: dsaState,
      yourStateLabel: dsaLabel,
      roleNeed: "Required",
      priority: dsaState === "verified" ? "Low" : "High",
      actionText: "Practice Problems",
      actionHref: "/problems",
    });
  }

  // Priority Gaps
  const priorityGaps: PrioritySkillGap[] = [];
  const missingFromMatrix = skillGapMatrix.filter((m) => m.yourState === "missing" || m.priority === "High");

  missingFromMatrix.slice(0, 3).forEach((m) => {
    // DSA and algorithm gaps route to Problem Lab; other gaps route to Roadmap
    const isDsaRelated = m.skillName.toLowerCase().includes("dsa") ||
      m.skillName.toLowerCase().includes("algorithm") ||
      m.skillName.toLowerCase().includes("data structure");

    priorityGaps.push({
      name: m.skillName,
      priority: "High",
      why: `Critical requirement for ${matchedRole.name} technical screening.`,
      recommendedAction: isDsaRelated
        ? "Practice targeted coding problems in the Problem Lab to close this gap."
        : "Advance through foundational problem sets and verify core concepts in the roadmap.",
      actionHref: isDsaRelated ? "/problems" : "/roadmap",
      actionButtonText: isDsaRelated ? "Open Problem Lab" : "Open Roadmap",
    });
  });

  if (priorityGaps.length === 0) {
    priorityGaps.push({
      name: "Advanced System Design",
      priority: "Medium",
      why: "Evaluated in technical architecture interviews at Tier-1 companies.",
      recommendedAction: "Review microservices patterns and database sharding principles.",
      actionHref: "/roadmap",
      actionButtonText: "Explore Architecture",
    });
  }

  const priorityGapsCount = priorityGaps.length;

  // Strongest area & Next recommended
  const strongestArea = enrichedLanguages.find((l) => l.isVerified)?.name || enrichedLanguages[0]?.name || "Core Programming";
  const largestGap = priorityGaps[0]?.name || "System Design";
  const nextRecommendedSkill = priorityGaps[0]?.name || "TypeScript";

  // Mentor guidance
  const mentorId = state.selectedMentor || "athena";
  let companionMessage = `Your strongest evident area is ${strongestArea}. Focus your active preparation on closing ${largestGap}.`;
  let companionFocusPillar = "Targeted Gap Closure";

  if (mentorId === "byte") {
    companionMessage = `Verification separates claims from real ability. Verify your ${strongestArea} concepts and ship clean tests.`;
    companionFocusPillar = "Verification & Testing";
  } else if (mentorId === "raven") {
    companionMessage = `Zero excuses on hiring gaps. Close ${largestGap} systematically before sitting for campus assessments.`;
    companionFocusPillar = "Hiring Bar Alignment";
  } else if (mentorId === "nova") {
    companionMessage = `You have strong skills! Now turn ${strongestArea} into public proof of work by building live fullstack apps.`;
    companionFocusPillar = "Proof of Work";
  }

  return {
    targetRole: state.targetRole || "Software Engineer",
    targetCompanies: state.targetCompanies || [],
    totalClaimedCount,
    totalVerifiedCount,
    needsReviewCount,
    priorityGapsCount,
    inventory: {
      languages: enrichedLanguages,
      frameworks: enrichedFrameworks,
      databases: enrichedDatabases,
      aiAndTools: enrichedAiTools,
    },
    targetRoleRequirements,
    skillGapMatrix,
    priorityGaps,
    strongestArea,
    largestGap,
    nextRecommendedSkill,
    companionMessage,
    companionFocusPillar,
  };
}
