import {
  OnboardingState,
  SkillsSelection,
  ExperienceSelection,
  EducationDetails,
  ConnectedAccounts,
  RoleDetails,
  UserActivity,
} from "@/types";
import { ROLE_CATALOG } from "@/constants/roles";
import { VERIFIED_COMPANIES, VerifiedCompany } from "@/constants/companies-data";
import { calculateDeterministicCompanyScore } from "@/lib/company-matcher";
import { computeAcademicMetrics } from "@/lib/academic-intelligence";
import { MENTOR_PERSONAS } from "@/constants";

export interface ReadinessCategoryBreakdown {
  name: string;
  score: number; // 0-100
  weight: string;
  status: "strong" | "adequate" | "needs_focus";
}

export interface DashboardReadiness {
  currentScore: number;
  targetScore: number;
  gap: number;
  statusLabel: string;
  summaryText: string;
  breakdowns: ReadinessCategoryBreakdown[];
}

export interface DailyMissionTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DashboardDailyMission {
  title: string;
  category: string;
  estimatedMinutes: number;
  xpReward: number;
  tasks: DailyMissionTask[];
  mentorTip: string;
}

export interface SkillGapItem {
  name: string;
  category: "Language" | "Framework" | "Database" | "Core CS / Tool";
  currentLevel: string;
  requiredLevel: string;
  gapIntensity: "Low" | "Medium" | "High";
  priority: number;
  actionText: string;
}

export interface DashboardCompanyCard {
  company: VerifiedCompany;
  preparedPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  whyReason: string;
  hiringStatus: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  status: "completed" | "current" | "upcoming";
  progressPercent: number;
  estimatedDuration: string;
  keyObjectives: string[];
  milestoneProject: string;
  whyThisMatters: string;
}

export interface CareerInsight {
  id: string;
  type: "synergy" | "gap" | "timeline" | "market";
  title: string;
  description: string;
  tag: string;
}

export interface NextBestAction {
  title: string;
  reason: string;
  estimatedMinutes: number;
  impactScore: string;
  buttonText: string;
  href: string;
}

export interface DashboardData {
  userProfile: {
    name: string;
    email: string;
    avatarUrl?: string;
    greeting: string;
  };
  onboardingState: OnboardingState;
  readiness: DashboardReadiness;
  dailyMission: DashboardDailyMission;
  mentorPersona: (typeof MENTOR_PERSONAS)[0];
  mentorAdvice: {
    quote: string;
    focusArea: string;
  };
  roadmap: {
    phases: RoadmapPhase[];
    currentPhaseIndex: number;
  };
  skillGaps: {
    targetRoleName: string;
    strongSkills: string[];
    missingSkills: SkillGapItem[];
  };
  companyReadiness: DashboardCompanyCard[];
  verifiedSkillsSummary: {
    totalSelected: number;
    totalVerified: number;
    verifiedPercent: number;
    verifiedList: { name: string; isCorrect: boolean }[];
    unverifiedList: string[];
  };
  careerInsights: CareerInsight[];
  nextBestAction: NextBestAction;
}

/**
 * Normalizes raw Supabase profiles data or provides intelligent fallbacks
 * so the dashboard never crashes even on partial onboarding profiles.
 */
