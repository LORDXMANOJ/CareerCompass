export type CompanionThemeId = "athena" | "nova" | "raven" | "atlas" | "byte" | "sage";
export type CompanionId = CompanionThemeId;

export type UIStyleId =
  | "oled-black"
  | "professional-dark"
  | "material-dark"
  | "glass-aurora"
  | "midnight"
  | "light";

export type AccentColorId =
  | "burgundy"
  | "violet"
  | "cyan"
  | "emerald"
  | "orange"
  | "blue"
  | "crimson"
  | "gold"
  | "rose";

export type AccentIntensity = "subtle" | "balanced" | "strong";
export type GlowIntensity = "off" | "soft" | "strong";

// ---------------------------------------------------------------------------
// UI Style Preset Definition
// ---------------------------------------------------------------------------
export interface UIStylePreset {
  id: UIStyleId;
  name: string;
  description: string;
  tagline: string;
  isLight: boolean;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderSubtle: string;
  borderHighlight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  blur: string;
  glowFactor: number; // 0 to 1 multiplier for accent glow
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export const UI_STYLE_PRESETS: Record<UIStyleId, UIStylePreset> = {
  "oled-black": {
    id: "oled-black",
    name: "OLED Black",
    tagline: "Pure black · Zero light bleed · Maximum contrast",
    description: "Pitch black backdrop with deep obsidian cards, sharp borders, and high contrast developer ergonomics.",
    isLight: false,
    background: "#000000",
    backgroundSecondary: "#050505",
    surface: "rgba(10, 10, 10, 0.95)",
    surfaceElevated: "rgba(20, 20, 20, 0.98)",
    surfaceMuted: "rgba(15, 15, 15, 0.8)",
    border: "rgba(255, 255, 255, 0.09)",
    borderSubtle: "rgba(255, 255, 255, 0.05)",
    borderHighlight: "rgba(255, 255, 255, 0.22)",
    text: "#ffffff",
    textSecondary: "#d4d4d4",
    textMuted: "#888888",
    blur: "none",
    glowFactor: 0.18,
    shadowSm: "0 2px 8px rgba(0, 0, 0, 0.5)",
    shadowMd: "0 8px 24px rgba(0, 0, 0, 0.6)",
    shadowLg: "0 16px 40px rgba(0, 0, 0, 0.7)",
  },
  "professional-dark": {
    id: "professional-dark",
    name: "Professional Dark",
    tagline: "Charcoal graphite · Clean shadows · Enterprise focus",
    description: "Dark charcoal graphite surfaces with restrained borders, refined shadows, and a serious professional appearance.",
    isLight: false,
    background: "#0b0f17",
    backgroundSecondary: "#111622",
    surface: "rgba(17, 24, 39, 0.88)",
    surfaceElevated: "rgba(30, 41, 59, 0.92)",
    surfaceMuted: "rgba(15, 23, 42, 0.6)",
    border: "rgba(51, 65, 85, 0.55)",
    borderSubtle: "rgba(30, 41, 59, 0.4)",
    borderHighlight: "rgba(100, 116, 139, 0.65)",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    blur: "blur(12px)",
    glowFactor: 0.28,
    shadowSm: "0 2px 8px rgba(0, 0, 0, 0.3)",
    shadowMd: "0 8px 24px rgba(0, 0, 0, 0.4)",
    shadowLg: "0 16px 40px rgba(0, 0, 0, 0.5)",
  },
  "material-dark": {
    id: "material-dark",
    name: "Material Dark",
    tagline: "Layered elevation · Structured hierarchy · Crisp edges",
    description: "Material Design-inspired dark surfaces with distinct elevation levels, clear component hierarchy, and sharp edges.",
    isLight: false,
    background: "#121212",
    backgroundSecondary: "#181818",
    surface: "rgba(30, 30, 30, 0.92)",
    surfaceElevated: "rgba(44, 44, 44, 0.96)",
    surfaceMuted: "rgba(24, 24, 24, 0.8)",
    border: "rgba(255, 255, 255, 0.08)",
    borderSubtle: "rgba(255, 255, 255, 0.04)",
    borderHighlight: "rgba(255, 255, 255, 0.24)",
    text: "#f5f5f5",
    textSecondary: "#d4d4d4",
    textMuted: "#a3a3a3",
    blur: "blur(8px)",
    glowFactor: 0.22,
    shadowSm: "0 2px 6px rgba(0, 0, 0, 0.35)",
    shadowMd: "0 6px 20px rgba(0, 0, 0, 0.45)",
    shadowLg: "0 12px 32px rgba(0, 0, 0, 0.55)",
  },
  "glass-aurora": {
    id: "glass-aurora",
    name: "Glass / Aurora",
    tagline: "Frosted glass · Atmospheric bloom · Ethereal depth",
    description: "Translucent frosted glass cards with soft ambient backlighting and smooth backdrop diffusion.",
    isLight: false,
    background: "#080d1a",
    backgroundSecondary: "#0e1629",
    surface: "rgba(15, 23, 42, 0.62)",
    surfaceElevated: "rgba(30, 41, 59, 0.78)",
    surfaceMuted: "rgba(15, 23, 42, 0.45)",
    border: "rgba(148, 163, 184, 0.16)",
    borderSubtle: "rgba(148, 163, 184, 0.08)",
    borderHighlight: "rgba(148, 163, 184, 0.40)",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    blur: "blur(20px)",
    glowFactor: 0.48,
    shadowSm: "0 4px 12px rgba(0, 0, 0, 0.3)",
    shadowMd: "0 12px 32px rgba(0, 0, 0, 0.45)",
    shadowLg: "0 20px 50px rgba(0, 0, 0, 0.6)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    tagline: "Deep navy · Oceanic atmosphere · High-tech intelligence",
    description: "Deep oceanic navy-black background with subtle atmospheric lighting and technical blue surfaces.",
    isLight: false,
    background: "#030712",
    backgroundSecondary: "#081120",
    surface: "rgba(10, 22, 40, 0.78)",
    surfaceElevated: "rgba(15, 32, 60, 0.88)",
    surfaceMuted: "rgba(8, 17, 32, 0.6)",
    border: "rgba(30, 58, 138, 0.38)",
    borderSubtle: "rgba(30, 58, 138, 0.18)",
    borderHighlight: "rgba(59, 130, 246, 0.50)",
    text: "#f0fdf4",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    blur: "blur(16px)",
    glowFactor: 0.38,
    shadowSm: "0 2px 8px rgba(0, 0, 0, 0.35)",
    shadowMd: "0 8px 24px rgba(0, 0, 0, 0.48)",
    shadowLg: "0 16px 40px rgba(0, 0, 0, 0.6)",
  },
  light: {
    id: "light",
    name: "Light / Warm Neutral",
    tagline: "Warm neutral · Deep burgundy · Crisp focus",
    description: "Clean modern light SaaS design system with multi-layer porcelain surfaces, warm neutral #E3E2DF undertones, deep burgundy typography, and crisp brand highlights.",
    isLight: true,
    background: "#fcfbf9",
    backgroundSecondary: "#E3E2DF",
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    surfaceMuted: "#f5f4f0",
    border: "#dedcd7",
    borderSubtle: "#eae9e5",
    borderHighlight: "rgba(154, 23, 80, 0.35)",
    text: "#1a0a10",
    textSecondary: "#4a3840",
    textMuted: "#78646c",
    blur: "none",
    glowFactor: 0.05, // Virtually 0 to eliminate color fog cloud
    shadowSm: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
    shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
  },
};

// ---------------------------------------------------------------------------
// Accent Color Preset Definition
// ---------------------------------------------------------------------------
export interface AccentPreset {
  id: AccentColorId;
  name: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  secondary: string;
  accent: string;
  textAccent: string;
  gradient: string;
  progressGradient: string;
  glowRgb: string; // "139, 92, 246"
}

export const ACCENT_PRESETS: Record<AccentColorId, AccentPreset> = {
  burgundy: {
    id: "burgundy",
    name: "Burgundy (Brand)",
    primary: "#5D001E",
    primaryHover: "#9A1750",
    primarySoft: "rgba(154, 23, 80, 0.14)",
    secondary: "#9A1750",
    accent: "#EE4C7C",
    textAccent: "#EE4C7C",
    gradient: "linear-gradient(135deg, #5D001E 0%, #9A1750 50%, #EE4C7C 100%)",
    progressGradient: "linear-gradient(90deg, #5D001E, #9A1750, #EE4C7C)",
    glowRgb: "238, 76, 124",
  },
  violet: {
    id: "violet",
    name: "Violet",
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    primarySoft: "rgba(139, 92, 246, 0.15)",
    secondary: "#a855f7",
    accent: "#c084fc",
    textAccent: "#c4b5fd",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #c084fc 100%)",
    progressGradient: "linear-gradient(90deg, #7c3aed, #8b5cf6, #c084fc)",
    glowRgb: "139, 92, 246",
  },
  cyan: {
    id: "cyan",
    name: "Cyan",
    primary: "#06b6d4",
    primaryHover: "#0891b2",
    primarySoft: "rgba(6, 182, 212, 0.15)",
    secondary: "#0284c7",
    accent: "#22d3ee",
    textAccent: "#67e8f9",
    gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)",
    progressGradient: "linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)",
    glowRgb: "6, 182, 212",
  },
  emerald: {
    id: "emerald",
    name: "Emerald",
    primary: "#10b981",
    primaryHover: "#059669",
    primarySoft: "rgba(16, 185, 129, 0.15)",
    secondary: "#047857",
    accent: "#34d399",
    textAccent: "#6ee7b7",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    progressGradient: "linear-gradient(90deg, #059669, #10b981, #34d399)",
    glowRgb: "16, 185, 129",
  },
  orange: {
    id: "orange",
    name: "Orange",
    primary: "#f97316",
    primaryHover: "#ea580c",
    primarySoft: "rgba(249, 115, 22, 0.15)",
    secondary: "#c2410c",
    accent: "#fb923c",
    textAccent: "#fdba74",
    gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
    progressGradient: "linear-gradient(90deg, #ea580c, #f97316, #fb923c)",
    glowRgb: "249, 115, 22",
  },
  blue: {
    id: "blue",
    name: "Blue",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primarySoft: "rgba(59, 130, 246, 0.15)",
    secondary: "#1d4ed8",
    accent: "#60a5fa",
    textAccent: "#93c5fd",
    gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)",
    progressGradient: "linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)",
    glowRgb: "59, 130, 246",
  },
  crimson: {
    id: "crimson",
    name: "Crimson",
    primary: "#e11d48",
    primaryHover: "#be123c",
    primarySoft: "rgba(225, 29, 72, 0.15)",
    secondary: "#9f1239",
    accent: "#f43f5e",
    textAccent: "#fda4af",
    gradient: "linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)",
    progressGradient: "linear-gradient(90deg, #be123c, #e11d48, #f43f5e)",
    glowRgb: "225, 29, 72",
  },
  gold: {
    id: "gold",
    name: "Gold",
    primary: "#eab308",
    primaryHover: "#ca8a04",
    primarySoft: "rgba(234, 179, 8, 0.15)",
    secondary: "#a16207",
    accent: "#facc15",
    textAccent: "#fde047",
    gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #facc15 100%)",
    progressGradient: "linear-gradient(90deg, #ca8a04, #eab308, #facc15)",
    glowRgb: "234, 179, 8",
  },
  rose: {
    id: "rose",
    name: "Rose",
    primary: "#f43f5e",
    primaryHover: "#e11d48",
    primarySoft: "rgba(244, 63, 94, 0.15)",
    secondary: "#be123c",
    accent: "#fb7185",
    textAccent: "#fecdd3",
    gradient: "linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)",
    progressGradient: "linear-gradient(90deg, #e11d48, #f43f5e, #fb7185)",
    glowRgb: "244, 63, 94",
  },
};

