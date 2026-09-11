import { ExperienceSelection } from "@/types";

export interface PracticalProfileSummaryItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface PracticalProfileSummary {
  items: PracticalProfileSummaryItem[];
  overallEstimate: "BEGINNER" | "DEVELOPING" | "INTERMEDIATE" | "STRONG" | "ADVANCED";
  estimateColorClass: string;
  disclaimer: string;
}

export const DEPLOYMENT_OPTIONS = [
  { value: "never", label: "Never", description: "I've never deployed an application" },
  { value: "tried", label: "Tried", description: "I've tried deploying a project" },
  { value: "once_or_twice", label: "Once or twice", description: "I've successfully deployed a few projects" },
  { value: "regularly", label: "Regularly", description: "I regularly deploy applications" },
] as const;

export const API_OPTIONS = [
  { value: "never", label: "Never used APIs", description: "Haven't interacted with APIs yet" },
  { value: "consumed", label: "Used APIs", description: "I have consumed existing APIs" },
  { value: "built_rest", label: "Built APIs", description: "I have built REST APIs" },
  { value: "built_and_deployed", label: "Built & deployed", description: "I have built and deployed APIs" },
] as const;

export const DATABASE_OPTIONS = [
  { value: "basic_crud", label: "Basic", description: "I know basic CRUD operations" },
  { value: "queries_joins", label: "Intermediate", description: "I can write queries and joins" },
  { value: "schema_design", label: "Advanced", description: "I can design database schemas" },
  { value: "production_modeling", label: "Strong", description: "I can design production-style data models" },
] as const;

export const TEAM_OPTIONS = [
  { value: "mostly_solo", label: "Mostly solo", description: "Independent personal projects" },
  { value: "college_team", label: "College / Team Projects", description: "Worked in team coursework or group projects" },
  { value: "git_pr_workflow", label: "Git branches + Pull Requests", description: "Used branches, PRs & code review workflows" },
  { value: "open_source_collab", label: "Open Source / Real-world collaboration", description: "Real-world or open-source collaboration" },
] as const;

export const UPDATED_GIT_OPTIONS = [
  { value: "never", label: "Never", description: "I haven't used Git or version control yet" },
  { value: "beginner", label: "Beginner", description: "I know basic commit, push and pull commands" },
  { value: "comfortable", label: "Comfortable", description: "I use branches, pull requests and resolve conflicts" },
  { value: "daily", label: "Daily", description: "Git is part of my regular development workflow" },
] as const;

export const UPDATED_DSA_OPTIONS = [
  { value: "never", label: "Just starting", description: "New to problem-solving and basic syntax" },
  { value: "learning", label: "Comfortable with Easy", description: "Familiar with arrays, strings & straightforward logic" },
  { value: "medium", label: "Easy + some Medium", description: "Solving data structures & recurring problem patterns" },
  { value: "strong", label: "Comfortable with Medium", description: "Confident with graphs, trees, dynamic programming" },
  { value: "competitive", label: "Competitive / Advanced", description: "Active contest rating or advanced competitive coding" },
] as const;

/**
 * Computes a lightweight practical summary and initial onboarding estimate from answers.
 * Strictly labeled as an initial estimate, not a verified measurement.
 */