export function normalizeDashboardState(
  rawProfile: Record<string, unknown> | null
): OnboardingState {
  const fallbackEducation: EducationDetails = {
    degree: "B.E / B.Tech",
    department: "Computer Science",
    college: "Engineering Institute",
    graduationYear: "2027",
  };

  const fallbackSkills: SkillsSelection = {
    languages: ["Java", "Python", "JavaScript"],
    frameworks: ["React", "Node.js"],
    databases: ["MySQL"],
    aiTools: ["ChatGPT", "GitHub Copilot"],
    verification: {
      java: { status: "verified_basic", selectedAnswer: "new", isCorrect: true, verifiedAt: new Date().toISOString() },
      python: { status: "verified_basic", selectedAnswer: "#", isCorrect: true, verifiedAt: new Date().toISOString() },
    },
  };

  const fallbackExperience: ExperienceSelection = {
    gitUsage: "comfortable",
    projectCount: "3-5",
    dsaLevel: "medium",
    deploymentExperience: "tried",
    apiExperience: "consumed",
    databaseExperience: "queries_joins",
    teamExperience: "college_team",
  };

  const fallbackConnected: ConnectedAccounts = {
    github: "",
    githubVerified: false,
    linkedin: "",
    leetcode: "",
  };

  if (!rawProfile) {
    return {
      step: 9,
      selectedMentor: "athena",
      targetRole: "Software Engineer",
      targetCompanies: ["Google", "Microsoft", "Amazon"],
      education: fallbackEducation,
      skills: fallbackSkills,
      experience: fallbackExperience,
      connectedAccounts: fallbackConnected,
      readinessSummary: null,
      userActivity: {
        completedMissionIds: [],
        completedTaskIds: [],
        dsaSolvedCount: 0,
        weeklyMissionsCompleted: 0,
      },
    };
  }

  const rawEdu = (rawProfile.education as Partial<EducationDetails>) || {};
  const rawSkills = (rawProfile.skills as Partial<SkillsSelection>) || {};
  const rawExp = (rawProfile.experience as Partial<ExperienceSelection>) || {};
  const rawConn = (rawProfile.connected_accounts as Partial<ConnectedAccounts>) || {};
  const rawActivity = (rawProfile.user_activity as Partial<UserActivity>) || {};

  return {
    step: 9,
    selectedMentor: (rawProfile.selected_mentor as string) || "athena",
    targetRole: (rawProfile.target_role as string) || "Software Engineer",
    targetCompanies: Array.isArray(rawProfile.target_companies) && rawProfile.target_companies.length > 0
      ? (rawProfile.target_companies as string[])
      : ["Google", "Microsoft", "Amazon"],
    education: {
      degree: rawEdu.degree || fallbackEducation.degree,
      department: rawEdu.department || fallbackEducation.department,
      college: rawEdu.college || fallbackEducation.college,
      graduationYear: rawEdu.graduationYear || fallbackEducation.graduationYear,
    },
    skills: {
      languages: Array.isArray(rawSkills.languages) && rawSkills.languages.length > 0 ? rawSkills.languages : fallbackSkills.languages,
      frameworks: Array.isArray(rawSkills.frameworks) ? rawSkills.frameworks : fallbackSkills.frameworks,
      databases: Array.isArray(rawSkills.databases) ? rawSkills.databases : fallbackSkills.databases,
      aiTools: Array.isArray(rawSkills.aiTools) ? rawSkills.aiTools : fallbackSkills.aiTools,
      verification: rawSkills.verification || fallbackSkills.verification,
    },
    experience: {
      gitUsage: rawExp.gitUsage || fallbackExperience.gitUsage,
      projectCount: rawExp.projectCount || fallbackExperience.projectCount,
      dsaLevel: rawExp.dsaLevel || fallbackExperience.dsaLevel,
      deploymentExperience: rawExp.deploymentExperience || fallbackExperience.deploymentExperience,
      apiExperience: rawExp.apiExperience || fallbackExperience.apiExperience,
      databaseExperience: rawExp.databaseExperience || fallbackExperience.databaseExperience,
      teamExperience: rawExp.teamExperience || fallbackExperience.teamExperience,
      representativeProject: rawExp.representativeProject,
    },
    connectedAccounts: {
      github: rawConn.github || "",
      githubVerified: Boolean(rawConn.githubVerified),
      linkedin: rawConn.linkedin || "",
      leetcode: rawConn.leetcode || "",
      codeforces: rawConn.codeforces || "",
      hackerrank: rawConn.hackerrank || "",
      codechef: rawConn.codechef || "",
      geeksforgeeks: rawConn.geeksforgeeks || "",
      resumeFileName: rawConn.resumeFileName || "",
    },
    readinessSummary: null,
    userActivity: {
      completedMissionIds: Array.isArray(rawActivity.completedMissionIds) ? rawActivity.completedMissionIds : [],
      completedTaskIds: Array.isArray(rawActivity.completedTaskIds) ? rawActivity.completedTaskIds : [],
      dsaSolvedCount: typeof rawActivity.dsaSolvedCount === "number" ? rawActivity.dsaSolvedCount : 0,
      weeklyMissionsCompleted: typeof rawActivity.weeklyMissionsCompleted === "number" ? rawActivity.weeklyMissionsCompleted : 0,
      lastActiveIso: rawActivity.lastActiveIso || new Date().toISOString(),
    },
  };
}

/**
 * Computes deterministic Dashboard Readiness index and 6-factor breakdown.
 */
