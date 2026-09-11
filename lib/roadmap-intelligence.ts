import {
  OnboardingState,
  SkillsSelection,
  ExperienceSelection,
} from "@/types";
import { ROLE_CATALOG } from "@/constants/roles";
import { VERIFIED_COMPANIES, VerifiedCompany } from "@/constants/companies-data";
import { calculateDeterministicCompanyScore } from "@/lib/company-matcher";
import { computeDashboardReadiness } from "@/lib/dashboard-intelligence";

export type RoadmapTaskStatus =
  | "completed"
  | "verified"
  | "in_progress"
  | "not_started"
  | "upcoming";

export interface RoadmapTask {
  id: string;
  title: string;
  shortExplanation: string;
  status: RoadmapTaskStatus;
  priority: "High" | "Medium" | "Low";
  reasonItMatters: string;
  whatWeKnow: string;
  recommendedAction: string;
  relatedSkill?: string;
  relatedCompany?: string;
  ctaText: string;
  ctaHref: string;
}

export interface InteractiveRoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  status: "completed" | "current" | "upcoming";
  priority: "Critical" | "High" | "Standard";
  estimatedDuration: string;
  whyThisMatters: string;
  milestoneProject: string;
  tasks: RoadmapTask[];
  completedCount: number;
  totalTasks: number;
}

export interface RoadmapSkillGapInsight {
  name: string;
  priority: "High" | "Medium";
  reason: string;
  currentLevel: string;
  targetLevel: string;
  href: string;
}

export interface RoadmapCompanyConnection {
  company: VerifiedCompany;
  preparedPercent: number;
  relevantPrepAreas: string[];
  missingGaps: string[];
  href: string;
}

export interface ComprehensiveRoadmapData {
  targetRole: string;
  targetCompanies: string[];
  readinessScore: number;
  currentPhase: InteractiveRoadmapPhase;
  currentPhaseIndex: number;
  currentPhaseExplanation: {
    whyCurrent: string;
    whatIsBlocking: string;
    nextAction: string;
  };
  phases: InteractiveRoadmapPhase[];
  nextBestAction: {
    title: string;
    reason: string;
    estimatedMinutes: number;
    impactScore: string;
    buttonText: string;
    href: string;
  };
  prioritySkillGaps: RoadmapSkillGapInsight[];
  companyConnections: RoadmapCompanyConnection[];
  companionCoaching: {
    name: string;
    message: string;
    focusPillar: string;
  };
}

/**
 * Derives the task status based on real evidence in onboarding state without fabrication.
 */
