import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { ShieldCheck, UserCheck, Bot, Compass, ArrowRight, LogOut } from "lucide-react";
import { Suspense } from "react";

async function ProfileDetails() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = profileData;
  }

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <>
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
        Welcome to CareerCompass,{" "}
        <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {displayName}
        </span>!
      </h1>

      <p className="text-slate-400 max-w-xl text-base mb-10 leading-relaxed">
        Your profile has been created. Next, we will initialize your AI Mentor companion and launch your diagnostic placement skill scan.
      </p>

      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl text-left shadow-2xl mb-10 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Identity</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <UserCheck className="h-3.5 w-3.5" />
            Verified User
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-500 mb-1">Email</div>
            <div className="font-mono text-slate-200 text-xs truncate">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Assigned Mentor</div>
            <div className="font-medium text-purple-300 text-xs flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-purple-400" />
              <span>Dev Sen (Senior Dev)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center selection:bg-purple-500 selection:text-white">
      <nav className="w-full flex justify-center border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 h-16">
        <div className="w-full max-w-6xl flex justify-between items-center px-6 text-sm">
          <Link href="/" className="flex items-center gap-3 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-sm font-extrabold shadow-lg shadow-purple-500/25">
              CC
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CareerCompass
            </span>
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-4xl p-6 md:p-12 flex flex-col items-center justify-center text-center relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-6">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Authenticated Session Verified</span>
        </div>

        <Suspense fallback={<div className="text-slate-500 text-sm animate-pulse my-12">Loading onboarding details...</div>}>
          <ProfileDetails />
        </Suspense>

        <Link
          href="/protected"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all"
        >
          <Compass className="h-5 w-5" />
          <span>Launch Placement Readiness Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