// ---------------------------------------------------------------------------
// Companion Default Recommended Combinations
// ---------------------------------------------------------------------------
export const COMPANION_DEFAULT_THEMES: Record<
  CompanionThemeId,
  {
    styleId: UIStyleId;
    accentId: AccentColorId;
    label: string;
    description: string;
  }
> = {
  athena: {
    styleId: "professional-dark",
    accentId: "burgundy",
    label: "Professional Dark · Burgundy",
    description: "Structured, calm, and analytical. Focuses on systematic milestones and deep conceptual mastery.",
  },
  nova: {
    styleId: "glass-aurora",
    accentId: "cyan",
    label: "Glass / Aurora · Cyan",
    description: "Scrappy, energetic, and ambitious. Emphasizes rapid prototypes and deploying code to production.",
  },
  atlas: {
    styleId: "midnight",
    accentId: "blue",
    label: "Midnight · Blue",
    description: "Pragmatic, disciplined, and industry-oriented. Emphasizes clean production code and dependable systems.",
  },
  byte: {
    styleId: "material-dark",
    accentId: "emerald",
    label: "Material Dark · Emerald",
    description: "Curious, hands-on, and code-first. Loves open source, terminal tooling, and debugging tricky problems.",
  },
  sage: {
    styleId: "professional-dark",
    accentId: "gold",
    label: "Professional Dark · Gold",
    description: "Patient, holistic, and growth-oriented. Balances interview readiness with sustainable career resilience.",
  },
  raven: {
    styleId: "oled-black",
    accentId: "crimson",
    label: "OLED Black · Crimson",
    description: "Direct, competitive, and uncompromising. Targets elite FAANG and Tier-1 engineering bars.",
  },
};

