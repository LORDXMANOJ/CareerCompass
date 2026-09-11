"use client";

import React from "react";
import {
  Code,
  FolderGit2,
  FileText,
  ShieldCheck,
  Github,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useCompanionTheme } from "@/lib/companion-theme-context";

export function QuickActionsGrid() {
  const { theme } = useCompanionTheme();

  const actions = [
    {
      label: "Practice DSA",
      icon: Code,
      iconColor: theme.isLight ? "#059669" : "#34d399",
      bgColor: theme.isLight ? "rgba(16, 185, 129, 0.10)" : "rgba(6, 78, 59, 0.40)",
      borderColor: "rgba(16, 185, 129, 0.35)",
      href: "/skills",
    },
    {
      label: "Build Project",
      icon: FolderGit2,
      iconColor: theme.isLight ? "#2563eb" : "#60a5fa",
      bgColor: theme.isLight ? "rgba(59, 130, 246, 0.10)" : "rgba(30, 58, 138, 0.40)",
      borderColor: "rgba(59, 130, 246, 0.35)",
      href: "/experience",
    },
    {
      label: "Improve Resume",
      icon: FileText,
      iconColor: theme.isLight ? "#7e22ce" : "#c084fc",
      bgColor: theme.isLight ? "rgba(147, 51, 234, 0.10)" : "rgba(88, 28, 135, 0.40)",
      borderColor: "rgba(147, 51, 234, 0.35)",
      href: "/experience",
    },
    {
      label: "Verify Skills",
      icon: ShieldCheck,
      iconColor: theme.isLight ? "#0d9488" : "#2dd4bf",
      bgColor: theme.isLight ? "rgba(13, 148, 136, 0.10)" : "rgba(13, 148, 136, 0.30)",
      borderColor: "rgba(13, 148, 136, 0.35)",
      href: "/skills",
    },
    {
      label: "Connect GitHub",
      icon: Github,
      iconColor: theme.isLight ? "#334155" : "#e2e8f0",
      bgColor: theme.isLight ? "rgba(51, 65, 85, 0.08)" : "rgba(30, 41, 59, 0.80)",
      borderColor: theme.borderSubtle,
      href: "/experience",
    },
    {
      label: "Explore Companies",
      icon: Building2,
      iconColor: theme.isLight ? "#d97706" : "#fbbf24",
      bgColor: theme.isLight ? "rgba(217, 119, 6, 0.10)" : "rgba(120, 53, 15, 0.40)",
      borderColor: "rgba(217, 119, 6, 0.35)",
      href: "/companies",
    },
  ];

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
          Quick Career Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          const cardStyle = {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            boxShadow: theme.isLight ? theme.shadowSm : undefined,
          };

          return (
            <Link
              key={act.label}
              href={act.href}
              className="p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all group hover:scale-[1.02] active:scale-[0.98]"
              style={cardStyle}
            >
              <div
                className="h-11 w-11 rounded-2xl border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm"
                style={{
                  backgroundColor: act.bgColor,
                  borderColor: act.borderColor,
                  color: act.iconColor,
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold transition-colors" style={{ color: theme.text }}>
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

