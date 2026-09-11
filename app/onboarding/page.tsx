import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

async function OnboardingContainer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDev = process.env.NODE_ENV === "development";

  if (!user && !isDev) {
    redirect("/login");
  }

  let initialProfile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    initialProfile = data;
  }

  // If the authenticated user has already completed onboarding, route them directly to /dashboard
  if (user && initialProfile && initialProfile.onboarding_completed === true) {
    redirect("/dashboard");
  }

  return (
    <OnboardingFlow
      initialEmail={user?.email || "student@careercompass.ai"}
      initialName={user?.user_metadata?.full_name || "Alex Student"}
      savedProfile={initialProfile}
    />
  );
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-[#EE4C7C] selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#5D001E]/25 via-[#9A1750]/20 to-[#EE4C7C]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#9A1750]/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-slate-400 text-sm text-center py-24 animate-pulse">Initializing CareerCompass Engine...</div>}>
        <OnboardingContainer />
      </Suspense>
    </main>
  );
}
