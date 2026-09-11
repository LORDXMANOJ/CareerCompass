"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCompanionTheme } from "@/lib/companion-theme-context";
import {
  CompanionThemeId,
  UIStyleId,
  AccentColorId,
  UI_STYLE_PRESETS,
  ACCENT_PRESETS,
  COMPANION_DEFAULT_THEMES,
} from "@/constants/companion-themes";
import { CompanionAvatar } from "@/components/onboarding/companion-avatars";
import {
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  Zap,
  Sliders,
  SunMoon,
  Compass,
} from "lucide-react";

export function CompanionAppearanceSettings() {
  const {
    activeCompanion,
    activeStyle,
    activeAccent,
    theme,
    isCustomized,
    setCompanion,
    setStyle,
    setAccent,
    setAccentIntensity,
    setGlowIntensity,
    accentIntensity,
    glowIntensity,
    resetToCompanionDefault,
    resetToDefault,
  } = useCompanionTheme();

  const companionList: CompanionThemeId[] = ["athena", "nova", "raven", "atlas", "byte", "sage"];
  const styleList: UIStyleId[] = [
    "oled-black",
    "professional-dark",
    "material-dark",
    "glass-aurora",
    "midnight",
    "light",
  ];
  const accentList: AccentColorId[] = [
    "violet",
    "cyan",
    "emerald",
    "orange",
    "blue",
    "crimson",
    "gold",
    "rose",
  ];

  const companionDefault = COMPANION_DEFAULT_THEMES[activeCompanion];
  const isCurrentlyDefault =
    activeStyle === companionDefault.styleId && activeAccent === companionDefault.accentId;

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b"
        style={{ borderColor: theme.borderSubtle }}
      >
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 border shadow-sm"
            style={{
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderHighlight,
              color: theme.textAccent,
            }}
          >
            <Palette className="h-3.5 w-3.5" style={{ color: theme.primary }} />
            <span>Theme System V2 · Style & Accent Decoupled</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: theme.text }}
          >
            Theme & Visual Atmosphere
          </h2>
          <p className="text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: theme.textSecondary }}>
            Customize your UI surface architecture and interactive accent colors independently.
            Changes apply instantly across Onboarding, Dashboard, and Navigation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {!isCurrentlyDefault && (
            <button
              type="button"
              onClick={resetToCompanionDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm"
              style={{
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.borderSubtle,
                color: theme.text,
              }}
            >
              <Compass className="h-3.5 w-3.5" style={{ color: theme.primary }} />
              <span>Adopt {theme.name} Default</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetToDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm"
            style={{
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.borderSubtle,
              color: theme.textMuted,
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 1: Active Companion Selection                         */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-[11px] font-mono font-bold"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              1
            </span>
            <span>AI Companion Persona</span>
          </label>
          <span className="text-xs" style={{ color: theme.textMuted }}>
            Selected: <strong style={{ color: theme.text }}>{theme.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {companionList.map((id) => {
            const isSelected = activeCompanion === id;
            const defTheme = COMPANION_DEFAULT_THEMES[id];
            const companionNames: Record<CompanionThemeId, string> = {
              athena: "Athena",
              nova: "Nova",
              raven: "Raven",
              atlas: "Atlas",
              byte: "Byte",
              sage: "Sage",
            };

            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setCompanion(id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3.5 rounded-2xl border text-left flex flex-col items-center justify-between relative transition-all duration-200"
                style={{
                  backgroundColor: isSelected
                    ? theme.isLight ? "#ffffff" : "rgba(30, 41, 59, 0.90)"
                    : theme.surfaceMuted,
                  borderColor: isSelected ? theme.primary : theme.borderSubtle,
                  boxShadow: isSelected ? (theme.isLight ? theme.shadowMd : `0 0 25px ${theme.glow}`) : undefined,
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 h-4 w-4 rounded-full flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}

                <div
                  className="p-1 rounded-xl mb-2.5 border shadow-inner"
                  style={{
                    backgroundColor: theme.isLight ? "#f1f5f9" : "#020617",
                    borderColor: theme.borderSubtle,
                  }}
                >
                  <CompanionAvatar id={id} size={50} emotion="idle" />
                </div>

                <div className="text-center w-full">
                  <div className="text-xs font-bold truncate" style={{ color: theme.text }}>
                    {companionNames[id]}
                  </div>
                  <div className="text-[10px] font-medium truncate mt-0.5" style={{ color: theme.textMuted }}>
                    {defTheme.styleId === "oled-black"
                      ? "OLED"
                      : defTheme.styleId === "glass-aurora"
                      ? "Glass"
                      : defTheme.styleId === "material-dark"
                      ? "Material"
                      : defTheme.styleId === "midnight"
                      ? "Midnight"
                      : defTheme.styleId === "light"
                      ? "Light"
                      : "Pro Dark"}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 2: UI Style Presets (Surface Architecture)            */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-[11px] font-mono font-bold"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              2
            </span>
            <span>UI / Surface Style</span>
          </label>
          <span className="text-xs" style={{ color: theme.textMuted }}>
            Active: <strong style={{ color: theme.text }}>{UI_STYLE_PRESETS[activeStyle]?.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {styleList.map((styleId) => {
            const preset = UI_STYLE_PRESETS[styleId];
            const isSelected = activeStyle === styleId;
            const isRecommended = companionDefault.styleId === styleId;

            return (
              <button
                key={styleId}
                type="button"
                onClick={() => setStyle(styleId)}
                className="p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative group"
                style={{
                  backgroundColor: isSelected
                    ? theme.isLight ? "#ffffff" : "rgba(30, 41, 59, 0.90)"
                    : theme.surfaceMuted,
                  borderColor: isSelected ? theme.primary : theme.borderSubtle,
                  boxShadow: isSelected ? (theme.isLight ? theme.shadowMd : `0 0 20px ${theme.glow}`) : undefined,
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 h-4 w-4 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <SunMoon className="h-4 w-4" style={{ color: isSelected ? theme.primary : theme.textMuted }} />
                    <span className="text-sm font-bold truncate" style={{ color: theme.text }}>
                      {preset.name}
                    </span>
                  </div>

                  {isRecommended && (
                    <span
                      className="inline-block text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full mb-2 border"
                      style={{
                        backgroundColor: theme.primarySoft,
                        borderColor: theme.borderHighlight,
                        color: theme.textAccent,
                      }}
                    >
                      {theme.name} Pick
                    </span>
                  )}

                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: theme.textSecondary }}>
                    {preset.tagline}
                  </p>
                </div>

                {/* Surface swatch preview */}
                <div
                  className="mt-3 h-6 w-full rounded-lg border flex items-center px-2 text-[10px] font-mono justify-between"
                  style={{
                    backgroundColor: preset.surface,
                    borderColor: preset.border,
                    color: preset.text,
                  }}
                >
                  <span>surface</span>
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: preset.border }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 3: Accent Color Presets (Interactive Highlight)       */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-[11px] font-mono font-bold"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              3
            </span>
            <span>Accent Color</span>
          </label>
          <span className="text-xs" style={{ color: theme.textMuted }}>
            Active: <strong style={{ color: theme.text }}>{ACCENT_PRESETS[activeAccent]?.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {accentList.map((accentId) => {
            const preset = ACCENT_PRESETS[accentId];
            const isSelected = activeAccent === accentId;
            const isRecommended = companionDefault.accentId === accentId;

            return (
              <button
                key={accentId}
                type="button"
                onClick={() => setAccent(accentId)}
                className="p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-200 relative group"
                style={{
                  backgroundColor: isSelected
                    ? theme.isLight ? "#ffffff" : "rgba(30, 41, 59, 0.90)"
                    : theme.surfaceMuted,
                  borderColor: isSelected ? preset.primary : theme.borderSubtle,
                  boxShadow: isSelected ? `0 0 16px rgba(${preset.glowRgb}, 0.35)` : undefined,
                }}
              >
                {/* Color preview circle */}
                <div
                  className="h-9 w-9 rounded-full mb-2 flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
                </div>

                <div className="w-full">
                  <span className="text-xs font-bold block truncate" style={{ color: theme.text }}>
                    {preset.name}
                  </span>
                  {isRecommended && (
                    <span
                      className="text-[9px] font-mono font-bold uppercase block mt-0.5"
                      style={{ color: preset.primary }}
                    >
                      Default
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 4: Live Atmosphere Preview Sandbox                    */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-[11px] font-mono font-bold"
              style={{ backgroundColor: theme.primarySoft, color: theme.primary }}
            >
              4
            </span>
            <span>Live Workspace Preview</span>
          </label>

          <span className="text-xs font-mono" style={{ color: theme.textMuted }}>
            {theme.styleName} + {theme.accentName}
          </span>
        </div>

        <div
          className="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-xl"
          style={{
            borderColor: theme.border,
            backgroundColor: theme.surface,
            boxShadow: theme.isLight ? theme.shadowLg : `0 0 40px ${theme.glow}`,
          }}
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{
              backgroundColor: theme.primary,
              opacity: theme.isLight ? 0.04 : 0.20,
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{
              backgroundColor: theme.secondary,
              opacity: theme.isLight ? 0.03 : 0.15,
            }}
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="p-2 rounded-2xl border shadow-sm"
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.borderHighlight,
                  }}
                >
                  <CompanionAvatar id={activeCompanion} size={64} emotion="idle" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                      Active Companion
                    </span>
                    {isCustomized ? (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: theme.surfaceMuted,
                          borderColor: theme.borderSubtle,
                          color: theme.textSecondary,
                        }}
                      >
                        Custom Combination
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold"
                        style={{
                          backgroundColor: theme.primarySoft,
                          borderColor: theme.borderHighlight,
                          color: theme.textAccent,
                        }}
                      >
                        Recommended Default
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black" style={{ color: theme.text }}>
                    {theme.name}
                  </h3>
                  <p className="text-xs sm:text-sm mt-0.5" style={{ color: theme.textSecondary }}>
                    {theme.description}
                  </p>
                </div>
              </div>

              <div
                className="px-3.5 py-1.5 rounded-2xl text-xs font-bold border self-start sm:self-auto shadow-sm"
                style={{
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.borderHighlight,
                  color: theme.primary,
                }}
              >
                {theme.visualAtmosphere}
              </div>
            </div>

            {/* Interactive Sandbox Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Primary action preview */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
                    Primary Button
                  </span>
                  <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>
                    Gradient button with dynamic glow
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full h-11 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: theme.gradient,
                    boxShadow: theme.isLight ? theme.shadowSm : `0 4px 20px ${theme.glow}`,
                  }}
                >
                  <Zap className="h-4 w-4" />
                  <span>Execute Career Mission</span>
                </button>
              </div>

              {/* Progress Bar preview */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>
                    <span>Readiness Index</span>
                    <span className="font-mono text-base font-black" style={{ color: theme.primary }}>
                      82%
                    </span>
                  </div>
                  <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>
                    Target role hiring bar calibration
                  </p>
                </div>

                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: theme.isLight ? "#e2e8f0" : "#1e293b" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: "82%",
                      background: theme.progressGradient,
                      boxShadow: theme.isLight ? undefined : `0 0 10px ${theme.glow}`,
                    }}
                  />
                </div>
              </div>

              {/* Badge & Pill preview */}
              <div
                className="p-4 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.borderSubtle,
                }}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: theme.textMuted }}>
                    Interactive Accents
                  </span>
                  <p className="text-xs mb-4" style={{ color: theme.textSecondary }}>
                    Badges, pills, and active states
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="py-1.5 px-3 rounded-xl border text-center text-xs font-semibold shadow-xs"
                    style={{
                      borderColor: theme.borderHighlight,
                      backgroundColor: theme.primarySoft,
                      color: theme.primary,
                    }}
                  >
                    Active Milestone
                  </div>
                  <div
                    className="py-1.5 px-3 rounded-xl border text-center text-xs font-semibold shadow-xs"
                    style={{
                      borderColor: theme.borderSubtle,
                      backgroundColor: theme.surface,
                      color: theme.text,
                    }}
                  >
                    Verified Stack
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 5: Fine-Tuning Intensity Controls                     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Accent Intensity */}
        <div
          className="p-5 rounded-2xl border space-y-3"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4" style={{ color: theme.primary }} />
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
              Accent Saturation
            </label>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
            Adjusts the vibrancy of tinted surfaces, pills, and interactive hover feedback.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(["subtle", "balanced", "strong"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setAccentIntensity(level)}
                className="py-2 px-2 text-center rounded-xl text-xs font-semibold capitalize transition-all border"
                style={{
                  backgroundColor: accentIntensity === level ? theme.primary : theme.surface,
                  borderColor: accentIntensity === level ? theme.primary : theme.borderSubtle,
                  color: accentIntensity === level ? "#ffffff" : theme.textMuted,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Glow Intensity */}
        <div
          className="p-5 rounded-2xl border space-y-3"
          style={{
            backgroundColor: theme.surfaceMuted,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text }}>
              Atmospheric Glow
            </label>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
            Adjusts ambient backlight bloom, card shadow halos, and subtle focus glows.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(["off", "soft", "strong"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setGlowIntensity(level)}
                className="py-2 px-2 text-center rounded-xl text-xs font-semibold capitalize transition-all border"
                style={{
                  backgroundColor: glowIntensity === level ? theme.primary : theme.surface,
                  borderColor: glowIntensity === level ? theme.primary : theme.borderSubtle,
                  color: glowIntensity === level ? "#ffffff" : theme.textMuted,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

