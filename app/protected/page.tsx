import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

async function UserDetails() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return JSON.stringify(user, null, 2);
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <div className="bg-purple-950/40 border border-purple-500/20 text-purple-200 text-sm p-4 rounded-xl flex gap-3 items-center backdrop-blur-md">
          <ShieldCheck size="20" className="text-purple-400 shrink-0" />
          <span>Protected Area: Authenticated Session Active</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-start bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <h2 className="font-bold text-xl text-white">Your Authentication Session Claims</h2>
        <pre className="text-xs font-mono p-4 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 w-full overflow-auto max-h-64">
          <Suspense fallback={<span className="text-slate-500">Loading claims...</span>}>
            <UserDetails />
          </Suspense>
        </pre>
      </div>
    </div>
  );
}
