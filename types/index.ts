export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  targetRole: string | null;
  targetCompanies: string[];
  education: EducationDetails | null;
  skills: SkillsSelection | null;
  experience: ExperienceSelection | null;
  connectedAccounts: ConnectedAccounts | null;
  readinessScore: number;
  selectedMentor: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationScenario {
  question: string;
  userAnswer: string;
  emotionEmoji?: string;
  emotionLabel: string;
  companionResponse: string[];
  takeaway: string;
}

export interface MentorPersona {
  id: string;
  name: string;
  title: string;
  role: string;
  emoji?: string;
  avatarBg: string;
  badgeColor: string;
  borderColor: string;
  signatureColor: string;
  glowColor: string;
  clothing: string;
  expression: string;
  pose: string;
  traits: string[];
  catchphrase: string;
  description: string;
  conversationPreview: {
    correct: ConversationScenario;
    wrong: ConversationScenario;
  };
}

export interface EducationDetails {
  degree: string;
  department: string;
  college: string;
  graduationYear: string;
}

export type SkillVerificationStatus = "verified_basic" | "needs_review";

export interface SkillVerificationRecord {
  status: SkillVerificationStatus;
  selectedAnswer: string;
  isCorrect: boolean;
  verifiedAt: string;
}

export interface SkillsSelection {
  languages: string[];
  frameworks: string[];
  databases: string[];
  aiTools: string[];
  verification?: Record<string, SkillVerificationRecord>;
}

export interface RepresentativeProject {
  name: string;
  technologies: string;
  repoUrl?: string;
  liveDemoUrl?: string;
  description: string;
}

export interface ExperienceSelection {
  gitUsage: "never" | "beginner" | "comfortable" | "daily";
  projectCount: "none" | "1-2" | "3-5" | "6-10" | "10+";
  dsaLevel: "never" | "learning" | "medium" | "strong" | "competitive";
  representativeProject?: RepresentativeProject;
  deploymentExperience?: "never" | "tried" | "once_or_twice" | "regularly";
  apiExperience?: "never" | "consumed" | "built_rest" | "built_and_deployed";
  databaseExperience?: "basic_crud" | "queries_joins" | "schema_design" | "production_modeling";
  teamExperience?: "mostly_solo" | "college_team" | "git_pr_workflow" | "open_source_collab";
}

export interface ConnectedAccounts {
  github?: string;
  githubVerified?: boolean;
  linkedin?: string;
  leetcode?: string;
  codeforces?: string;
  hackerrank?: string;
  codechef?: string;
  geeksforgeeks?: string;
  resumeFileName?: string;
}

export interface CompanyCategory {
  category: string;
  companies: string[];
}

export interface ReadinessProfileSummary {
  readinessScore: number;
  currentLevel: string;
  targetRole: string;
  targetCompanies: string[];
  strengths: string[];
  needsImprovement: string[];
  estimatedTimeline: string;
}

export interface UserActivity {
  completedMissionIds: string[];
  completedTaskIds: string[];
  dsaSolvedCount: number;
  weeklyMissionsCompleted: number;
  lastActiveIso?: string;
}

export interface OnboardingState {
  step: number;
  selectedMentor: string;
  targetRole: string;
  targetCompanies: string[];
  education: EducationDetails;
  skills: SkillsSelection;
  experience: ExperienceSelection;
  connectedAccounts: ConnectedAccounts;
  readinessSummary: ReadinessProfileSummary | null;
  userActivity?: UserActivity;
}

export interface RoleBadge {
  text: string;
  type: "trending" | "beginner" | "growth" | "hiring" | "ai";
  icon: string;
}

export interface RoleDetails {
  id: string;
  name: string;
  icon: string;
  description: string;
  salaryRange: string;
  topCompanies: string[];
  demandLevel: number; // 1-5
  difficultyLevel: number; // 1-5
  badge?: RoleBadge;
  estimatedMonths: number;
  competition: number; // 1-5
  growth: "Moderate" | "High" | "Exponential" | "Excellent";
  topSkills: string[];
  matchKeywords: string[];
  autocompleteTokens: string[];
  mentorTip?: string;
}