export function computeDashboardReadiness(state: OnboardingState): DashboardReadiness {
  const metrics = computeAcademicMetrics(state.education);

  // 1. Academic score (0-100)
  let academicScore = 60;
  if (state.education.degree && state.education.department) academicScore += 15;
  if (metrics.currentSemester >= 5) academicScore += 15;
  academicScore = Math.min(95, academicScore);

  // 2. Skills score (0-100)
  const allSkillsCount =
    state.skills.languages.length +
    state.skills.frameworks.length +
    state.skills.databases.length;
  let skillsScore = Math.min(95, 40 + allSkillsCount * 7);

  // Verification factor
  const verifications = state.skills.verification ? Object.values(state.skills.verification) : [];
  const correctCount = verifications.filter((v) => v.isCorrect).length;
  if (correctCount > 0) {
    skillsScore = Math.min(96, skillsScore + Math.min(correctCount * 3, 12));
  }

  // 3. Practical Experience (0-100)
  let expScore = 50;
  if (state.experience.gitUsage === "daily") expScore += 18;
  else if (state.experience.gitUsage === "comfortable") expScore += 12;
  else if (state.experience.gitUsage === "beginner") expScore += 6;

  if (state.experience.deploymentExperience === "regularly") expScore += 16;
  else if (state.experience.deploymentExperience === "once_or_twice") expScore += 12;
  else if (state.experience.deploymentExperience === "tried") expScore += 6;

  if (state.experience.apiExperience === "built_and_deployed") expScore += 14;
  else if (state.experience.apiExperience === "built_rest") expScore += 10;
  else if (state.experience.apiExperience === "consumed") expScore += 5;

  expScore = Math.min(96, expScore);

  // 4. DSA Problem Solving (0-100)
  let dsaScore = 30;
  if (state.experience.dsaLevel === "competitive") dsaScore = 95;
  else if (state.experience.dsaLevel === "strong") dsaScore = 84;
  else if (state.experience.dsaLevel === "medium") dsaScore = 68;
  else if (state.experience.dsaLevel === "learning") dsaScore = 48;
  else dsaScore = 28;

  // 5. Project Depth (0-100)
  let projectScore = 35;
  if (state.experience.projectCount === "10+") projectScore = 96;
  else if (state.experience.projectCount === "6-10") projectScore = 86;
  else if (state.experience.projectCount === "3-5") projectScore = 72;
  else if (state.experience.projectCount === "1-2") projectScore = 50;
  else projectScore = 25;

  // 6. Company Fit (0-100)
  let companyFitSum = 0;
  let companyFitCount = 0;
  for (const companyName of state.targetCompanies) {
    const matchedCompany = VERIFIED_COMPANIES.find(
      (c) => c.name.toLowerCase() === companyName.toLowerCase() || c.id === companyName.toLowerCase()
    );
    if (matchedCompany) {
      const match = calculateDeterministicCompanyScore(matchedCompany, state.targetRole, state.skills);
      companyFitSum += match.score;
      companyFitCount++;
    }
  }
  const companyFitScore = companyFitCount > 0 ? Math.round(companyFitSum / companyFitCount) : 74;

  // Overall Weighted Score
  const overall = Math.round(
    academicScore * 0.12 +
      skillsScore * 0.2 +
      expScore * 0.18 +
      dsaScore * 0.22 +
      projectScore * 0.16 +
      companyFitScore * 0.12
  );

  const currentScore = Math.min(95, Math.max(42, overall));
  const targetScore = 90;
  const gap = Math.max(0, targetScore - currentScore);

  let statusLabel = "Developing Candidate";
  if (currentScore >= 85) statusLabel = "Placement Ready";
  else if (currentScore >= 75) statusLabel = "Competitive Applicant";
  else if (currentScore >= 60) statusLabel = "Solid Momentum";

  let summaryText =
    "You're making good progress. Your biggest opportunity right now is strengthening your practical experience and algorithmic problem solving.";
  if (dsaScore < 60) {
    summaryText =
      "Your primary bottleneck is DSA consistency. Closing this gap will immediately lift your eligibility for Tier-1 online assessments.";
  } else if (projectScore < 60) {
    summaryText =
      "Your algorithmic foundation is decent, but your portfolio lacks live deployed projects. Shipping 1 flagship application is your highest leverage move.";
  }

  const getStatus = (val: number): ReadinessCategoryBreakdown["status"] =>
    val >= 78 ? "strong" : val >= 55 ? "adequate" : "needs_focus";

  const breakdowns: ReadinessCategoryBreakdown[] = [
    { name: "Academic Foundation", score: academicScore, weight: "12%", status: getStatus(academicScore) },
    { name: "Tech Stack & Tools", score: skillsScore, weight: "20%", status: getStatus(skillsScore) },
    { name: "Practical Building", score: expScore, weight: "18%", status: getStatus(expScore) },
    { name: "DSA & Problem Solving", score: dsaScore, weight: "22%", status: getStatus(dsaScore) },
    { name: "Project Portfolio", score: projectScore, weight: "16%", status: getStatus(projectScore) },
    { name: "Company Calibration", score: companyFitScore, weight: "12%", status: getStatus(companyFitScore) },
  ];

  return {
    currentScore,
    targetScore,
    gap,
    statusLabel,
    summaryText,
    breakdowns,
  };
}