// ---------------------------------------------------------------------------
// Unified Theme Tokens
// ---------------------------------------------------------------------------
export interface CompanionThemeTokens {
  id: CompanionThemeId;
  name: string;
  personalityLabel: string;
  visualAtmosphere: string;
  description: string;

  // Combination Meta
  styleId: UIStyleId;
  styleName: string;
  accentId: AccentColorId;
  accentName: string;

  // Primary Palette
  primary: string;
  primaryHover: string;
  primarySoft: string;
  secondary: string;
  accent: string;

  // Background & Surfaces
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  isLight: boolean;

  // Borders & Dividers
  border: string;
  borderSubtle: string;
  borderHighlight: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;

  // Visual Effects & Elevation
  glow: string;
  gradient: string;
  selection: string;
  progressGradient: string;
  blur: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;

  // Semantic
  success: string;
  warning: string;
  danger: string;

  // Global Theme Mode
  mode: ThemeMode;
}

export type ThemeMode = "dark" | "light";

export interface CompanionThemeCustomization {
  mode?: ThemeMode;
  styleId?: UIStyleId;
  accentId?: AccentColorId;
  accentIntensity?: AccentIntensity;
  glowIntensity?: GlowIntensity;
}

/**
 * Resolves the final unified theme tokens based on companion, UI style, and accent preset.
 */
