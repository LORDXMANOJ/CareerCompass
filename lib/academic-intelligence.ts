/**
 * Deterministic academic intelligence engine for the Education step.
 *
 * All values are derived purely from onboarding data already collected —
 * no backend, no network, no randomness. This keeps the whole flow
 * predictable, testable and instant.
 */
import { EducationDetails, SkillsSelection, ExperienceSelection } from "@/types";
import { recognizeInstitution } from "@/constants/college-intelligence";

export interface AcademicMetrics {
  graduationYear: number;
  currentYear: number;
  currentSemester: number;
  totalSemesters: number;
  semestersRemaining: number;
  monthsRemaining: number;
  daysRemaining: number;
  currentAcademicYear: string;
  placementSeasonLabel: string;
}

const GRAD_MONTH = 5; // June (0-based month)

/** Derive semester position + time-to-graduation from the collected education profile. */
export function computeAcademicMetrics(education: EducationDetails): AcademicMetrics {
  const now = new Date();
  const fallbackGrad = now.getFullYear() + 3;
  const parsed = parseInt(education?.graduationYear || "", 10);
  const graduationYear = Number.isFinite(parsed) && parsed >= 2000 ? parsed : fallbackGrad;

  const isGraduated = graduationYear < now.getFullYear() || (graduationYear === now.getFullYear() && now.getMonth() >= GRAD_MONTH);
  const startYear = graduationYear - 4; // 8-semester B.E./B.Tech program
  const month = now.getMonth();
  const year = now.getFullYear();
  const secondHalf = month >= 6; // Aug-Dec => odd semester
  const academicStart = secondHalf ? year : year - 1;
  const semOffset = secondHalf ? 1 : 2;

  const rawSemester = isGraduated ? 8 : (academicStart - startYear) * 2 + semOffset;
  const currentSemester = Math.min(8, Math.max(1, rawSemester));
  const totalSemesters = 8;
  const semestersRemaining = isGraduated ? 0 : Math.max(0, totalSemesters - currentSemester);

  const gradDate = new Date(graduationYear, GRAD_MONTH, 1, 12, 0, 0);
  const diffMs = gradDate.getTime() - now.getTime();
  const daysRemaining = isGraduated ? 0 : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const monthsRemaining = isGraduated ? 0 : Math.max(0, Math.round(daysRemaining / 30.4));

  return {
    graduationYear,
    currentYear: year,
    currentSemester,
    totalSemesters,
    semestersRemaining,
    monthsRemaining,
    daysRemaining,
    currentAcademicYear: `${academicStart}-${String(academicStart + 1).slice(2)}`,
    placementSeasonLabel: `${graduationYear - 1}-${String(graduationYear).slice(2)}`,
  };
}

const GIT_MAP: Record<ExperienceSelection["gitUsage"], number> = {
  never: 0,
  beginner: 2,
  comfortable: 3,
  daily: 5,
};

const PROJECT_MAP: Record<ExperienceSelection["projectCount"], number> = {
  none: 0,
  "1-2": 2,
  "3-5": 4,
  "6-10": 6,
  "10+": 8,
};

const DSA_MAP: Record<ExperienceSelection["dsaLevel"], number> = {
  never: 0,
  learning: 3,
  medium: 6,
  strong: 9,
  competitive: 12,
};

/** Deterministic 0-100 placement readiness estimate (current). */
export function computePlacementReadiness(
  education: EducationDetails,
  skills: SkillsSelection,
  experience: ExperienceSelection,
  metrics: AcademicMetrics
): number {
  let score = 44;

  if (education.degree.trim() && education.department.trim()) score += 8;
  if (recognizeInstitution(education.college)) score += 7;

  const semesterProgress = Math.min(metrics.currentSemester, metrics.totalSemesters) / metrics.totalSemesters;
  score += Math.round(semesterProgress * 8);

  score += Math.min(skills.languages.length * 2, 10);
  score += Math.min(skills.frameworks.length, 3);
  score += Math.min(skills.aiTools.length, 2);

  score += GIT_MAP[experience.gitUsage];
  score += PROJECT_MAP[experience.projectCount];
  score += DSA_MAP[experience.dsaLevel];

  return Math.min(96, Math.max(38, score));
}
export type CompanyEligibilityStatus = "eligible" | "strengthen";

export interface CompanyEligibility {
  name: string;
  status: CompanyEligibilityStatus;
  reason: string;
  note: string;
}