/**
 * Deterministically generates today's actionable mission based on student data.
 */
export function generateDailyMission(state: OnboardingState): DashboardDailyMission {
  const isDsaBottleneck = state.experience.dsaLevel === "never" || state.experience.dsaLevel === "learning" || state.experience.dsaLevel === "medium";
  const roleName = state.targetRole.toLowerCase();

  if (isDsaBottleneck) {
    return {
      title: "Master Binary Tree Inversions & BFS",
      category: "Algorithms & Problem Solving",
      estimatedMinutes: 60,
      xpReward: 120,
      tasks: [
        { id: "m1", title: "Solve 3 Binary Tree traversal problems on LeetCode", completed: false },
        { id: "m2", title: "Compare recursion stack complexity vs queue-based BFS", completed: false },
        { id: "m3", title: "Implement Level Order Traversal from memory without looking at hints", completed: false },
      ],
      mentorTip: "Tier-1 interviewers test tree traversals to check if your recursion mental model is rock solid.",
    };
  }

  if (roleName.includes("backend") || roleName.includes("software")) {
    return {
      title: "Harden REST API Endpoints with Input Validation",
      category: "Practical Backend Engineering",
      estimatedMinutes: 45,
      xpReward: 100,
      tasks: [
        { id: "m1", title: "Implement schema validation (Zod / Joi / Pydantic) on 2 mutation routes", completed: false },
        { id: "m2", title: "Add standardized HTTP 400 & 422 error payload responses", completed: false },
        { id: "m3", title: "Write 2 integration tests asserting rejection of malformed payloads", completed: false },
      ],
      mentorTip: "Production code fails gracefully. Input boundary guards separate junior builders from mid-level hires.",
    };
  }

  return {
    title: "Ship Responsive UI State & Web Vitals Optimization",
    category: "Modern Frontend Architecture",
    estimatedMinutes: 50,
    xpReward: 110,
    tasks: [
      { id: "m1", title: "Profile Largest Contentful Paint (LCP) and eliminate layout shift on hero banner", completed: false },
      { id: "m2", title: "Implement debounced query state for search input to prevent unnecessary re-renders", completed: false },
      { id: "m3", title: "Audit accessibility tags (aria-labels & keyboard tab-indexes) across interactive elements", completed: false },
    ],
    mentorTip: "Speed is a feature. Demonstrating sub-second interaction metrics impresses frontend leads instantly.",
  };
}

/**
 * Computes skill gaps against the selected target role.
 */
