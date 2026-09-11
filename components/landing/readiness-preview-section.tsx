"use client";

import { motion } from "framer-motion";
import { Award, ChevronRight, ShieldCheck, TrendingUp } from "lucide-react";

const companyBenchmarks = [
  { company: "Stripe", role: "Backend Engineer", readyScore: 82, currentScore: 78, status: "Close (95% Ready)" },
  { company: "Google", role: "Software Engineer", readyScore: 85, currentScore: 78, status: "In Progress" },
  { company: "Amazon", role: "SDE I", readyScore: 75, currentScore: 78, status: "Hiring Bar Unlocked" },
  { company: "Atlassian", role: "Fullstack Dev", readyScore: 72, currentScore: 78, status: "Hiring Bar Unlocked" },
];

export function ReadinessPreviewSection() {
  return (
    <section id="readiness" className="py-24 relative z-10 bg-slate-950/40 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            Real-Time Calibration Engine
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            The Placement Readiness Index
          </p>
          <p className="text-slate-400 text-sm sm:text-base">
            Know exactly when you are ready to pass technical interview rounds before submitting a single application.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 backdrop-blur-2xl text-center relative shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span>Live Placement Probability</span>
            </div>

            <div className="relative h-48 w-48 mx-auto flex items-center justify-center mb-6">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray="78, 100"
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white tracking-tight">78%</span>
                <span className="text-xs text-slate-400 font-medium">Overall Score</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-xl py-2 px-4">
              <TrendingUp className="h-4 w-4" />
              <span>Top 5% of Tier-1 College Graduates</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              Target Tier Benchmarks
            </h3>

            {companyBenchmarks.map((item, index) => (
              <motion.div
                key={item.company}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{item.company}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{item.role}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Threshold: <span className="text-slate-200 font-semibold">{item.readyScore}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-400 block">{item.status}</span>
                    <span className="text-xs text-slate-400">Match score</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}