/** Rough company hiring-bar index derived from each brand's known interview depth. */
const COMPANY_BARS: Record<string, number> = {
  GOOGLE: 34,
  META: 34,
  OPENAI: 36,
  ANTHROPIC: 36,
  NVIDIA: 33,
  APPLE: 33,
  MICROSOFT: 32,
  NETFLIX: 32,
  STRIPE: 31,
  AMAZON: 30,
  GITHUB: 30,
  CLOUDFLARE: 29,
  TESLA: 29,
  UBER: 28,
  ROCKSTAR: 28,
  "EPIC GAMES": 27,
  FLIPKART: 27,
  ATLASSIAN: 27,
  "RIOT GAMES": 26,
  SWIGGY: 26,
  SPOTIFY: 26,
  SALESFORCE: 26,
  RAZORPAY: 25,
  PHONEPE: 25,
  ZOMATO: 25,
  MONGODB: 25,
  ADOBE: 25,
  CRED: 24,
  GROWW: 24,
  UNITY: 24,
  GITLAB: 24,
  DOCKER: 24,
  VERCEL: 24,
  ORACLE: 24,
  CANVA: 23,
  SUPABASE: 23,
  NINTENDO: 22,
  POSTMAN: 22,
  AIRBNB: 21,
  SONY: 21,
  DELOITTE: 20,
  FRESHWORKS: 20,
  ACCENTURE: 19,
  ZOHO: 19,
  INFOSYS: 17,
  COGNIZANT: 17,
  WIPRO: 16,
  TCS: 16,
  HCLTECH: 16,
};

/**
 * Preliminary (deterministic) eligibility estimate for each target company,
 * computed from the student's skills, experience, current semester and role.
 */
export function getCompanyEligibility(
  companyNames: string[],
  targetRole: string,
  metrics: AcademicMetrics,
  skills: SkillsSelection,
  experience: ExperienceSelection
): CompanyEligibility[] {
  const dsaBase = DSA_MAP[experience.dsaLevel];
  const projBase = PROJECT_MAP[experience.projectCount];
  const gitBase = GIT_MAP[experience.gitUsage];
  const semesterBonus = metrics.currentSemester >= 6 ? 4 : metrics.currentSemester >= 4 ? 2 : 0;
  const langBase = Math.min(skills.languages.length * 1.5, 6);
  const stackBase =
    Math.min(skills.frameworks.length + skills.databases.length, 4) + Math.min(skills.aiTools.length, 2);

  const strength = dsaBase + projBase + gitBase + semesterBonus + langBase + stackBase;

  return (companyNames ?? []).map((name) => {
    const bar = COMPANY_BARS[name.trim().toUpperCase()] ?? 22;
    const threshold = bar * 0.62;
    const eligible = strength >= threshold;

    let reason = "Improve DSA";
    if (dsaBase >= 6 && projBase < 6) reason = "Build strong projects";
    else if (dsaBase >= 6 && projBase >= 6) reason = "Stronger problem-solving depth";

    return {
      name,
      status: eligible ? "eligible" : "strengthen",
      reason,
      note: eligible
        ? `Strong fit for ${targetRole} roles`
        : `${reason.toLowerCase()} before applying`,
    };
  });
}
export interface MentorAcademicAdvice {
  title: string;
  lines: string[];
}

