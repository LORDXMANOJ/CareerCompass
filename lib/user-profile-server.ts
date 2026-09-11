import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { normalizeDashboardState } from "@/lib/dashboard-intelligence";
import { OnboardingState } from "@/types";

export interface ServerUserProfileResult {
  userId: string;
  userName: string;
  userEmail: string;
  mentorId: string;
  onboardingState: OnboardingState;
  rawProfile: Record<string, unknown> | null;
}

export async function getServerUserProfile(): Promise<ServerUserProfileResult> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  const isDev = process.env.NODE_ENV === "development";

  if (!claimsData?.claims && !isDev) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isDev) {
    redirect("/login");
  }

  let rawProfile: Record<string, unknown> | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    rawProfile = data;
  }

  // If user has not completed onboarding, route to /onboarding
  if (user && rawProfile && rawProfile.onboarding_completed === false) {
    redirect("/onboarding");
  }

  const userName =
    (rawProfile?.name as string) ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "Alex Student");

  const userEmail = user?.email || "student@careercompass.ai";

  const onboardingState = normalizeDashboardState(rawProfile);
  const mentorId = onboardingState.selectedMentor || "athena";

  return {
    userId: user?.id || "dev-user",
    userName,
    userEmail,
    mentorId,
    onboardingState,
    rawProfile,
  };
}