function deriveTaskStatus(
  taskType: "git" | "language" | "dsa" | "framework" | "database" | "project" | "resume" | "interview" | "networking",
  skillName: string | undefined,
  skills: SkillsSelection,
  experience: ExperienceSelection
): { status: RoadmapTaskStatus; evidence: string } {
  const verifiedMap = skills.verification || {};

  if (taskType === "git") {
    if (experience.gitUsage === "daily" || experience.gitUsage === "comfortable") {
      return {
        status: "completed",
        evidence: `Self-reported ${experience.gitUsage} Git branching and version control usage.`,
      };
    }
    if (experience.gitUsage === "beginner") {
      return {
        status: "in_progress",
        evidence: "Self-reported beginner level with Git repositories.",
      };
    }
    return {
      status: "not_started",
      evidence: "No Git workflow history recorded yet.",
    };
  }

  if (taskType === "language") {
    const key = (skillName || "").toLowerCase();
    const hasSkill = skills.languages.some((l) => l.toLowerCase().includes(key));
    const isVerified = Boolean(verifiedMap[key]?.isCorrect);

    if (isVerified) {
      return {
        status: "verified",
        evidence: `Concept question verified for ${skillName} in micro-assessment.`,
      };
    }
    if (hasSkill) {
      return {
        status: "completed",
        evidence: `Self-reported ${skillName} listed in primary language stack.`,
      };
    }
    return {
      status: "not_started",
      evidence: `Skill not yet present in active technical inventory.`,
    };
  }

  if (taskType === "dsa") {
    if (experience.dsaLevel === "competitive" || experience.dsaLevel === "strong") {
      return {
        status: "completed",
        evidence: `Self-reported ${experience.dsaLevel} algorithmic problem solving foundation.`,
      };
    }
    if (experience.dsaLevel === "medium") {
      return {
        status: "in_progress",
        evidence: "Self-reported intermediate standard problem solving. Medium-difficulty gaps identified.",
      };
    }
    return {
      status: "not_started",
      evidence: "Foundational data structures and algorithmic patterns not yet mastered.",
    };
  }

  if (taskType === "framework") {
    const key = (skillName || "").toLowerCase();
    const hasFramework = skills.frameworks.some((f) => f.toLowerCase().includes(key));
    const isVerified = Boolean(verifiedMap[key]?.isCorrect);

    if (isVerified) {
      return {
        status: "verified",
        evidence: `Architecture knowledge verified for ${skillName}.`,
      };
    }
    if (hasFramework) {
      return {
        status: "completed",
        evidence: `Self-reported ${skillName} in technical frameworks stack.`,
      };
    }
    return {
      status: "not_started",
      evidence: `Framework not yet declared in profile.`,
    };
  }

  if (taskType === "project") {
    if (experience.projectCount === "6-10" || experience.projectCount === "10+") {
      return {
        status: "completed",
        evidence: `Self-reported ${experience.projectCount} projects built with practical implementation.`,
      };
    }
    if (experience.projectCount === "3-5") {
      return {
        status: "in_progress",
        evidence: "Multiple projects declared. Deployment and fullstack integration can be expanded.",
      };
    }
    if (experience.projectCount === "1-2") {
      return {
        status: "in_progress",
        evidence: "Initial 1-2 projects built. Missing a flagship deployed production application.",
      };
    }
    return {
      status: "not_started",
      evidence: "No projects recorded in portfolio yet.",
    };
  }

  if (taskType === "resume") {
    return {
      status: "not_started",
      evidence: "ATS resume parsing and keyword optimization not yet synchronized.",
    };
  }

  if (taskType === "interview") {
    return {
      status: "upcoming",
      evidence: "Mock technical rounds calibrated for placement season.",
    };
  }

  return {
    status: "upcoming",
    evidence: "Campus recruitment outreach and referral pipeline scheduled for final placement phase.",
  };
}

/**
 * Builds the interactive 6-phase engineering curriculum based on real student state.
 */