export function computePracticalProfile(experience: ExperienceSelection): PracticalProfileSummary {
  // 1. Git label
  const gitOption = UPDATED_GIT_OPTIONS.find((o) => o.value === experience.gitUsage);
  const gitLabel = gitOption ? gitOption.label : "Never";

  // 2. Project label
  const projectMap: Record<string, string> = {
    none: "None yet",
    "1-2": "1–2 Projects",
    "3-5": "3–5 Projects",
    "6-10": "6–10 Projects",
    "10+": "10+ Projects",
  };
  const projectLabel = projectMap[experience.projectCount] || "None yet";

  // 3. API label
  const apiOption = API_OPTIONS.find((o) => o.value === experience.apiExperience);
  const apiLabel = apiOption ? apiOption.label : "Used APIs";

  // 4. Database label
  const dbOption = DATABASE_OPTIONS.find((o) => o.value === experience.databaseExperience);
  const dbLabel = dbOption ? dbOption.label : "Intermediate";

  // 5. Deployment label
  const deployOption = DEPLOYMENT_OPTIONS.find((o) => o.value === experience.deploymentExperience);
  const deployLabel = deployOption ? deployOption.label : "Tried";

  // 6. Team label
  const teamOption = TEAM_OPTIONS.find((o) => o.value === experience.teamExperience);
  const teamLabel = teamOption ? teamOption.label : "College / Team Projects";

  // 7. DSA label
  const dsaOption = UPDATED_DSA_OPTIONS.find((o) => o.value === experience.dsaLevel);
  const dsaLabel = dsaOption ? dsaOption.label : "Comfortable with Easy";

  // Scoring calculation for overall onboarding estimate
  const gitScores: Record<string, number> = { never: 0, beginner: 1, comfortable: 2, daily: 3 };
  const projectScores: Record<string, number> = { none: 0, "1-2": 1, "3-5": 2, "6-10": 3, "10+": 4 };
  const deployScores: Record<string, number> = { never: 0, tried: 1, once_or_twice: 2, regularly: 3 };
  const apiScores: Record<string, number> = { never: 0, consumed: 1, built_rest: 2, built_and_deployed: 3 };
  const dbScores: Record<string, number> = { basic_crud: 1, queries_joins: 2, schema_design: 3, production_modeling: 4 };
  const teamScores: Record<string, number> = { mostly_solo: 1, college_team: 2, git_pr_workflow: 3, open_source_collab: 4 };
  const dsaScores: Record<string, number> = { never: 0, learning: 1, medium: 2, strong: 3, competitive: 4 };

  const totalScore =
    (gitScores[experience.gitUsage] ?? 1) +
    (projectScores[experience.projectCount] ?? 1) +
    (deployScores[experience.deploymentExperience ?? "tried"] ?? 1) +
    (apiScores[experience.apiExperience ?? "consumed"] ?? 1) +
    (dbScores[experience.databaseExperience ?? "queries_joins"] ?? 2) +
    (teamScores[experience.teamExperience ?? "college_team"] ?? 2) +
    (dsaScores[experience.dsaLevel] ?? 1);

  let overallEstimate: PracticalProfileSummary["overallEstimate"] = "DEVELOPING";
  let estimateColorClass = "text-amber-300 bg-amber-950/40 border-amber-500/30";

  if (totalScore <= 5) {
    overallEstimate = "BEGINNER";
    estimateColorClass = "text-slate-300 bg-slate-800/80 border-slate-700";
  } else if (totalScore <= 10) {
    overallEstimate = "DEVELOPING";
    estimateColorClass = "text-amber-300 bg-amber-950/40 border-amber-500/30";
  } else if (totalScore <= 16) {
    overallEstimate = "INTERMEDIATE";
    estimateColorClass = "text-blue-300 bg-blue-950/40 border-blue-500/30";
  } else if (totalScore <= 20) {
    overallEstimate = "STRONG";
    estimateColorClass = "text-purple-300 bg-purple-950/40 border-purple-500/30";
  } else {
    overallEstimate = "ADVANCED";
    estimateColorClass = "text-emerald-300 bg-emerald-950/40 border-emerald-500/30";
  }

  const items: PracticalProfileSummaryItem[] = [
    { label: "Git & GitHub", value: gitLabel },
    { label: "Projects", value: projectLabel },
    { label: "APIs", value: apiLabel },
    { label: "Databases", value: dbLabel },
    { label: "Deployment", value: deployLabel },
    { label: "Team Experience", value: teamLabel },
    { label: "DSA", value: dsaLabel },
  ];

  return {
    items,
    overallEstimate,
    estimateColorClass,
    disclaimer:
      "Based on your answers — this is an initial estimate, not a verified skill measurement.",
  };
}

/**
 * Returns dynamic companion commentary reacting to the student's practical selections.
 */
export function getCompanionExperienceReaction(
  mentorId: string,
  experience: ExperienceSelection
): string {
  const pCount = experience.projectCount;
  const git = experience.gitUsage;

  switch (mentorId) {
    case "byte":
      if (git === "never") {
        return "That's completely fine. Everyone starts somewhere. We'll make Git one of your early missions.";
      }
      if (pCount === "3-5" || pCount === "6-10" || pCount === "10+") {
        return `${pCount === "10+" ? "10+" : pCount} projects? Solid start. Now let's see how much real-world development experience you've picked up.`;
      }
      return "Every senior engineer once had 0 projects and 0 commits. Building consistently is the whole secret.";

    case "raven":
      return "Numbers don't prove skill. Evidence comes next.";

    case "athena":
      return "Your practical experience helps me understand how well you've translated your academic knowledge into actual development.";

    case "nova":
      return "Okay, now we're getting somewhere. Projects + deployment + APIs tell me a lot more than a skill list.";

    case "atlas":
      return "Project count is useful, but practical engineering habits matter more.";

    case "sage":
      return "These answers help us identify where your preparation should focus next.";

    default:
      return "Tell us what you've actually built. We'll use this to understand your practical development experience.";
  }
}
