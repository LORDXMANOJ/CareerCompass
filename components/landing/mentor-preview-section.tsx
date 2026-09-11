"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, MessageSquare, Flame } from "lucide-react";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";

const mentors = [
  {
    id: "byte",
    name: "Byte",
    role: "Developer / Systems Architect",
    catchphrase: "Production systems don't care about excuses. Let's optimize asymptotic runtime.",
    signatureAction: "Inspects Core Trace & Terminal Logs",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400",
  },
  {
    id: "raven",
    name: "Raven",
    role: "Elite Technical Architect",
    catchphrase: "Good attempt. Now deliver the same result in O(1) auxiliary space.",
    signatureAction: "Adjusts Tactical Code Matrix",
    color: "from-purple-500/20 to-rose-500/20 border-purple-500/40 text-purple-400",
  },
  {
    id: "athena",
    name: "Athena",
    role: "Strategic Academic Lead",
    catchphrase: "You have 80% of the solution correct. Let's rigorously formulate the boundary conditions.",
    signatureAction: "Synthesizes Key Insights",
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-400",
  },
];

export function MentorPreviewSection() {
  return (
    <section id="mentor" className="py-24 relative z-10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI Companion Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Meet Your Placement Mentors
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Choose an AI companion with a unique personality, feedback style, and adaptive visual atmosphere. Not a generic chatbot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-3xl border bg-gradient-to-b ${mentor.color} p-8 backdrop-blur-xl flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-2xl relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md">
                    <CompanionAvatar id={mentor.id} size={56} emotion="idle" />
                  </div>
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700/50">
                    {mentor.role}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{mentor.name}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  Action: {mentor.signatureAction}
                </p>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Dialogue Sample</span>
                  </div>
                  <p className="text-sm text-slate-200 italic font-medium">&quot;{mentor.catchphrase}&quot;</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pt-4 border-t border-slate-800/50">
                <Bot className="h-4 w-4" />
                <span>Ready for Mock Interviews & Coding Reviews</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
