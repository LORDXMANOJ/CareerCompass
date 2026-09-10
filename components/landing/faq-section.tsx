"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How is CareerCompass different from LeetCode or YouTube roadmaps?",
    answer:
      "Unlike static practice platforms, CareerCompass uses adaptive AI mentor personas (like Dev Sen or Commander Raven) that track your exact weaknesses, calculate your real-time company benchmark readiness score, and simulate realistic interview rounds.",
  },
  {
    question: "Which companies and roles are supported?",
    answer:
      "CareerCompass benchmarks for tier-1 product companies (Google, Stripe, Microsoft, Amazon, Atlassian) across Backend, Fullstack, Frontend, System Design, and Data Engineering roles.",
  },
  {
    question: "Can I switch my AI Mentor character later?",
    answer:
      "Yes! You can choose your primary mentor during onboarding and switch mentors anytime based on your preferred learning style—whether you need strict accountability or supportive guidance.",
  },
  {
    question: "Is there a free trial for college students?",
    answer:
      "Yes, CareerCompass is free to start. You can complete your skill scan, meet your AI mentor, and access daily placement missions without adding a credit card.",
  },
  {
    question: "How does the Placement Readiness Index work?",
    answer:
      "The Readiness Index evaluates your problem-solving accuracy, speed, communication clarity, and system design aptitude against verified hiring bars of target tech companies.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative z-10 bg-slate-950/80 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know about CareerCompass and placement preparation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-purple-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-purple-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
