"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import { MENTOR_PERSONAS } from "@/constants";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { signOutAction } from "@/app/auth/actions";
import {
  LayoutDashboard,
  Route,
  Code2,
  Terminal,
  Building2,
  Briefcase,
  Lightbulb,
  Settings,
  Compass,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DashboardSidebarProps {
  mentorId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function DashboardSidebar({
  mentorId,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const { theme } = useCompanionTheme();
  const pathname = usePathname();
  const mentor = MENTOR_PERSONAS.find((m) => m.id === mentorId) || MENTOR_PERSONAS[0];

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { id: "roadmap", label: "Roadmap", icon: Route, href: "/roadmap" },
    { id: "skills", label: "Skills & Gap", icon: Code2, href: "/skills" },
    { id: "problems", label: "Problem Lab", icon: Terminal, href: "/problems" },
    { id: "companies", label: "Target Companies", icon: Building2, href: "/companies" },
    { id: "experience", label: "Experience", icon: Briefcase, href: "/experience" },
    { id: "insights", label: "Career Insights", icon: Lightbulb, href: "/insights" },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r backdrop-blur-2xl transition-all duration-300 z-30 select-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      {/* Top Header & Brand */}
      <div>
        <div
          className="h-16 px-4 flex items-center justify-between border-b"
          style={{ borderColor: theme.borderSubtle }}
        >
          <Link href="/" className="inline-flex items-center gap-3 overflow-hidden group">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: theme.primary,
                boxShadow: theme.isLight ? theme.shadowSm : `0 0 16px ${theme.glow}`,
              }}
            >
              CC
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="flex flex-col truncate"
              >
                <span
                  className="text-base font-black tracking-tight leading-tight transition-colors"
                  style={{ color: theme.text }}
                >
                  CareerCompass
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider truncate"
                  style={{ color: theme.primary }}
                >
                  Operating System
                </span>
              </motion.div>
            )}
          </Link>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-xl border flex items-center justify-center transition-colors"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.textMuted,
            }}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all relative group"
                style={{
                  backgroundColor: isActive
                    ? theme.isLight
                      ? theme.primarySoft
                      : "rgba(30, 41, 59, 0.90)"
                    : "transparent",
                  color: isActive
                    ? theme.isLight ? theme.primary : "#ffffff"
                    : theme.textMuted,
                  borderColor: isActive
                    ? theme.isLight ? theme.borderHighlight : theme.border
                    : "transparent",
                  borderWidth: "1px",
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className="h-5 w-5 shrink-0 transition-colors"
                  style={{
                    color: isActive
                      ? theme.primary
                      : theme.textMuted,
                  }}
                />

                {!isCollapsed && (
                  <span className="truncate text-left flex-1 font-medium">{item.label}</span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 w-1.5 h-6 rounded-r-full"
                    style={{ backgroundColor: theme.primary }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Companion Presence & Utilities */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: theme.borderSubtle }}
      >
        {/* Active AI Companion Spotlight */}
        <div
          className={`p-2.5 rounded-2xl border transition-all ${
            isCollapsed
              ? "flex items-center justify-center"
              : "flex items-center gap-3"
          }`}
          style={{
            borderColor: theme.isLight ? "rgba(139, 92, 246, 0.25)" : theme.border,
            backgroundColor: theme.isLight ? "rgba(139, 92, 246, 0.06)" : "rgba(30, 41, 59, 0.60)",
          }}
          title={`Active AI Coach: ${mentor.name}`}
        >
          <div className="relative shrink-0">
            <CompanionAvatar id={mentor.id} size={isCollapsed ? 36 : 42} className="rounded-xl" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950" />
            </span>
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black truncate" style={{ color: theme.text }}>
                  {mentor.name}
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold"
                  style={{ color: theme.primary }}
                >
                  Active
                </span>
              </div>
              <p className="text-[11px] truncate" style={{ color: theme.textMuted }}>
                {mentor.title}
              </p>
            </div>
          )}
        </div>

        {/* Settings & Onboarding Navigation */}
        <div className="space-y-1">
          <Link
            href="/settings"
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{
              color: pathname === "/settings" ? (theme.isLight ? theme.primary : "#ffffff") : theme.textMuted,
              backgroundColor: pathname === "/settings" ? (theme.isLight ? theme.primarySoft : "rgba(30, 41, 59, 0.90)") : "transparent",
            }}
            title="Settings & Appearance"
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Settings & Theme</span>}
          </Link>

          <Link
            href="/onboarding"
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{ color: theme.textMuted }}
            title="Reconfigure Onboarding"
          >
            <Compass className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Retake Onboarding</span>}
          </Link>
        </div>

        {/* Sign Out */}
        <form
          action={signOutAction}
          className="pt-1 border-t"
          style={{ borderColor: theme.borderSubtle }}
        >
          <button
            type="submit"
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}