export function computeSkillGaps(state: OnboardingState): DashboardData["skillGaps"] {
  const candidateSkills = [
    ...(state.skills.languages || []),
    ...(state.skills.frameworks || []),
    ...(state.skills.databases || []),
    ...(state.skills.aiTools || []),
  ];

  const matchedRole: RoleDetails | undefined = ROLE_CATALOG.find(
    (r) => r.name.toLowerCase() === state.targetRole.toLowerCase() || r.id === state.targetRole.toLowerCase()
  ) || ROLE_CATALOG[0];

  const strongSkills: string[] = [];
  const missingSkills: SkillGapItem[] = [];

  // Check role top skills
  matchedRole.topSkills.forEach((skillName, idx) => {
    const isPresent = candidateSkills.some(
      (cs) => cs.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(cs.toLowerCase())
    );

    if (isPresent) {
      strongSkills.push(skillName);
    } else {
      missingSkills.push({
        name: skillName,
        category: idx === 0 ? "Language" : idx === 1 ? "Core CS / Tool" : "Framework",
        currentLevel: "Not Yet Evident",
        requiredLevel: idx < 2 ? "Proficient" : "Working Knowledge",
        gapIntensity: idx === 0 || idx === 1 ? "High" : "Medium",
        priority: idx + 1,
        actionText: `Add ${skillName} to active study plan`,
      });
    }
  });

  // Ensure DSA gap is prioritized if user is below strong
  if (state.experience.dsaLevel !== "strong" && state.experience.dsaLevel !== "competitive") {
    if (!missingSkills.some((s) => s.name.toLowerCase().includes("dsa"))) {
      missingSkills.unshift({
        name: "Advanced DSA (Trees, DP, Graphs)",
        category: "Core CS / Tool",
        currentLevel: state.experience.dsaLevel === "medium" ? "Easy + some Medium" : "Beginner",
        requiredLevel: "Strong / 200+ Solved",
        gapIntensity: "High",
        priority: 1,
        actionText: "Practice 5 Medium LeetCode problems",
      });
    }
  }

  // System Design check for Software Engineer or Backend
  if (state.targetRole.toLowerCase().includes("software") || state.targetRole.toLowerCase().includes("backend")) {
    if (!missingSkills.some((s) => s.name.toLowerCase().includes("system design"))) {
      missingSkills.push({
        name: "System Design & Scalability",
        category: "Core CS / Tool",
        currentLevel: "Foundations",
        requiredLevel: "High-Level Architecture & Trade-offs",
        gapIntensity: "Medium",
        priority: 3,
        actionText: "Study microservice caching & sharding",
      });
    }
  }

  return {
    targetRoleName: matchedRole.name,
    strongSkills,
    missingSkills: missingSkills.slice(0, 4),
  };
}

/**
 * Computes preparation readiness for each target company using verified dataset.
 */
export function computeCompanyReadinessCards(state: OnboardingState): DashboardCompanyCard[] {
  const list: DashboardCompanyCard[] = [];

  for (const compName of state.targetCompanies) {
    const verified = VERIFIED_COMPANIES.find(
      (c) => c.name.toLowerCase() === compName.toLowerCase() || c.id === compName.toLowerCase()
    );

    if (verified) {
      const match = calculateDeterministicCompanyScore(verified, state.targetRole, state.skills);
      list.push({
        company: verified,
        preparedPercent: match.score,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        whyReason: match.whyPoints[0] || `${verified.name} actively recruits for ${state.targetRole}.`,
        hiringStatus: verified.hiringDifficulty >= 4 ? "High Bar • Multi-round Coding" : "Moderate Bar • Technical + Practical",
      });
    }
  }

  // Fallback if none matched
  if (list.length === 0) {
    const top3 = VERIFIED_COMPANIES.slice(0, 3);
    return top3.map((comp) => {
      const match = calculateDeterministicCompanyScore(comp, state.targetRole, state.skills);
      return {
        company: comp,
        preparedPercent: match.score,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        whyReason: `${comp.name} is a high-volume hirer for software engineering graduates.`,
        hiringStatus: "Multi-round Technical Evaluation",
      };
    });
  }

  return list;
}

/**
 * Derives personalized 6-phase career roadmap.
 */
