"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Award, Compass, Search, Target } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Target Your Goal",
    description: "Select your desired engineering role (Backend, Systems, Fullstack) and dream company (Stripe, Google, Amazon).",
    icon: Target,
  },
  {
    step: "02",
    title: "Diagnostic Skill Scan",
    description: "Your AI Mentor runs a 5-minute diagnostic scan to baseline your problem-solving velocity and expose hidden knowledge gaps.",
    icon: Search,
  },
  {
    step: "03",
    title: "Execute Daily Missions",
    description: "Complete targeted micro-missions, scenario speedruns, and algorithm drills tailored to your weak areas.",
    icon: Compass,
  },
  {
    step: "04",
    title: "Breach Hiring Bar",
    description: "Track your placement readiness score reaching 100% ready for technical interviews and secure your offer letter.",
    icon: Award,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-slate-950/40 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            The Placement Blueprint
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Four Steps From Student To <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Hired Engineer
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-slate-700">{item.step}</span>
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