/** Companion-specific academic advice — each mentor speaks in their own voice. */
export function getMentorAcademicAdvice(
  mentorId: string,
  metrics: AcademicMetrics
): MentorAcademicAdvice {
  const sem = metrics.currentSemester;
  const semLeft = metrics.semestersRemaining;
  const months = metrics.monthsRemaining;

  switch (mentorId) {
    case "byte":
      return {
        title: "Code & Semester Sprint",
        lines: [
          `You're currently in Semester ${sem}, which is the perfect time to begin serious interview preparation. We still have enough time to build projects, master DSA, and polish your resume.`,
          "Stack-trace your weaknesses now — 30 focused minutes daily beats a panicked weekend grind later.",
        ],
      };
    case "raven":
      return {
        title: "No Excuses, Execute",
        lines: [
          "Your graduation date is fixed. Your preparation isn't. Let's make every semester count.",
          `${months} months of runway means zero tolerance for half-hearted attempts. Judge every week by shipped output, not intention.`,
        ],
      };
    case "athena":
      return {
        title: "Structured Academic Roadmap",
        lines: [
          `With ${semLeft} semester(s) remaining, we can sequence preparation like a rigorous syllabus — fundamentals before speed, depth before breadth.`,
          "I'll break the coming months into weekly micro-milestones that slot around your exam cycle.",
        ],
      };
    case "nova":
      return {
        title: "Build What You Learn",
        lines: [
          `${months} months is a full funding round in startup time. Let's convert it into 2–3 deployed projects recruiters can actually open.`,
          "No tutorial limbo — every week ends with code pushed to production and a commit graph that sells you.",
        ],
      };
    case "atlas":
      return {
        title: "System-Level Optimization",
        lines: [
          "We treat each semester as an iteration: sharper DSA, production-grade projects, and system design fundamentals before Placement Season.",
          `Your benchmark is set by your dream companies. Every milestone will be calibrated against their true hiring threshold.`,
        ],
      };
    case "sage":
      return {
        title: "Metric-Driven Plan",
        lines: [
          `We have ~${months} months and ${semLeft} semester(s) — a precise window we can calibrate weekly across resume score, project depth and solved problems.`,
          "Every metric feeds a living roadmap that adapts the moment you improve.",
        ],
      };
    default:
      return {
        title: "Personalized Academic Prep",
        lines: [
          `We've anchored your roadmap to Semester ${sem}, leaving ~${months} months of runway before graduation.`,
          "Let's make every week compound toward your dream companies.",
        ],
      };
  }
}

/**
 * Dynamically generated summary based on student's actual academic profile,
 * target role, target companies and timeline.
 */
export function generateAcademicSummary(
  education: EducationDetails,
  targetRole: string,
  targetCompanies: string[],
  metrics: AcademicMetrics
): string {
  const sem = metrics.currentSemester;
  const degree = education.degree.trim() || "Engineering";
  const branch = education.department.trim() || "Computer Science";
  const college = education.college.trim() ? ` at ${education.college.trim()}` : "";
  const months = metrics.monthsRemaining;
  const companiesList =
    targetCompanies.length > 0
      ? targetCompanies.slice(0, 3).join(", ")
      : "top product engineering firms";

  return `You are currently in Semester ${sem} of a ${degree} ${branch} program${college}. Based on your graduation timeline (${education.graduationYear || metrics.graduationYear}) and selected targets (${companiesList}), CareerCompass estimates approximately ${months} months to become fully interview-ready for ${targetRole || "Software Engineer"} roles.`;
}

export interface SkillCheckItem {
  label: string;
  status: "ready" | "needs-work";
  note: string;
}

export interface CompanyPrepReadiness {
  name: string;
  readinessPercentage: number;
  checks: SkillCheckItem[];
  verdict: string;
  disclaimer: string;
}

/**
 * Company Preparation Readiness.
 * Computes deterministic preparation readiness percentages and key preparation indicators
 * for each targeted company.
 * Strictly disclaimed: "CareerCompass Estimate · Preparation indicator only, not a hiring probability or guarantee."
 */
export function getCompanyPrepReadiness(
  targetCompanies: string[],
  targetRole: string,
  skills: SkillsSelection,
  experience: ExperienceSelection,
  metrics: AcademicMetrics
): CompanyPrepReadiness[] {
  const dsaWeight = DSA_MAP[experience.dsaLevel];
  const projWeight = PROJECT_MAP[experience.projectCount];
  const gitWeight = GIT_MAP[experience.gitUsage];
  const langCount = skills.languages.length;
  const hasDb = skills.databases.length > 0;
  const semBonus = metrics.currentSemester >= 6 ? 4 : metrics.currentSemester >= 4 ? 2 : 0;

  const rawPreparedness = dsaWeight + projWeight + gitWeight + Math.min(langCount * 2, 8) + semBonus;

  return (targetCompanies || []).map((companyName) => {
    const bar = COMPANY_BARS[companyName.trim().toUpperCase()] ?? 24;
    // Map raw preparedness into a realistic 60%-95% range relative to company hiring bar
    const ratio = Math.min(1.15, Math.max(0.65, rawPreparedness / Math.max(bar, 18)));
    const percentage = Math.min(95, Math.max(62, Math.round(ratio * 80)));

    // Deterministic checks
    const dsaReady = experience.dsaLevel === "strong" || experience.dsaLevel === "competitive";
    const oopReady = langCount >= 2 && (skills.languages.includes("Java") || skills.languages.includes("C++") || skills.languages.includes("Python"));
    const sqlReady = hasDb || skills.frameworks.some((f) => f.toLowerCase().includes("node") || f.toLowerCase().includes("django") || f.toLowerCase().includes("spring"));
    const sysDesignReady = metrics.currentSemester >= 7 && projWeight >= 6;

    const checks: SkillCheckItem[] = [
      {
        label: "DSA",
        status: dsaReady ? "ready" : "needs-work",
        note: dsaReady ? "Problem-solving depth verified" : "Requires 150+ LeetCode practice",
      },
      {
        label: "OOP & CS Core",
        status: oopReady ? "ready" : "needs-work",
        note: oopReady ? "Solid OOP language base" : "Brush up Polymorphism & Design Patterns",
      },
      {
        label: "SQL & Data",
        status: sqlReady ? "ready" : "needs-work",
        note: sqlReady ? "Schema & query concepts present" : "Practice JOINs & indexing queries",
      },
      {
        label: "System Design",
        status: sysDesignReady ? "ready" : "needs-work",
        note: sysDesignReady ? "Architectural concepts developing" : "Target LLD & caching before drives",
      },
    ];

    return {
      name: companyName,
      readinessPercentage: percentage,
      checks,
      verdict: percentage >= 85 ? "High Preparation Alignment" : "Solid Track · Ramp up weak areas",
      disclaimer: "CareerCompass Estimate · Preparation indicator only, not a hiring probability or guarantee.",
    };
  });
}

