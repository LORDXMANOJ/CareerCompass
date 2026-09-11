import { Suspense } from "react";
import { getServerUserProfile } from "@/lib/user-profile-server";
import { ProblemsPageView } from "@/components/problems/problems-page-view";

async function ProblemsContainer() {
  const profileData = await getServerUserProfile();

  return (
    <ProblemsPageView
      onboardingState={profileData.onboardingState}
      userName={profileData.userName}
      userEmail={profileData.userEmail}
      mentorId={profileData.mentorId}
      userId={profileData.userId}
    />
  );
}

export default function ProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-purple-600/40 mb-4 animate-bounce">
            CC
          </div>
          <div className="text-sm font-bold text-slate-200 mb-1">
            Loading Problem Lab...
          </div>
          <div className="text-xs text-purple-400 font-mono">
            Building Recommendations from Your Profile
          </div>
        </div>
      }
    >
      <ProblemsContainer />
    </Suspense>
  );
}
