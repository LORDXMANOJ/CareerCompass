import { Suspense } from "react";
import { getServerUserProfile } from "@/lib/user-profile-server";
import { RoadmapPageView } from "@/components/roadmap/roadmap-page-view";

async function RoadmapContainer() {
  const profileData = await getServerUserProfile();

  return (
    <RoadmapPageView
      onboardingState={profileData.onboardingState}
      userName={profileData.userName}
      userEmail={profileData.userEmail}
      mentorId={profileData.mentorId}
    />
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-purple-600/40 mb-4 animate-bounce">
            CC
          </div>
          <div className="text-sm font-bold text-slate-200 mb-1">
            Loading Career Roadmap...
          </div>
          <div className="text-xs text-purple-400 font-mono">
            Calibrating Placement Milestones & Timeline
          </div>
        </div>
      }
    >
      <RoadmapContainer />
    </Suspense>
  );
}
