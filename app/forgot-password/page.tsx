"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { forgotPasswordAction } from "@/app/auth/actions";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            CC
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            CareerCompass
          </span>
        </Link>
        <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
        <p className="text-sm text-slate-400">Enter your email and we&apos;ll send you instructions to reset your password</p>
      </div>

      {/* Glass Card */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 backdrop-blur-2xl shadow-2xl shadow-purple-950/20 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">{success}</div>
          </div>
        )}

        <form action={forgotPasswordAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Account Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <Suspense fallback={<div className="text-slate-400 text-sm animate-pulse">Loading reset form...</div>}>
        <ForgotPasswordContent />
      </Suspense>
    </main>
  );
}
