import { Suspense } from "react";
import { getServerUserProfile } from "@/lib/user-profile-server";
import { SettingsPageView } from "@/components/settings/settings-page-view";

async function SettingsContainer() {
  const profileData = await getServerUserProfile();

  return (
    <SettingsPageView
      onboardingState={profileData.onboardingState}
      userName={profileData.userName}
      userEmail={profileData.userEmail}
      mentorId={profileData.mentorId}
    />
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#5D001E] via-[#9A1750] to-[#EE4C7C] flex items-center justify-center text-white font-black text-xs shadow-xl shadow-[#9A1750]/40 mb-4 animate-bounce">
            CC
          </div>
          <div className="text-sm font-bold text-slate-200 mb-1">
            Loading System Preferences...
          </div>
          <div className="text-xs text-[#EE4C7C] font-mono">
            Calibrating Companion Persona & Theme Engine
          </div>
        </div>
      }
    >
      <SettingsContainer />
    </Suspense>
  );
}
