"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useCompanionTheme } from "@/lib/companion-theme-context";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { mode, toggleMode, theme } = useCompanionTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to prevent layout shift during SSR hydration
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-transparent opacity-0 pointer-events-none ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = mode === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className={`h-9 px-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
      style={{
        backgroundColor: theme.surfaceMuted,
        borderColor: theme.borderSubtle,
        color: theme.textSecondary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
        e.currentTarget.style.color = theme.text;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.borderSubtle;
        e.currentTarget.style.color = theme.textSecondary;
      }}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 shrink-0 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 shrink-0 transition-transform hover:-rotate-12" />
      )}

      {showLabel && (
        <span className="font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
