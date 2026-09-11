"use server";

import { createClient } from "@/lib/supabase/server";
import { OnboardingState, ReadinessProfileSummary } from "@/types";
import { revalidatePath } from "next/cache";

export async function calculatePlacementReadiness(data: OnboardingState): Promise<ReadinessProfileSummary> {
  let score = 30; // base starting score

  // Languages score
  const langCount = data.skills.languages.length;
  score += Math.min(langCount * 4, 15);

  // Frameworks & DBs score
  const frameworkCount = data.skills.frameworks.length;
  const dbCount = data.skills.databases.length;
  score += Math.min((frameworkCount + dbCount) * 3, 20);

  // Git usage
  if (data.experience.gitUsage === "daily") score += 10;
  else if (data.experience.gitUsage === "comfortable") score += 7;
  else if (data.experience.gitUsage === "beginner") score += 4;

  // Project count
  if (data.experience.projectCount === "10+") score += 15;
  else if (data.experience.projectCount === "6-10") score += 12;
  else if (data.experience.projectCount === "3-5") score += 9;
  else if (data.experience.projectCount === "1-2") score += 5;

  // DSA Level
  if (data.experience.dsaLevel === "competitive") score += 15;
  else if (data.experience.dsaLevel === "strong") score += 12;
  else if (data.experience.dsaLevel === "medium") score += 8;
  else if (data.experience.dsaLevel === "learning") score += 4;

  // GitHub verification bonus
  if (data.connectedAccounts.githubVerified) score += 5;

  score = Math.min(Math.max(score, 25), 94);

  // Determine Level
  let currentLevel = "Beginner";
  if (score >= 75) currentLevel = "Advanced Engineer";
  else if (score >= 50) currentLevel = "Intermediate";

  // Determine Strengths & Improvement areas
  const strengths: string[] = [];
  const needsImprovement: string[] = [];

  if (data.skills.languages.length > 0) strengths.push(data.skills.languages[0]);
  if (data.skills.frameworks.length > 0) strengths.push(data.skills.frameworks[0]);
  if (data.experience.gitUsage === "daily" || data.experience.gitUsage === "comfortable") strengths.push("Git & Branching");

  if (data.experience.dsaLevel === "never" || data.experience.dsaLevel === "learning") {
    needsImprovement.push("DSA & Algorithms");
  }
  if (!data.connectedAccounts.resumeFileName) {
    needsImprovement.push("Resume Analysis");
  }
  needsImprovement.push("System Design", "Mock Interviews");

  // Determine Placement Timeline
  let estimatedTimeline = "5–7 months";
  if (score >= 75) estimatedTimeline = "1–2 months";
  else if (score >= 60) estimatedTimeline = "3–4 months";

  return {
    readinessScore: score,
    currentLevel,
    targetRole: data.targetRole || "Software Engineer",
    targetCompanies: data.targetCompanies.length > 0 ? data.targetCompanies.slice(0, 3) : ["Google", "Microsoft"],
    strengths,
    needsImprovement,
    estimatedTimeline,
  };
}

export async function saveOnboardingAction(onboardingState: OnboardingState) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User session expired");
  }

  const summary = await calculatePlacementReadiness(onboardingState);

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    (user.email ? user.email.split("@")[0] : "Student");

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email || "",
        name,
        selected_mentor: onboardingState.selectedMentor,
        target_role: onboardingState.targetRole,
        target_companies: onboardingState.targetCompanies,
        education: onboardingState.education,
        skills: onboardingState.skills,
        experience: onboardingState.experience,
        connected_accounts: onboardingState.connectedAccounts,
        readiness_score: summary.readinessScore,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("[saveOnboardingAction] Error saving onboarding data:", error);
    throw new Error(`Failed to save onboarding data: ${error.message}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "page");
  revalidatePath("/onboarding", "page");

  return summary;
}
