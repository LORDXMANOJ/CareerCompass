"use client";

import { motion } from "framer-motion";
import { ConnectedAccounts } from "@/types";
import { Sparkles, Github, Linkedin, Code, Loader2, CheckCircle2, Upload, FileText } from "lucide-react";
import { useState } from "react";

interface StepConnectionsProps {
  connections: ConnectedAccounts;
  onChange: (updated: ConnectedAccounts) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepConnections({ connections, onChange, onNext, onBack }: StepConnectionsProps) {
  const [verifyingGithub, setVerifyingGithub] = useState(false);
  const [githubMsg, setGithubMsg] = useState<string | null>(null);

  const verifyGithubUser = async () => {
    if (!connections.github) return;
    setVerifyingGithub(true);
    setGithubMsg(null);

    try {
      const res = await fetch(`/api/verify-github?username=${encodeURIComponent(connections.github)}`);
      const data = await res.json();

      if (data.verified) {
        onChange({ ...connections, githubVerified: true });
        setGithubMsg(`✅ Verified! (${data.data.public_repos} Public Repos)`);
      } else {
        onChange({ ...connections, githubVerified: false });
        setGithubMsg("❌ GitHub user not found");
      }
    } catch {
      setGithubMsg("❌ Error verifying username");
    } finally {
      setVerifyingGithub(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ ...connections, resumeFileName: file.name });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Step 8 of 8</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Connect Platforms & Resume
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Link your coding profiles for live activity tracking, or upload your resume (optional).
        </p>
      </div>

      <div className="space-y-4 mb-10 max-h-[420px] overflow-y-auto pr-1">
        {/* GitHub Verification Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <Github className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">GitHub Username</span>
            </div>
            {connections.githubVerified && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Verified
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={connections.github || ""}
              onChange={(e) => onChange({ ...connections, github: e.target.value, githubVerified: false })}
              placeholder="e.g. torvalds"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={verifyGithubUser}
              disabled={verifyingGithub || !connections.github}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {verifyingGithub ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Username"}
            </button>
          </div>
          {githubMsg && <div className="text-xs mt-2 font-medium">{githubMsg}</div>}
        </div>

        {/* LeetCode & Codeforces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Code className="h-4 w-4 text-amber-400" /> LeetCode Handle
            </label>
            <input
              type="text"
              value={connections.leetcode || ""}
              onChange={(e) => onChange({ ...connections, leetcode: e.target.value })}
              placeholder="leetcode_username"
              className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-400" /> Codeforces Handle
            </label>
            <input
              type="text"
              value={connections.codeforces || ""}
              onChange={(e) => onChange({ ...connections, codeforces: e.target.value })}
              placeholder="codeforces_username"
              className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* LinkedIn & HackerRank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-sky-400" /> LinkedIn URL
            </label>
            <input
              type="text"
              value={connections.linkedin || ""}
              onChange={(e) => onChange({ ...connections, linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
            <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-400" /> GeeksForGeeks / HackerRank
            </label>
            <input
              type="text"
              value={connections.hackerrank || ""}
              onChange={(e) => onChange({ ...connections, hackerrank: e.target.value })}
              placeholder="username"
              className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Resume Dropzone */}
        <div className="p-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 text-center">
          <label className="cursor-pointer block">
            <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2">
                <Upload className="h-5 w-5" />
              </div>
              {connections.resumeFileName ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <FileText className="h-4 w-4" />
                  <span>{connections.resumeFileName}</span>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-white">Upload Resume (PDF or DOCX)</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Optional — AI resume parser will analyze key projects later</span>
                </>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-900">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5D001E] via-[#9A1750] to-[#EE4C7C] hover:from-[#9A1750] hover:to-[#EE4C7C] text-white font-bold text-xs shadow-lg shadow-[#9A1750]/30 transition-all"
        >
          Generate Profile Analysis
        </button>
      </div>
    </motion.div>
  );
}
