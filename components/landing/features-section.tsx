"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Flame, Target, Terminal, Trophy } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "4 Iconic AI Mentors",
    description: "Choose Commander Raven, Dev Sen, Dr. Vance, or Pax. Each mentor brings signature humor, expressions, and tailored motivation.",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400",
  },
  {
    icon: Target,
    title: "Diagnostic Skill Scans",
    description: "Adaptive testing engine pinpoints your weakest concepts in Data Structures, System Design, and SQL within 5 minutes.",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
  },
  {
    icon: Flame,
    title: "Scenario Speedruns",
    description: "Time-boxed interview simulation scenarios designed to sharpen your execution speed under pressure.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  },
  {
    icon: Trophy,
    title: "1-100 Readiness Index",
    description: "Calculates your real hiring probability for target companies like Google, Stripe, Amazon, and Atlassian.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
  },
  {
    icon: Terminal,
    title: "GitHub & LeetCode Sync",
    description: "Automatically imports your repository history and coding telemetry to build a comprehensive candidate profile.",
    color: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400",
  },
  {
    icon: Cpu,
    title: "Emergency Rescue Protocol",
    description: "If your performance crashes, mentors drop sarcasm and switch into dedicated empathy mode to rebuild confidence.",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3">
            Core Engine Capabilities
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineered to Make You <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Impossible to Reject
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 backdrop-blur-xl hover:border-slate-700/80 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                <div
                  className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
