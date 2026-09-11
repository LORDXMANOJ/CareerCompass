"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { signUpAction } from "@/app/auth/actions";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, AlertCircle, Check, X } from "lucide-react";

export function RegisterFormContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Password Strength Logic
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: "", color: "bg-slate-800" };
    if (strengthScore <= 1) return { label: "Weak", color: "bg-red-500" };
    if (strengthScore === 2) return { label: "Fair", color: "bg-amber-500" };
    if (strengthScore === 3) return { label: "Good", color: "bg-blue-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    const formData = new FormData(e.currentTarget);
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirmPassword") as string;
    const terms = formData.get("terms");

    if (pwd !== confirmPwd) {
      e.preventDefault();
      setClientError("Passwords do not match");
      return;
    }

    if (!terms) {
      e.preventDefault();
      setClientError("You must accept the Terms of Service & Privacy Policy");
      return;
    }

    setIsSubmitting(true);
  };

  const displayError = clientError || error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative z-10"
    >
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            CC
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            CareerCompass
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create Your Account</h1>
        <p className="text-sm text-slate-400">Join thousands of students mastering placement readiness</p>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 backdrop-blur-2xl shadow-2xl shadow-purple-950/20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {displayError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{displayError}</div>
          </div>
        )}

        <SocialAuthButtons />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-slate-950/90 px-3 text-slate-500 font-medium">Or register with email</span>
          </div>
        </div>

        <form action={signUpAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                name="name"
                type="text"
                required
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="space-y-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Password Strength</span>
                  <span className="font-semibold text-slate-200">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-full flex-1 transition-colors duration-300 ${
                        level <= strengthScore ? strength.color : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    {hasMinLength ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-600" />}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasUppercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-600" />}
                    <span>Uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasNumber ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-600" />}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasSymbol ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-600" />}
                    <span>Symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Repeat password"
                minLength={8}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
              I accept the <span className="text-purple-400 hover:underline">Terms of Service</span> & <span className="text-purple-400 hover:underline">Privacy Policy</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create CareerCompass Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function RegisterForm() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm animate-pulse">Loading registration card...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
