"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Shield, Sparkles, TrendingUp, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#5D001E]/30 via-[#9A1750]/20 to-[#EE4C7C]/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#EE4C7C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#9A1750]/40 bg-[#5D001E]/20 text-[#EE4C7C] text-xs sm:text-sm font-semibold mb-8 backdrop-blur-xl shadow-lg shadow-[#5D001E]/20"
          >
            <Zap className="h-4 w-4 text-[#EE4C7C] fill-[#EE4C7C]/30" />
            <span>AI-POWERED PLACEMENT COMPANION ENGINE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]"
          >
            Stop Guessing. <br />
            <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-[#EE4C7C] bg-clip-text text-transparent">
              Start Getting Placed.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Memorable AI Mentors, adaptive diagnostic skill scans, scenario speedruns, and real-time placement readiness score tracking built for top engineering candidates.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white font-semibold text-base shadow-xl shadow-[#9A1750]/30 hover:shadow-[#EE4C7C]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold text-base backdrop-blur-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs sm:text-sm font-medium mb-16"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>4 Iconic AI Mentor Personalities</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>1-100 Placement Readiness Index</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero Generic AI Fluff</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-purple-950/40"
        >
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">careercompass.app/dashboard</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Companion Engine Active</span>
            </div>
          </div>

          {/* Hero Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Column 1: Readiness Score Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Readiness Score</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">78%</div>
                <p className="text-xs text-slate-400">Breaching target hiring bar for Stripe & Google</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Weekly Delta</span>
                <span className="text-emerald-400 font-semibold">+12% growth</span>
              </div>
            </div>

            {/* Column 2: Active Mentor Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Mentor</span>
                  <Bot className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-sm">
                    ?
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">Dev Sen</div>
                    <div className="text-xs text-amber-400 font-medium">Senior Developer</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  &ldquo;Clean logic. Ship it to prod before your coffee gets cold.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Relationship Level: 64</span>
                <span>Trust Meter: 82</span>
              </div>
            </div>

            {/* Column 3: Skill Diagnostics */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skill Breakdown</span>
                  <Shield className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Data Structures</span>
                      <span className="font-mono text-purple-400">88%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>System Design</span>
                      <span className="font-mono text-blue-400">74%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full w-[74%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>SQL & Databases</span>
                      <span className="font-mono text-emerald-400">92%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Streak: 14 Days ??</span>
                <span>Role: Backend Engineer</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
