import { Suspense } from "react";
import { getServerUserProfile } from "@/lib/user-profile-server";
import { InsightsPageView } from "@/components/insights/insights-page-view";

async function InsightsContainer() {
  const profileData = await getServerUserProfile();

  return (
    <InsightsPageView
      onboardingState={profileData.onboardingState}
      userName={profileData.userName}
      userEmail={profileData.userEmail}
      mentorId={profileData.mentorId}
    />
  );
}

export default function InsightsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-purple-600/40 mb-4 animate-bounce">
            CC
          </div>
          <div className="text-sm font-bold text-slate-200 mb-1">
            Loading Career Insights...
          </div>
          <div className="text-xs text-purple-400 font-mono">
            Synthesizing Deterministic Career Recommendations
          </div>
        </div>
      }
    >
      <InsightsContainer />
    </Suspense>
  );
}
