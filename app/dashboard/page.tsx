import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { normalizeDashboardState } from "@/lib/dashboard-intelligence";
import { DashboardView } from "@/components/dashboard/dashboard-view";

async function DashboardContainer() {
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

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  // Ensure accounts that have not completed onboarding are routed to /onboarding
  if (user && profile && profile.onboarding_completed === false) {
    redirect("/onboarding");
  }

  const userName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "Alex Student");

  const userEmail = user?.email || "student@careercompass.ai";

  const onboardingState = normalizeDashboardState(profile);

  return (
    <DashboardView
      onboardingState={onboardingState}
      userName={userName}
      userEmail={userEmail}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-purple-600/40 mb-4 animate-bounce">
            CC
          </div>
          <div className="text-sm font-bold text-slate-200 mb-1">
            Loading Career Command Center...
          </div>
          <div className="text-xs text-purple-400 font-mono">
            Calibrating Placement Readiness & Missions
          </div>
        </div>
      }
    >
      <DashboardContainer />
    </Suspense>
  );
}