export function computeRoadmapPhases(state: OnboardingState): { phases: RoadmapPhase[]; currentPhaseIndex: number } {
  const dsaLevel = state.experience.dsaLevel;
  const projectCount = state.experience.projectCount;

  // Determine current phase based on actual capabilities
  let currentPhaseIndex = 1; // Default: DSA Foundation
  if (dsaLevel === "never") currentPhaseIndex = 0;
  else if (dsaLevel === "strong" || dsaLevel === "competitive") {
    currentPhaseIndex = projectCount === "none" || projectCount === "1-2" ? 2 : 3;
  }

  const phases: RoadmapPhase[] = [
    {
      id: "phase-1",
      phaseNumber: 1,
      title: "Foundations & Version Control",
      subtitle: "Syntax Mastery & Git Branching",
      status: currentPhaseIndex > 0 ? "completed" : "current",
      progressPercent: currentPhaseIndex > 0 ? 100 : 70,
      estimatedDuration: "3–4 Weeks",
      keyObjectives: [
        "Master clean syntax in primary language (Java, C++, or Python)",
        "Daily Git workflows: feature branches, PR merges, resolving conflicts",
        "Understand time and space asymptotic notation (Big-O analysis)",
      ],
      milestoneProject: "CLI utility or foundational algorithms package with Git commits",
      whyThisMatters: "Without fluent command-line and version control hygiene, teamwork in engineering teams halts.",
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      title: "Data Structures & Core Algorithms",
      subtitle: "Trees, Graphs, Recursion & DP",
      status: currentPhaseIndex > 1 ? "completed" : currentPhaseIndex === 1 ? "current" : "upcoming",
      progressPercent: currentPhaseIndex > 1 ? 100 : currentPhaseIndex === 1 ? 45 : 0,
      estimatedDuration: "8–10 Weeks",
      keyObjectives: [
        "Master Arrays, Strings, HashMaps, Two-pointer & Sliding Window patterns",
        "Conquer Trees, BFS, DFS, Heaps, and Backtracking",
        "Solve 150+ curated standard LeetCode problems consistently",
      ],
      milestoneProject: "Algorithm benchmarking suite comparing traversal performance",
      whyThisMatters: "85% of Tier-1 tech company screening rounds strictly filter candidates using algorithmic tests.",
    },
    {
      id: "phase-3",
      phaseNumber: 3,
      title: "Fullstack Flagship Projects",
      subtitle: "Production Deployment & High-Throughput APIs",
      status: currentPhaseIndex > 2 ? "completed" : currentPhaseIndex === 2 ? "current" : "upcoming",
      progressPercent: currentPhaseIndex > 2 ? 100 : currentPhaseIndex === 2 ? 35 : 0,
      estimatedDuration: "6–8 Weeks",
      keyObjectives: [
        "Build 1 comprehensive fullstack application with auth, DB & background jobs",
        "Host live on Vercel, Render, or AWS with automated CI/CD pipeline",
        "Document API contracts, database ER diagrams, and system architecture in README",
      ],
      milestoneProject: "Live, production-hosted SaaS application with active test users",
      whyThisMatters: "Proof of work separates resume buzzwords from demonstrable software engineering capability.",
    },
    {
      id: "phase-4",
      phaseNumber: 4,
      title: "Resume & ATS Optimization",
      subtitle: "XYZ Impact Metrics & Portfolio Polish",
      status: currentPhaseIndex > 3 ? "completed" : currentPhaseIndex === 3 ? "current" : "upcoming",
      progressPercent: currentPhaseIndex > 3 ? 100 : currentPhaseIndex === 3 ? 20 : 0,
      estimatedDuration: "2–3 Weeks",
      keyObjectives: [
        "Quantify project bullets using Google XYZ format (Accomplished X by Y through Z)",
        "Pass ATS parsing benchmarks with 90%+ keyword match for target role",
        "Polished LinkedIn profile and clean GitHub pinned repositories",
      ],
      milestoneProject: "ATS-optimized single-page engineering resume with verifiable links",
      whyThisMatters: "Recruiters scan resumes for an average of 6 seconds before deciding whether to advance.",
    },
    {
      id: "phase-5",
      phaseNumber: 5,
      title: "Mock Interviews & System Design",
      subtitle: "Live Coding & Architectural Trade-offs",
      status: currentPhaseIndex > 4 ? "completed" : currentPhaseIndex === 4 ? "current" : "upcoming",
      progressPercent: currentPhaseIndex > 4 ? 100 : currentPhaseIndex === 4 ? 10 : 0,
      estimatedDuration: "4–6 Weeks",
      keyObjectives: [
        "Conduct 10+ timed live mock coding rounds with technical peers or mentors",
        "Learn High-Level Design (HLD) basics: Caching, Load Balancing, SQL vs NoSQL",
        "Master STAR behavioral storytelling for culture-fit rounds",
      ],
      milestoneProject: "Recorded 45-minute mock interview showing structured communication",
      whyThisMatters: "Solving code silently fails interviews; articulating trade-offs aloud wins offers.",
    },
    {
      id: "phase-6",
      phaseNumber: 6,
      title: "Placement Season & Off-Campus Blitz",
      subtitle: "Referrals, OA Execution & Offer Negotiation",
      status: currentPhaseIndex > 5 ? "completed" : currentPhaseIndex === 5 ? "current" : "upcoming",
      progressPercent: currentPhaseIndex > 5 ? 100 : 0,
      estimatedDuration: "Ongoing",
      keyObjectives: [
        "Targeted outreach for alumni referrals across your dream companies",
        "Execute Online Assessments (OAs) within 48 hours of invitation",
        "Compare offers, analyze compensation bands, and negotiate terms",
      ],
      milestoneProject: "Securing full-time engineering or high-growth internship offer",
      whyThisMatters: "Systematic referral pipeline execution yields 5x higher interview conversion than blind job boards.",
    },
  ];

  return { phases, currentPhaseIndex };
}