export interface RiskFactor {
  label: string;
  status: "good" | "warning";
  detail: string;
}

export interface CareerPreparationRisk {
  level: "LOW" | "MEDIUM" | "HIGH";
  badgeColor: string;
  summary: string;
  factors: RiskFactor[];
}

/**
 * Evaluates preparation risk dynamically from student's profile,
 * months remaining, project count, and target company depth.
 */
export function computePreparationRisk(
  education: EducationDetails,
  skills: SkillsSelection,
  experience: ExperienceSelection,
  metrics: AcademicMetrics,
  targetCompanies: string[]
): CareerPreparationRisk {
  const dsaNum = DSA_MAP[experience.dsaLevel];
  const projNum = PROJECT_MAP[experience.projectCount];
  const months = metrics.monthsRemaining;

  const factors: RiskFactor[] = [
    {
      label: "Academic Profile",
      status: education.degree.trim() && education.department.trim() ? "good" : "warning",
      detail: education.degree.trim() ? `${education.degree} in progress` : "Degree details pending",
    },
    {
      label: "Target Companies",
      status: targetCompanies.length > 0 ? "good" : "warning",
      detail: `${targetCompanies.length} company target(s) locked`,
    },
    {
      label: "Projects",
      status: projNum >= 4 ? "good" : "warning",
      detail: projNum >= 4 ? "Good portfolio baseline" : "Needs 2–3 deployed production apps",
    },
    {
      label: "Interview Practice",
      status: dsaNum >= 6 ? "good" : "warning",
      detail: dsaNum >= 6 ? "Medium/strong DSA foundation" : "Accelerate DSA problem solving",
    },
    {
      label: "Resume & ATS",
      status: months > 4 ? "good" : "warning",
      detail: months > 4 ? "Sufficient runway to polish ATS score" : "Immediate resume overhaul needed",
    },
  ];

  const warningCount = factors.filter((f) => f.status === "warning").length;

  if (warningCount <= 1) {
    return {
      level: "LOW",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      summary: "Balanced runway. Stick to weekly milestones to stay ahead of campus & off-campus drives.",
      factors,
    };
  } else if (warningCount <= 3) {
    return {
      level: "MEDIUM",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      summary: "Actionable gaps in projects and interview drills. Manageable with a structured 8-week sprint.",
      factors,
    };
  } else {
    return {
      level: "HIGH",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      summary: "Runway is tightening. Priority should be high-impact projects and daily DSA consistency.",
      factors,
    };
  }
}

export interface ReadinessFactorBreakdown {
  category: string;
  weight: string;
  pointsEarned: number;
  maxPoints: number;
  status: "optimal" | "developing" | "action-required";
  detail: string;
}

export interface ReadinessExplanation {
  totalScore: number;
  factors: ReadinessFactorBreakdown[];
  explanationSummary: string;
  transparencyNote: string;
}

/**
 * Transparent breakdown of how the CareerCompass Readiness score is computed.
 */
