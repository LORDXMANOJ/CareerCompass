"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { PersistentCompanion } from "@/components/companion/persistent-companion";

interface AppPageShellProps {
  userName: string;
  userEmail: string;
  mentorId: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export function AppPageShell({
  userName,
  userEmail,
  mentorId,
  title,
  subtitle,
  badge,
  headerAction,
  children,
}: AppPageShellProps) {
  const { theme } = useCompanionTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("cc_sidebar_collapsed");
    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("cc_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 flex selection:bg-[#EE4C7C] selection:text-white"
      style={{
        backgroundColor: "var(--cc-bg, #030712)",
        color: "var(--cc-text, #f8fafc)",
      }}
    >
      {/* Collapsible Left Desktop Sidebar */}
      <DashboardSidebar
        mentorId={mentorId}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <DashboardNav
          userName={userName}
          userEmail={userEmail}
          mentorId={mentorId}
        />

        {/* Wide Main Content Canvas */}
        <main className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-12 py-8 space-y-8 flex-1">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b"
              style={{ borderColor: theme.borderSubtle }}
            >
              <div>
                {badge && (
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border"
                    style={{
                      backgroundColor: theme.primarySoft,
                      borderColor: theme.borderHighlight,
                      color: theme.primary,
                    }}
                  >
                    {badge}
                  </span>
                )}
                {title && (
                  <h1
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                    style={{ color: theme.text }}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p
                    className="text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed"
                    style={{ color: theme.textSecondary }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && <div className="shrink-0">{headerAction}</div>}
            </motion.div>
          )}

          {children}

          {/* SaaS Footer */}
          <footer
            className="pt-12 pb-8 border-t text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              borderColor: theme.borderSubtle,
              color: theme.textMuted,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: theme.primary }}
              >
                CC
              </div>
              <span>
                CareerCompass © {new Date().getFullYear()} • AI Career Operating System
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span style={{ color: theme.textSecondary }}>Career Operating System v2.4</span>
              <span>•</span>
              <span style={{ color: theme.textSecondary }}>Staff Review Demonstration</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Persistent Website-Wide Career Mentor Layer */}
      <PersistentCompanion mentorId={mentorId} />
    </div>
  );
}