export function computeInteractiveRoadmap(state: OnboardingState): ComprehensiveRoadmapData {
  const readiness = computeDashboardReadiness(state);
  const primaryLang = state.skills.languages[0] || "Python";
  const primaryFramework = state.skills.frameworks[0] || "React";

  // Derive phase 1 tasks
  const t1_git = deriveTaskStatus("git", undefined, state.skills, state.experience);
  const t1_lang = deriveTaskStatus("language", primaryLang, state.skills, state.experience);
  const t1_bigo = deriveTaskStatus("dsa", undefined, state.skills, state.experience);

  const phase1Tasks: RoadmapTask[] = [
    {
      id: "p1-t1",
      title: `Core Syntax & Idioms in ${primaryLang}`,
      shortExplanation: `Master language fundamentals, memory model, standard library, and OOP/functional paradigms in ${primaryLang}.`,
      status: t1_lang.status,
      priority: "High",
      reasonItMatters: "Language fluency is tested during live whiteboarding without autocomplete.",
      whatWeKnow: t1_lang.evidence,
      recommendedAction: "Review core syntax and complete verification test.",
      relatedSkill: primaryLang,
      ctaText: "Verify Language Foundation",
      ctaHref: "/skills",
    },
    {
      id: "p1-t2",
      title: "Git Feature Branching & PR Hygiene",
      shortExplanation: "Create feature branches, resolve merge conflicts, and practice clean commit messages.",
      status: t1_git.status,
      priority: "High",
      reasonItMatters: "Engineering teams reject candidates who cannot collaborate cleanly on version-controlled codebases.",
      whatWeKnow: t1_git.evidence,
      recommendedAction: "Initialize a repository, configure remotes, and open structured PRs.",
      relatedSkill: "Git",
      ctaText: "View Git Evidence",
      ctaHref: "/experience",
    },
    {
      id: "p1-t3",
      title: "Asymptotic Notation & Space-Time Trade-offs",
      shortExplanation: "Analyze Big-O time and auxiliary space complexity for iterative and recursive operations.",
      status: t1_bigo.status === "completed" ? "completed" : "in_progress",
      priority: "Medium",
      reasonItMatters: "Every coding interview problem requires stating asymptotic complexity before writing code.",
      whatWeKnow: t1_bigo.evidence,
      recommendedAction: "Practice calculating nested loop complexity and recursion stack depth.",
      ctaText: "Practice Problems",
      ctaHref: "/problems",
    },
  ];

  // Derive phase 2 tasks
  const t2_dsa = deriveTaskStatus("dsa", undefined, state.skills, state.experience);
  const phase2Tasks: RoadmapTask[] = [
    {
      id: "p2-t1",
      title: "Arrays, Two-Pointers & Sliding Window",
      shortExplanation: "Master contiguous sub-array techniques, two-pointer bounds, and hash map frequency caching.",
      status: t2_dsa.status === "completed" ? "completed" : "in_progress",
      priority: "High",
      reasonItMatters: "Over 40% of Tier-1 initial online assessments evaluate sliding window and hash table lookups.",
      whatWeKnow: t2_dsa.evidence,
      recommendedAction: "Solve 15 standard array and sliding window problems.",
      relatedSkill: "Data Structures",
      ctaText: "Practice Problems",
      ctaHref: "/problems",
    },
    {
      id: "p2-t2",
      title: "Binary Trees, BFS & DFS Traversals",
      shortExplanation: "Implement recursive and iterative level-order traversals, lowest common ancestors, and tree path sums.",
      status: t2_dsa.status === "completed" ? "completed" : "not_started",
      priority: "High",
      reasonItMatters: "Tree recursion directly evaluates your mental model of the call stack and pointer manipulation.",
      whatWeKnow: t2_dsa.evidence,
      recommendedAction: "Implement Breadth-First Search and Depth-First Search without external hints.",
      relatedSkill: "Binary Trees",
      ctaText: "Practice Tree Problems",
      ctaHref: "/problems",
    },
    {
      id: "p2-t3",
      title: "Dynamic Programming & Graph Algorithms",
      shortExplanation: "Recognize optimal substructure, memoization tables, Dijkstra shortest paths, and topological sort.",
      status: t2_dsa.status === "completed" ? "in_progress" : "not_started",
      priority: "High",
      reasonItMatters: "Distinguishes standard candidates from top-tier performers in hard round interviews.",
      whatWeKnow: "Evaluated during high-difficulty hiring bar rounds.",
      recommendedAction: "Solve 10 1D/2D DP problems and build graph adjacency list representations.",
      relatedSkill: "Dynamic Programming",
      ctaText: "Practice DP & Graph Problems",
      ctaHref: "/problems",
    },
  ];

  // Derive phase 3 tasks
  const t3_proj = deriveTaskStatus("project", undefined, state.skills, state.experience);
  const t3_fw = deriveTaskStatus("framework", primaryFramework, state.skills, state.experience);
  const phase3Tasks: RoadmapTask[] = [
    {
      id: "p3-t1",
      title: `Fullstack Application with ${primaryFramework}`,
      shortExplanation: `Develop an end-to-end product with authenticated user flows, relational database schema, and REST API.`,
      status: t3_proj.status,
      priority: "High",
      reasonItMatters: "Recruiters evaluate architectural decision-making and practical engineering maturity through live apps.",
      whatWeKnow: `${t3_proj.evidence} ${t3_fw.evidence}`,
      recommendedAction: "Build and deploy a flagship application with clean commit history.",
      relatedSkill: primaryFramework,
      ctaText: "Manage Project Evidence",
      ctaHref: "/experience",
    },
    {
      id: "p3-t2",
      title: "Database Modeling & Query Performance",
      shortExplanation: "Design 3NF relational schemas, implement indexing, and optimize complex multi-table joins.",
      status: state.experience.databaseExperience === "production_modeling" || state.experience.databaseExperience === "schema_design"
        ? "completed"
        : state.experience.databaseExperience === "queries_joins"
        ? "in_progress"
        : "not_started",
      priority: "High",
      reasonItMatters: "Backend and fullstack interviews test how you prevent N+1 query bottlenecks and structure data integrity.",
      whatWeKnow: `Self-reported database experience: ${state.experience.databaseExperience || "Not declared"}.`,
      recommendedAction: "Implement database migrations and write indexed queries.",
      relatedSkill: "Databases & SQL",
      ctaText: "Review Database Profile",
      ctaHref: "/experience",
    },
    {
      id: "p3-t3",
      title: "Live Production Cloud Deployment",
      shortExplanation: "Host your application on Vercel, Render, or AWS with automated CI/CD pipeline and SSL.",
      status: state.experience.deploymentExperience === "regularly" || state.experience.deploymentExperience === "once_or_twice"
        ? "completed"
        : state.experience.deploymentExperience === "tried"
        ? "in_progress"
        : "not_started",
      priority: "Medium",
      reasonItMatters: "Public demo links increase recruiter engagement by 5x compared to localhost repositories.",
      whatWeKnow: `Deployment experience level: ${state.experience.deploymentExperience || "Never deployed"}.`,
      recommendedAction: "Deploy to a public cloud provider and verify uptime.",
      ctaText: "Open Deployment Workbench",
      ctaHref: "/experience",
    },
  ];

  // Derive phase 4 tasks
  const phase4Tasks: RoadmapTask[] = [
    {
      id: "p4-t1",
      title: "Google XYZ Impact Resume Formatting",
      shortExplanation: "Restructure project bullet points to: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
      status: "not_started",
      priority: "High",
      reasonItMatters: "Quantifiable impact differentiates engineering contributions from passive task lists.",
      whatWeKnow: "ATS resume analysis and benchmark parsing not yet connected.",
      recommendedAction: "Rephrase experience with numeric metrics (% latency reduction, request volume).",
      ctaText: "Optimize Resume",
      ctaHref: "/experience",
    },
    {
      id: "p4-t2",
      title: "ATS Role Keyword Optimization",
      shortExplanation: `Align resume terminology with automated applicant screening filters for ${state.targetRole}.`,
      status: "not_started",
      priority: "High",
      reasonItMatters: "Resumes missing core tech keywords are filtered out automatically before human review.",
      whatWeKnow: `Targeting ${state.targetRole} across selected companies.`,
      recommendedAction: "Ensure primary language and framework keywords match job descriptions.",
      ctaText: "View Role Requirements",
      ctaHref: "/skills",
    },
  ];

  // Derive phase 5 tasks
  const phase5Tasks: RoadmapTask[] = [
    {
      id: "p5-t1",
      title: "High-Level System Design & Scalability",
      shortExplanation: "Understand Caching (Redis), Load Balancing, SQL vs NoSQL, and horizontal scaling tradeoffs.",
      status: "upcoming",
      priority: "High",
      reasonItMatters: "Junior system design rounds test your awareness of real-world latency and data bottlenecks.",
      whatWeKnow: "Scheduled for senior interview preparation sprint.",
      recommendedAction: "Study rate limiting, database sharding, and CDN edge caching.",
      ctaText: "Explore System Design",
      ctaHref: "/skills",
    },
    {
      id: "p5-t2",
      title: "Timed Technical Mock Interviews",
      shortExplanation: "Conduct 45-minute timed live coding sessions articulating algorithmic tradeoffs aloud.",
      status: "upcoming",
      priority: "Medium",
      reasonItMatters: "Articulating your thought process under timed pressure is the primary determinant of hiring recommendations.",
      whatWeKnow: "Scheduled prior to campus placement drives.",
      recommendedAction: "Practice verbalizing boundary condition checks while typing solutions.",
      ctaText: "View Insights",
      ctaHref: "/insights",
    },
  ];

  // Derive phase 6 tasks
  const phase6Tasks: RoadmapTask[] = [
    {
      id: "p6-t1",
      title: "Targeted Alumni Referral Outreach",
      shortExplanation: `Reach out to engineering alumni at ${state.targetCompanies.slice(0, 2).join(" & ") || "target companies"} with tailored pitch notes.`,
      status: "upcoming",
      priority: "High",
      reasonItMatters: "Referrals convert to first-round technical interviews at 5x the rate of blind portal submissions.",
      whatWeKnow: `${state.targetCompanies.length} calibrated target companies selected.`,
      recommendedAction: "Identify alumni in your target engineering vertical.",
      ctaText: "View Target Companies",
      ctaHref: "/companies",
    },
    {
      id: "p6-t2",
      title: "Online Assessment (OA) Blitz Execution",
      shortExplanation: "Execute company-specific technical screening tests within 48 hours of invitation.",
      status: "upcoming",
      priority: "High",
      reasonItMatters: "Fast turnaround demonstrates candidate responsiveness and peak technical readiness.",
      whatWeKnow: "Scheduled during active recruitment window.",
      recommendedAction: "Maintain daily problem-solving consistency.",
      ctaText: "Check Company Status",
      ctaHref: "/companies",
    },
  ];

  // Calculate current phase index deterministically based on real capabilities
  let currentPhaseIndex = 1; // Default to Phase 2: DSA
  if (state.experience.gitUsage === "never" || state.skills.languages.length === 0) {
    currentPhaseIndex = 0;
  } else if (state.experience.dsaLevel === "strong" || state.experience.dsaLevel === "competitive") {
    currentPhaseIndex = state.experience.projectCount === "none" || state.experience.projectCount === "1-2" ? 2 : 3;
  }

  const rawPhases: {
    id: string;
    phaseNumber: number;
    title: string;
    subtitle: string;
    priority: "Critical" | "High" | "Standard";
    estimatedDuration: string;
    whyThisMatters: string;
    milestoneProject: string;
    tasks: RoadmapTask[];
  }[] = [
    {
      id: "phase-1",
      phaseNumber: 1,
      title: "Foundations & Version Control",
      subtitle: "Syntax Mastery, Git Branching & Big-O",
      priority: "High",
      estimatedDuration: "3–4 Weeks",
      whyThisMatters: "Without fluent command-line and version control hygiene, teamwork in engineering teams halts.",
      milestoneProject: "CLI utility or foundational algorithms package with Git commits",
      tasks: phase1Tasks,
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      title: "Data Structures & Core Algorithms",
      subtitle: "Trees, Graphs, Recursion & DP",
      priority: "Critical",
      estimatedDuration: "8–10 Weeks",
      whyThisMatters: "85% of Tier-1 tech company screening rounds strictly filter candidates using algorithmic tests.",
      milestoneProject: "Algorithm benchmarking suite comparing traversal performance",
      tasks: phase2Tasks,
    },
    {
      id: "phase-3",
      phaseNumber: 3,
      title: "Fullstack Flagship Projects",
      subtitle: "Production Deployment & High-Throughput APIs",
      priority: "High",
      estimatedDuration: "6–8 Weeks",
      whyThisMatters: "Proof of work separates resume buzzwords from demonstrable software engineering capability.",
      milestoneProject: "Live, production-hosted SaaS application with active test users",
      tasks: phase3Tasks,
    },
    {
      id: "phase-4",
      phaseNumber: 4,
      title: "Resume & ATS Optimization",
      subtitle: "XYZ Impact Metrics & Portfolio Polish",
      priority: "High",
      estimatedDuration: "2–3 Weeks",
      whyThisMatters: "Recruiters scan resumes for an average of 6 seconds before deciding whether to advance.",
      milestoneProject: "ATS-optimized single-page engineering resume with verifiable links",
      tasks: phase4Tasks,
    },
    {
      id: "phase-5",
      phaseNumber: 5,
      title: "Mock Interviews & System Design",
      subtitle: "Live Coding & Architectural Trade-offs",
      priority: "High",
      estimatedDuration: "4–6 Weeks",
      whyThisMatters: "Solving code silently fails interviews; articulating trade-offs aloud wins offers.",
      milestoneProject: "Recorded 45-minute mock interview showing structured communication",
      tasks: phase5Tasks,
    },
    {
      id: "phase-6",
      phaseNumber: 6,
      title: "Placement Season & Off-Campus Blitz",
      subtitle: "Referrals, OA Execution & Offer Negotiation",
      priority: "Critical",
      estimatedDuration: "Ongoing",
      whyThisMatters: "Systematic referral pipeline execution yields 5x higher interview conversion than blind job boards.",
      milestoneProject: "Securing full-time engineering or high-growth internship offer",
      tasks: phase6Tasks,
    },
  ];

  const phases: InteractiveRoadmapPhase[] = rawPhases.map((p, idx) => {
    const isCompleted = idx < currentPhaseIndex;
    const isCurrent = idx === currentPhaseIndex;
    const completedTasksCount = p.tasks.filter((t) => t.status === "completed" || t.status === "verified").length;

    return {
      ...p,
      status: isCompleted ? "completed" : isCurrent ? "current" : "upcoming",
      completedCount: completedTasksCount,
      totalTasks: p.tasks.length,
    };
  });

  const activePhase = phases[currentPhaseIndex] || phases[0];

  // Dynamic explanation for current phase
  let whyCurrent = "You are currently advancing through foundational core engineering.";
  let whatIsBlocking = "Consistent problem-solving volume and live project deployment.";
  let nextAction = "Start with the highest priority task in this sprint.";

  if (currentPhaseIndex === 0) {
    whyCurrent = "Your development environment and version control workflows need hardening before large-scale building.";
    whatIsBlocking = "Self-reported Git experience is at beginner level.";
    nextAction = "Initialize a GitHub repository and practice branching.";
  } else if (currentPhaseIndex === 1) {
    whyCurrent = "Algorithmic problem-solving is the primary gating filter for initial campus hiring rounds.";
    whatIsBlocking = "Medium-difficulty algorithmic patterns (Trees, DP, Graphs) need systematic practice.";
    nextAction = "Solve 3 Tree traversal problems and verify recursion complexity.";
  } else if (currentPhaseIndex === 2) {
    whyCurrent = "Your theoretical foundation is solid, but your portfolio lacks live deployed software proof.";
    whatIsBlocking = "Absence of a public production deployment URL with CI/CD.";
    nextAction = "Deploy 1 fullstack application to Vercel or Render.";
  } else if (currentPhaseIndex === 3) {
    whyCurrent = "You have practical experience that must now be translated into recruiter-ready format.";
    whatIsBlocking = "Resume metrics require quantifiable Google XYZ impact structuring.";
    nextAction = "Optimize resume bullet points for ATS screening.";
  }

  // Priority skill gaps connecting roadmap
  const matchedRole = ROLE_CATALOG.find(
    (r) => r.name.toLowerCase() === state.targetRole.toLowerCase() || r.id === state.targetRole.toLowerCase()
  ) || ROLE_CATALOG[0];

  const candidateSkills = [
    ...state.skills.languages,
    ...state.skills.frameworks,
    ...state.skills.databases,
    ...state.skills.aiTools,
  ];

  const prioritySkillGaps: RoadmapSkillGapInsight[] = [];
  matchedRole.topSkills.forEach((skillName, idx) => {
    const exists = candidateSkills.some((cs) => cs.toLowerCase().includes(skillName.toLowerCase()));
    if (!exists && prioritySkillGaps.length < 3) {
      prioritySkillGaps.push({
        name: skillName,
        priority: idx === 0 ? "High" : "Medium",
        reason: `Required core technical competency for junior ${matchedRole.name} roles.`,
        currentLevel: "Not Yet Evident",
        targetLevel: "Proficient",
        href: "/skills",
      });
    }
  });

  if (prioritySkillGaps.length === 0) {
    prioritySkillGaps.push({
      name: "System Design & Architecture",
      priority: "High",
      reason: "Differentiator in technical rounds for software engineering graduates.",
      currentLevel: "Foundations",
      targetLevel: "High-Level Scalability",
      href: "/skills",
    });
  }

  // Company Connections
  const companyConnections: RoadmapCompanyConnection[] = [];
  for (const compName of state.targetCompanies) {
    const verified = VERIFIED_COMPANIES.find(
      (c) => c.name.toLowerCase() === compName.toLowerCase() || c.id === compName.toLowerCase()
    );
    if (verified) {
      const match = calculateDeterministicCompanyScore(verified, state.targetRole, state.skills);
      companyConnections.push({
        company: verified,
        preparedPercent: match.score,
        relevantPrepAreas: ["DSA & Problem Solving", "System Architecture", "Behavioral Leadership"],
        missingGaps: match.missingSkills.slice(0, 3),
        href: "/companies",
      });
    }
  }

  // Next best action
  const nextBestAction = {
    title: currentPhaseIndex === 1
      ? "Master Binary Tree Level Order Traversal"
      : currentPhaseIndex === 2
      ? "Deploy Flagship Project to Public URL"
      : "Verify Core Language Syntax Foundation",
    reason: currentPhaseIndex === 1
      ? "Tree algorithms represent 35% of all Tier-1 coding interview screening rounds."
      : "Live URLs with CI/CD increase recruiter callback response rates significantly.",
    estimatedMinutes: 45,
    impactScore: "+8 Readiness Points",
    buttonText: currentPhaseIndex === 1 ? "Practice DSA Task" : "Open Experience Workspace",
    href: currentPhaseIndex === 1 ? "/skills" : "/experience",
  };

  // Companion Coaching
  const mentorId = state.selectedMentor || "athena";
  let coachName = "Athena";
  let coachMessage = "Focus on your current phase before jumping ahead. Consistent incremental progress compound into placement offers.";
  let focusPillar = "Phase Discipline & Consistency";

  if (mentorId === "byte") {
    coachName = "Byte";
    coachMessage = "Don't just complete tutorials. Understand what the code does underneath the hood and write automated tests.";
    focusPillar = "Practical Depth & Testing";
  } else if (mentorId === "raven") {
    coachName = "Raven";
    coachMessage = "Every phase has a concrete milestone. Do not proceed until you can explain your algorithms cleanly from scratch.";
    focusPillar = "Algorithmic Precision";
  } else if (mentorId === "nova") {
    coachName = "Nova";
    coachMessage = "Ship your project work to production! Live links prove capability far better than any theoretical checklist.";
    focusPillar = "Public Proof of Work";
  }

  return {
    targetRole: state.targetRole || "Software Engineer",
    targetCompanies: state.targetCompanies || [],
    readinessScore: readiness.currentScore,
    currentPhase: activePhase,
    currentPhaseIndex,
    currentPhaseExplanation: {
      whyCurrent,
      whatIsBlocking,
      nextAction,
    },
    phases,
    nextBestAction,
    prioritySkillGaps,
    companyConnections,
    companionCoaching: {
      name: coachName,
      message: coachMessage,
      focusPillar,
    },
  };
}