export function getReadinessExplanation(
  education: EducationDetails,
  skills: SkillsSelection,
  experience: ExperienceSelection,
  metrics: AcademicMetrics
): ReadinessExplanation {
  const totalScore = computePlacementReadiness(education, skills, experience, metrics);

  const eduPoints = Math.min(
    15,
    (education.degree.trim() ? 5 : 0) +
      (education.department.trim() ? 5 : 0) +
      (recognizeInstitution(education.college) ? 5 : 3)
  );

  const skillsPoints = Math.min(
    25,
    skills.languages.length * 4 + skills.frameworks.length * 2 + skills.databases.length * 2
  );

  const dsaPoints = Math.min(30, DSA_MAP[experience.dsaLevel] * 2.5);

  const projectPoints = Math.min(
    20,
    PROJECT_MAP[experience.projectCount] * 1.8 + GIT_MAP[experience.gitUsage] * 1.2
  );

  const timelinePoints = Math.min(10, Math.round((metrics.monthsRemaining / 12) * 5) + 5);

  const factors: ReadinessFactorBreakdown[] = [
    {
      category: "Academic & Degree Baseline",
      weight: "15%",
      pointsEarned: eduPoints,
      maxPoints: 15,
      status: eduPoints >= 12 ? "optimal" : "developing",
      detail: `${education.degree} · Semester ${metrics.currentSemester} progression`,
    },
    {
      category: "Tech Stack & Languages",
      weight: "25%",
      pointsEarned: skillsPoints,
      maxPoints: 25,
      status: skillsPoints >= 18 ? "optimal" : skillsPoints >= 10 ? "developing" : "action-required",
      detail: `${skills.languages.length} languages, ${skills.frameworks.length} frameworks cataloged`,
    },
    {
      category: "DSA & Problem Solving Depth",
      weight: "30%",
      pointsEarned: Math.round(dsaPoints),
      maxPoints: 30,
      status: dsaPoints >= 20 ? "optimal" : dsaPoints >= 12 ? "developing" : "action-required",
      detail: `Current level: ${experience.dsaLevel}`,
    },
    {
      category: "Projects & Git Workflow",
      weight: "20%",
      pointsEarned: Math.round(projectPoints),
      maxPoints: 20,
      status: projectPoints >= 14 ? "optimal" : projectPoints >= 8 ? "developing" : "action-required",
      detail: `${experience.projectCount} projects · Git usage: ${experience.gitUsage}`,
    },
    {
      category: "Runway & Timeline Buffer",
      weight: "10%",
      pointsEarned: timelinePoints,
      maxPoints: 10,
      status: timelinePoints >= 7 ? "optimal" : "developing",
      detail: `${metrics.monthsRemaining} months runway until graduation`,
    },
  ];

  return {
    totalScore,
    factors,
    explanationSummary:
      "Calculated transparently across your academic progress, technical stack, problem-solving proficiency, hands-on projects, and preparation runway.",
    transparencyNote:
      "This estimate reflects preparation alignment relative to industry hiring bars, never a guaranteed outcome.",
  };
}

export interface DailyCareerTip {
  title: string;
  tip: string;
  actionItem: string;
  category: "DSA" | "System Design" | "Resume" | "Projects" | "Networking";
}

/**
 * Generates today's career tip tailored to the selected mentor persona and the student's status.
 */
export function getTodayCareerTip(
  mentorId: string,
  targetRole: string,
  metrics: AcademicMetrics,
  experience: ExperienceSelection
): DailyCareerTip {
  if (experience.dsaLevel === "never" || experience.dsaLevel === "learning") {
    return {
      title: "Master Two Pointers & Sliding Window",
      tip: "Over 45% of tech assessment questions for entry-level roles involve arrays, strings, or two pointers. Don't jump into dynamic programming yet — master pointer manipulation first.",
      actionItem: "Solve 3 easy array problems using 2 pointers today.",
      category: "DSA",
    };
  }

  if (experience.projectCount === "none" || experience.projectCount === "1-2") {
    return {
      title: "Deploy with a Live Domain & CI/CD",
      tip: `Recruiters spend an average of 7 seconds on a portfolio. A live, working URL with automated GitHub Actions testing creates instant trust compared to code sitting in localhost.`,
      actionItem: `Add a Vercel or Render deployment link to your top project README.`,
      category: "Projects",
    };
  }

  if (metrics.currentSemester >= 6) {
    return {
      title: "Quantify Resume Impact with the Google XYZ Formula",
      tip: `"Accomplished [X], as measured by [Y], by doing [Z]". Replace generic bullet points like "built API" with "Engineered Node.js REST API reducing query latency by 32% across 5 endpoints".`,
      actionItem: "Rewrite 2 project bullet points using the XYZ formula today.",
      category: "Resume",
    };
  }

  return {
    title: "Consistency Compounds Faster than Weekend Grinds",
    tip: `Solving 1 curated problem per day for 90 days (90 problems) builds stronger pattern recognition than solving 10 problems every Sunday in a frantic burst.`,
    actionItem: "Schedule a non-negotiable 30-minute coding slot every morning.",
    category: "DSA",
  };
}

