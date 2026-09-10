"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Placed at Google (SDE-1)",
    college: "IIT Bombay",
    quote:
      "CareerCompass replaced my messy Notion sheets and random LeetCode grinding. Dev Sen pointed out my exact gaps in System Design and DSA graphs before my Google interviews.",
  },
  {
    name: "Priya Nair",
    role: "Placed at Microsoft (SWE)",
    college: "BITS Pilani",
    quote:
      "The Readiness Index told me when I was actually ready. Instead of panic applying to 200 jobs, I focused on high-match roles and cracked Microsoft on my first attempt.",
  },
  {
    name: "Rohan Verma",
    role: "Placed at Amazon (SDE)",
    college: "NIT Trichy",
    quote:
      "Commander Raven didn't let me relax. When I missed my mock assessment twice, the mentor held me accountable and restructured my revision timeline.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative z-10 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Proven Results
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Built for Students Who Want Offers, Not Certificates
          </p>
          <p className="text-slate-400 text-sm sm:text-base">
            See how candidates used CareerCompass to benchmark their skills, train with AI mentors, and land dream roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-900">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white text-sm">
                  {item.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-xs font-semibold text-purple-400">{item.role}</div>
                  <div className="text-xs text-slate-500">{item.college}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