export function resolveTheme(
  companionId: string,
  customization?: CompanionThemeCustomization
): CompanionThemeTokens {
  const normCompId = (companionId?.toLowerCase() as CompanionThemeId) || "athena";
  const defaultMapping = COMPANION_DEFAULT_THEMES[normCompId] || COMPANION_DEFAULT_THEMES.athena;

  // Global mode: "dark" or "light" (defaults to "dark")
  const mode: ThemeMode =
    customization?.mode || (customization?.styleId === "light" ? "light" : "dark");
  const isLight = mode === "light";

  // When global mode is light, surfaces use the light SaaS preset
  // When global mode is dark, use chosen dark style (fallback from "light" to default dark style)
  let styleId: UIStyleId = customization?.styleId || defaultMapping.styleId;
  if (isLight) {
    styleId = "light";
  } else if (styleId === "light") {
    styleId = defaultMapping.styleId === "light" ? "professional-dark" : defaultMapping.styleId;
  }

  const accentId: AccentColorId = customization?.accentId || defaultMapping.accentId;

  const style = UI_STYLE_PRESETS[styleId] || (isLight ? UI_STYLE_PRESETS["light"] : UI_STYLE_PRESETS["professional-dark"]);
  const accent = ACCENT_PRESETS[accentId] || ACCENT_PRESETS["burgundy"];

  // Handle glow intensity
  let glowOpacity = style.glowFactor;
  if (customization?.glowIntensity === "off") {
    glowOpacity = 0;
  } else if (customization?.glowIntensity === "soft") {
    glowOpacity = style.glowFactor * 0.7;
  } else if (customization?.glowIntensity === "strong") {
    glowOpacity = Math.min(style.glowFactor * 1.5, 0.65);
  }
  const glow = glowOpacity === 0 ? "transparent" : `rgba(${accent.glowRgb}, ${glowOpacity.toFixed(2)})`;

  // Handle accent intensity for primarySoft
  let primarySoft = accent.primarySoft;
  if (style.isLight) {
    primarySoft = `rgba(${accent.glowRgb}, 0.10)`;
  } else if (customization?.accentIntensity === "subtle") {
    primarySoft = `rgba(${accent.glowRgb}, 0.08)`;
  } else if (customization?.accentIntensity === "strong") {
    primarySoft = `rgba(${accent.glowRgb}, 0.24)`;
  }

  // Border highlight carries an accent color tint for visual cohesion
  const borderHighlight = style.isLight
    ? `rgba(${accent.glowRgb}, 0.35)`
    : `rgba(${accent.glowRgb}, 0.42)`;

  // Text accent for light mode should be primary accent for legibility against white
  const textAccent = style.isLight ? accent.primary : accent.textAccent;

  const companionNames: Record<CompanionThemeId, string> = {
    athena: "Athena",
    nova: "Nova",
    raven: "Raven",
    atlas: "Atlas",
    byte: "Byte",
    sage: "Sage",
  };

  const companionPersonas: Record<CompanionThemeId, string> = {
    athena: "Strategic & Academic",
    nova: "Energy & Momentum",
    raven: "Competitive & Direct",
    atlas: "Systems & Architecture",
    byte: "Curiosity & Open Source",
    sage: "Mindset & Longevity",
  };

  return {
    mode,
    id: normCompId,
    name: companionNames[normCompId] || "Mentor",
    personalityLabel: companionPersonas[normCompId] || "AI Mentor",
    visualAtmosphere: `${style.name} · ${accent.name}`,
    description: defaultMapping.description,

    styleId,
    styleName: style.name,
    accentId,
    accentName: accent.name,

    primary: accent.primary,
    primaryHover: accent.primaryHover,
    primarySoft,
    secondary: accent.secondary,
    accent: accent.accent,

    background: style.background,
    backgroundSecondary: style.backgroundSecondary,
    surface: style.surface,
    surfaceElevated: style.surfaceElevated,
    surfaceMuted: style.surfaceMuted,
    isLight: style.isLight,

    border: style.border,
    borderSubtle: style.borderSubtle,
    borderHighlight,

    text: style.text,
    textSecondary: style.textSecondary,
    textMuted: style.textMuted,
    textAccent,

    glow,
    gradient: accent.gradient,
    selection: `rgba(${accent.glowRgb}, 0.18)`,
    progressGradient: accent.progressGradient,
    blur: style.blur,
    shadowSm: style.shadowSm,
    shadowMd: style.shadowMd,
    shadowLg: style.shadowLg,

    success: style.isLight ? "#059669" : "#10b981",
    warning: style.isLight ? "#d97706" : "#eab308",
    danger: style.isLight ? "#dc2626" : "#ef4444",
  };
}

