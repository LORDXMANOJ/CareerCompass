import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/actions";
import { LogOut, UserCheck } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
        <UserCheck className="h-3.5 w-3.5 text-purple-400" />
        <span className="truncate max-w-[140px]">{user.email}</span>
      </span>
      <form action={signOutAction}>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-2.5">
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all border border-transparent hover:border-slate-800"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white shadow-md shadow-[#9A1750]/20 hover:scale-[1.02] transition-all"
      >
        Create Account
      </Link>
    </div>
  );
}