/**
 * Derives high-confidence, deterministic career insights.
 */
export function computeCareerInsights(state: OnboardingState): CareerInsight[] {
  const role = state.targetRole;
  const langs = state.skills.languages.join(" + ");
  const metrics = computeAcademicMetrics(state.education);

  return [
    {
      id: "ins-1",
      type: "synergy",
      title: "Tech Stack Market Alignment",
      description: `Your ${langs || "selected languages"} foundation directly aligns with ${role} requirements across 80%+ of campus recruitment drives.`,
      tag: "Strong Synergy",
    },
    {
      id: "ins-2",
      type: "gap",
      title: "Highest Leverage Growth Vector",
      description: state.experience.projectCount === "none" || state.experience.projectCount === "1-2"
        ? "Building and deploying 1 live fullstack project will eliminate your largest recruiter objection."
        : "Your project count is solid. Channel 70% of weekly preparation into algorithmic problem-solving to crack initial OAs.",
      tag: "Actionable Gap",
    },
    {
      id: "ins-3",
      type: "timeline",
      title: `Graduation Runway (${metrics.monthsRemaining} Months)`,
      description: `With graduation scheduled for ${metrics.graduationYear}, campus recruitment begins in ${metrics.placementSeasonLabel}. You have optimal time to peak.`,
      tag: "Strategic Timing",
    },
  ];
}

/**
 * Calculates the Single Next Best Action.
 */
export function computeNextBestAction(state: OnboardingState): NextBestAction {
  if (state.experience.dsaLevel === "never" || state.experience.dsaLevel === "learning") {
    return {
      title: "Complete 5 Easy-to-Medium Array & HashMap Problems",
      reason: "DSA is your primary barrier for clearing initial technical screening rounds at your target companies.",
      estimatedMinutes: 45,
      impactScore: "+8 Readiness Points",
      buttonText: "Start Algorithmic Practice",
      href: "/skills",
    };
  }

  if (state.experience.deploymentExperience === "never" || state.experience.deploymentExperience === "tried") {
    return {
      title: "Deploy One Working Project Live to Vercel or Render",
      reason: "Having a verifiable public URL in your resume dramatically increases recruiter callback ratios.",
      estimatedMinutes: 30,
      impactScore: "+6 Readiness Points",
      buttonText: "Deploy Project Guide",
      href: "/experience",
    };
  }

  return {
    title: "Master Binary Tree Traversals & Recursion Boundaries",
    reason: "Tree algorithms represent 35% of all Tier-1 coding interview questions.",
    estimatedMinutes: 60,
    impactScore: "+5 Readiness Points",
    buttonText: "Solve Tree Challenge",
    href: "/skills",
  };
}

/**
 * Companion personalized advice and dynamic reaction.
 */
export function getMentorDashboardAdvice(
  mentorId: string
): { quote: string; focusArea: string } {
  switch (mentorId) {
    case "byte":
      return {
        quote: "Don't collect more technologies yet. Get deeper with the ones you've already picked up, and write clean unit tests.",
        focusArea: "Practical Depth over Framework Hopping",
      };
    case "raven":
      return {
        quote: "Zero shortcuts. Online assessments don't care about intentions. Solve the problem in optimal time or get filtered out.",
        focusArea: "Algorithmic Precision & Edge Cases",
      };
    case "nova":
      return {
        quote: "Ship it! Recruiters value seeing live links over localhost repos. Get a working prototype into production this week.",
        focusArea: "Proof of Work & Public Shipping",
      };
    case "atlas":
      return {
        quote: "Architecture matters. Think about how your application behaves under 10,000 concurrent requests before writing code.",
        focusArea: "System Reliability & Trade-offs",
      };
    case "sage":
      return {
        quote: "Your code gets you the interview; your communication lands the offer. Practice articulating your thought process aloud.",
        focusArea: "Structured Storytelling & Consistency",
      };
    case "athena":
    default:
      return {
        quote: "Consistency overcomes complexity. Complete your daily mission today, and the compound growth will take care of the rest.",
        focusArea: "Disciplined Daily Progress",
      };
  }
}