export interface DetailedRoadmapStage {
  id: string;
  label: string;
  sub: string;
  duration: string;
  highlight: boolean;
  description: string;
  topics: string[];
  keyMilestone: string;
  recommendedHoursPerWeek: number;
}

/**
 * Clickable interactive roadmap stages with in-depth curriculum and milestones.
 */
export function getDetailedRoadmap(
  targetRole: string,
  metrics: AcademicMetrics
): DetailedRoadmapStage[] {
  return [
    {
      id: "today",
      label: "Today",
      sub: "Kickstart preparation",
      duration: "Day 1",
      highlight: false,
      description: "Establish your baseline diagnostic, lock target companies, and calibrate your personalized weekly targets.",
      topics: ["Profile Diagnostic", "Target Company Mapping", "Weekly Schedule Setup"],
      keyMilestone: "Diagnostic completed & targets confirmed",
      recommendedHoursPerWeek: 5,
    },
    {
      id: "dsa",
      label: "Master DSA",
      sub: `250+ problems, ${metrics.monthsRemaining} months`,
      duration: "12 Weeks",
      highlight: false,
      description: "Build deep pattern recognition across core data structures and algorithmic paradigms asked in top coding rounds.",
      topics: ["Arrays & Strings", "Hashing & Two Pointers", "Binary Trees & BST", "Graphs (BFS/DFS)", "Dynamic Programming"],
      keyMilestone: "250+ problems solved across NeetCode/LeetCode patterns",
      recommendedHoursPerWeek: 12,
    },
    {
      id: "projects",
      label: "Build Projects",
      sub: "2–3 deployable projects",
      duration: "8 Weeks",
      highlight: false,
      description: `Build and deploy production-grade applications specifically relevant to ${targetRole} positions with live URLs and clean architecture.`,
      topics: ["Fullstack Architecture", "Database Modeling & Indexing", "Authentication & Security", "CI/CD Pipeline & Live Hosting"],
      keyMilestone: "2 deployed production applications with GitHub proof of work",
      recommendedHoursPerWeek: 10,
    },
    {
      id: "resume",
      label: "Resume & ATS",
      sub: "ATS score 85+",
      duration: "2 Weeks",
      highlight: false,
      description: "Craft an ATS-optimized single-page resume with quantified impact metrics, verified GitHub links, and tailored keywords.",
      topics: ["Google XYZ Metric Bullets", "ATS Keyword Alignment", "Portfolio & Project Links", "Peer Review"],
      keyMilestone: "ATS score 85+ passing automated company filters",
      recommendedHoursPerWeek: 6,
    },
    {
      id: "mocks",
      label: "Mock Interviews",
      sub: "Weekly practice rounds",
      duration: "4 Weeks",
      highlight: false,
      description: "Simulate real technical interview environments with live whiteboard coding, behavioral STAR questions, and system thinking.",
      topics: ["Live Coding Drills", "Behavioral STAR Stories", "System Design Fundamentals", "Code Explanation Speed"],
      keyMilestone: "5 full mock interview loops completed with feedback",
      recommendedHoursPerWeek: 8,
    },
    {
      id: "placement",
      label: "Placement Season",
      sub: metrics.placementSeasonLabel,
      duration: "Active Drives",
      highlight: false,
      description: "Execute targeted applications, online assessments (OAs), on-campus test drives, and employee referral requests.",
      topics: ["Company Shortlisting", "OA Speed Drills", "Alumni Referral Outreach", "Technical Interview Rounds"],
      keyMilestone: "Shortlists secured for targeted interview rounds",
      recommendedHoursPerWeek: 15,
    },
    {
      id: "dream",
      label: "Dream Company",
      sub: "Offer in hand",
      duration: "Milestone",
      highlight: true,
      description: "Convert interview rounds into final offers, evaluate compensation packages, and prepare for onboarding.",
      topics: ["Final Round Execution", "Offer Evaluation", "Pre-joining Upskilling", "Career Launch"],
      keyMilestone: "Official offer letter accepted!",
      recommendedHoursPerWeek: 5,
    },
  ];
}