/**
 * Backward compatibility helper for existing code calling getCompanionTheme.
 */
export function getCompanionTheme(
  companionId: string,
  customization?: CompanionThemeCustomization
): CompanionThemeTokens {
  return resolveTheme(companionId, customization);
}

/**
 * Pre-computed COMPANION_THEMES map for backward compatibility.
 */
export const COMPANION_THEMES: Record<CompanionThemeId, CompanionThemeTokens> = {
  athena: resolveTheme("athena"),
  nova: resolveTheme("nova"),
  raven: resolveTheme("raven"),
  atlas: resolveTheme("atlas"),
  byte: resolveTheme("byte"),
  sage: resolveTheme("sage"),
};

/**
 * Generates an object of CSS variables representing the resolved theme.
 */
export function generateThemeCssVariables(theme: CompanionThemeTokens): Record<string, string> {
  return {
    "--cc-primary": theme.primary,
    "--cc-primary-hover": theme.primaryHover,
    "--cc-primary-soft": theme.primarySoft,
    "--cc-secondary": theme.secondary,
    "--cc-accent": theme.accent,
    "--cc-accent-soft": theme.isLight ? "rgba(238, 76, 124, 0.12)" : "rgba(238, 76, 124, 0.18)",
    "--cc-soft": "#E3AFBC",
    "--cc-neutral-light": "#E3E2DF",
    "--cc-background": theme.background,
    "--cc-bg": theme.background,
    "--cc-background-secondary": theme.backgroundSecondary,
    "--cc-bg-secondary": theme.backgroundSecondary,
    "--cc-surface": theme.surface,
    "--cc-surface-elevated": theme.surfaceElevated,
    "--cc-surface-muted": theme.surfaceMuted,
    "--cc-border": theme.border,
    "--cc-border-subtle": theme.borderSubtle,
    "--cc-border-highlight": theme.borderHighlight,
    "--cc-text": theme.text,
    "--cc-text-secondary": theme.textSecondary,
    "--cc-text-muted": theme.textMuted,
    "--cc-text-accent": theme.textAccent,
    "--cc-glow": theme.glow,
    "--cc-gradient": theme.gradient,
    "--cc-selection": theme.selection,
    "--cc-progress": theme.progressGradient,
    "--cc-success": theme.success,
    "--cc-warning": theme.warning,
    "--cc-danger": theme.danger,
    "--cc-shadow-sm": theme.shadowSm,
    "--cc-shadow-md": theme.shadowMd,
    "--cc-shadow-lg": theme.shadowLg,
    "--cc-is-light": theme.isLight ? "1" : "0",
    "--cc-mode": theme.mode,
  };
}
