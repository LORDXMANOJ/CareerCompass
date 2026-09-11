"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import {
  Bell,
  LogOut,
  Settings,
  Compass,
  Menu,
  X,
  LayoutDashboard,
  Route,
  Code2,
  Building2,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { MENTOR_PERSONAS } from "@/constants";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

interface DashboardNavProps {
  userName: string;
  userEmail: string;
  mentorId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardNav({
  userName,
  userEmail,
  mentorId,
}: DashboardNavProps) {
  const { theme } = useCompanionTheme();
  const pathname = usePathname();
  const mentor = MENTOR_PERSONAS.find((m) => m.id === mentorId) || MENTOR_PERSONAS[0];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { id: "roadmap", label: "Roadmap", icon: Route, href: "/roadmap" },
    { id: "skills", label: "Skills & Gap", icon: Code2, href: "/skills" },
    { id: "companies", label: "Companies", icon: Building2, href: "/companies" },
    { id: "experience", label: "Experience", icon: Briefcase, href: "/experience" },
    { id: "insights", label: "Insights", icon: Lightbulb, href: "/insights" },
  ];

  const btnStyle = {
    backgroundColor: theme.surfaceMuted,
    borderColor: theme.borderSubtle,
    color: theme.textMuted,
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-all"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-12 h-16 flex items-center justify-between gap-4">
          {/* Mobile Brand & Hamburger Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border"
              style={btnStyle}
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="inline-flex items-center gap-2 group">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: theme.isLight ? theme.shadowSm : `0 0 14px ${theme.glow}`,
                }}
              >
                CC
              </div>
              <span className="text-base font-extrabold tracking-tight" style={{ color: theme.text }}>
                CareerCompass
              </span>
            </Link>
          </div>

          {/* Desktop Left Status / Breadcrumb */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
              <span
                className="text-xs font-bold uppercase tracking-wider font-mono"
                style={{ color: theme.textSecondary }}
              >
                Command Center Live
              </span>
            </div>
            <span style={{ color: theme.textMuted }}>•</span>
            <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
              Calibrated with AI Mentor {mentor.name}
            </span>
          </div>

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Link to Retake Onboarding */}
            <Link
              href="/onboarding"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors"
              style={btnStyle}
              title="Edit career target and onboarding preferences"
            >
              <Compass className="h-3.5 w-3.5" style={{ color: theme.textMuted }} />
              <span>Retake Onboarding</span>
            </Link>

            {/* Global Light/Dark Theme Toggle */}
            <ThemeToggle />

            {/* Settings & Appearance Link */}
            <Link
              href="/settings"
              className="h-9 w-9 rounded-xl border flex items-center justify-center transition-colors"
              style={btnStyle}
              title="Companion Appearance & Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="h-9 w-9 rounded-xl border flex items-center justify-center transition-colors"
                style={btnStyle}
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.primary }}
              />
            </div>

            {/* Active Companion Indicator Pill */}
            <div
              className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-2xl border"
              style={{
                backgroundColor: theme.isLight ? "rgba(139, 92, 246, 0.08)" : "rgba(30, 41, 59, 0.60)",
                borderColor: theme.isLight ? "rgba(139, 92, 246, 0.20)" : theme.border,
              }}
              title={`Active AI Companion: ${mentor.name}`}
            >
              <CompanionAvatar id={mentor.id} size={30} className="rounded-lg shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-tight" style={{ color: theme.text }}>
                  {mentor.name}
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: theme.primary }}
                >
                  {theme.personalityLabel}
                </span>
              </div>
            </div>

            {/* User Profile Pill & Sign Out */}
            <div
              className="flex items-center gap-2.5 pl-2 border-l"
              style={{ borderColor: theme.borderSubtle }}
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold max-w-[130px] truncate" style={{ color: theme.text }}>
                  {userName || "Engineer"}
                </span>
                <span className="text-[10px] max-w-[130px] truncate" style={{ color: theme.textMuted }}>
                  {userEmail}
                </span>
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="h-9 w-9 rounded-xl border text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.borderSubtle,
                  }}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-16 z-30 border-b backdrop-blur-2xl p-4 shadow-2xl space-y-3"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold border text-left transition-all"
                    style={{
                      backgroundColor: isActive
                        ? theme.isLight ? "rgba(139, 92, 246, 0.10)" : "rgba(30, 41, 59, 0.90)"
                        : theme.surfaceMuted,
                      borderColor: isActive
                        ? "rgba(139, 92, 246, 0.35)"
                        : theme.borderSubtle,
                      color: isActive ? theme.primary : theme.textMuted,
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div
              className="pt-2 border-t flex items-center justify-between text-xs gap-2 flex-wrap"
              style={{ borderColor: theme.borderSubtle }}
            >
              <ThemeToggle showLabel />

              <div className="flex items-center gap-4">
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1.5"
                  style={{ color: theme.textMuted }}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 py-1.5"
                  style={{ color: theme.textMuted }}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Onboarding</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

