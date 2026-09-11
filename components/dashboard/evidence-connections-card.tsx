"use client";

import React from "react";
import { ConnectedAccounts } from "@/types";
import { Link2, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface EvidenceConnectionsCardProps {
  connections: ConnectedAccounts;
}

export function EvidenceConnectionsCard({ connections }: EvidenceConnectionsCardProps) {
  const { theme } = useCompanionTheme();

  const accounts = [
    {
      id: "github",
      label: "GitHub",
      connected: Boolean(connections.github && connections.github.trim()) || connections.githubVerified,
      detail: connections.github || "Repositories & PR proof",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      connected: Boolean(connections.linkedin && connections.linkedin.trim()),
      detail: connections.linkedin || "Professional network",
    },
    {
      id: "leetcode",
      label: "LeetCode",
      connected: Boolean(connections.leetcode && connections.leetcode.trim()),
      detail: connections.leetcode || "Algorithmic contest rating",
    },
    {
      id: "resume",
      label: "Resume (ATS)",
      connected: Boolean(connections.resumeFileName && connections.resumeFileName.trim()),
      detail: connections.resumeFileName || "PDF Resume Parsing",
    },
    {
      id: "codeforces",
      label: "Codeforces",
      connected: Boolean(connections.codeforces && connections.codeforces.trim()),
      detail: connections.codeforces || "Competitive contest telemetry",
    },
  ];

  const connectedCount = accounts.filter((a) => a.connected).length;

  return (
    <div
      className="p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        boxShadow: theme.isLight ? theme.shadowMd : `0 0 35px ${theme.glow}`,
      }}
    >
      <div>
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 pb-4 mb-5 border-b"
          style={{ borderColor: theme.borderSubtle }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(37, 99, 235, 0.20)",
                borderColor: "rgba(59, 130, 246, 0.35)",
                borderWidth: "1px",
                color: theme.isLight ? "#2563eb" : "#60a5fa",
              }}
            >
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: theme.isLight ? "#2563eb" : "#60a5fa" }}
              >
                Verified Telemetry
              </span>
              <h3 className="text-base sm:text-lg font-black" style={{ color: theme.text }}>
                Career Evidence
              </h3>
            </div>
          </div>

          <span
            className="text-xs sm:text-sm font-mono font-bold"
            style={{ color: theme.isLight ? "#2563eb" : "#93c5fd" }}
          >
            {connectedCount} / {accounts.length} Connected
          </span>
        </div>

        {/* Account Status Items */}
        <div className="space-y-2.5 mb-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm transition-colors"
              style={{
                backgroundColor: acc.connected
                  ? theme.isLight ? "rgba(59, 130, 246, 0.06)" : "rgba(30, 58, 138, 0.30)"
                  : theme.surfaceMuted,
                borderColor: acc.connected
                  ? "rgba(59, 130, 246, 0.30)"
                  : theme.borderSubtle,
                color: theme.text,
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                {acc.connected ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0" style={{ color: theme.textMuted }} />
                )}
                <span className="font-bold truncate" style={{ color: theme.text }}>
                  {acc.label}
                </span>
              </div>

              <span
                className="text-xs font-mono font-bold shrink-0"
                style={{
                  color: acc.connected
                    ? theme.isLight ? "#059669" : "#34d399"
                    : theme.textMuted,
                }}
              >
                {acc.connected ? "Connected ✓" : "Not connected"}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-5" style={{ color: theme.textSecondary }}>
          Connecting your accounts lets CareerCompass replace self-reported estimates with evidence-based analysis.
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href="/experience"
        className="w-full h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors group"
        style={{
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.borderSubtle,
          color: theme.text,
        }}
      >
        <Link2 className="h-4 w-4 text-blue-500" />
        <span>Manage Evidence & Sync</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

