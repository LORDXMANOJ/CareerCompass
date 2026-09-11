import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

async function OnboardingContainer() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  const isDev = process.env.NODE_ENV === "development";

  if (!claimsData?.claims && !isDev) {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  let initialProfile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    initialProfile = data;
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
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden selection:bg-purple-500 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-slate-400 text-sm text-center py-24 animate-pulse">Initializing CareerCompass Engine...</div>}>
        <OnboardingContainer />
      </Suspense>
    </main>
  );
}
