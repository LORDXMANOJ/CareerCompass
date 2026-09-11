"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  CompanionThemeId,
  CompanionThemeTokens,
  UIStyleId,
  AccentColorId,
  AccentIntensity,
  GlowIntensity,
  ThemeMode,
  resolveTheme,
  generateThemeCssVariables,
  COMPANION_DEFAULT_THEMES,
  COMPANION_THEMES,
  UI_STYLE_PRESETS,
  ACCENT_PRESETS,
} from "@/constants/companion-themes";

export interface CompanionThemePreferences {
  mode?: ThemeMode;
  companionId: CompanionThemeId;
  styleId: UIStyleId;
  accentId: AccentColorId;
  accentIntensity: AccentIntensity;
  glowIntensity: GlowIntensity;
  isCustomized: boolean;
}

interface CompanionThemeContextType {
  mode: ThemeMode;
  activeCompanion: CompanionThemeId;
  activeStyle: UIStyleId;
  activeAccent: AccentColorId;
  theme: CompanionThemeTokens;
  previewCompanion: CompanionThemeId | null;
  previewStyle: UIStyleId | null;
  previewAccent: AccentColorId | null;
  accentIntensity: AccentIntensity;
  glowIntensity: GlowIntensity;
  isCustomized: boolean;

  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setCompanion: (id: CompanionThemeId) => void;
  setStyle: (id: UIStyleId) => void;
  setAccent: (id: AccentColorId) => void;
  setPreviewCompanion: (id: CompanionThemeId | null) => void;
  setPreviewStyle: (id: UIStyleId | null) => void;
  setPreviewAccent: (id: AccentColorId | null) => void;
  setAccentIntensity: (intensity: AccentIntensity) => void;
  setGlowIntensity: (intensity: GlowIntensity) => void;
  resetToCompanionDefault: () => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = "cc_theme_preferences_v2";
const MODE_STORAGE_KEY = "cc_theme_mode";
const DEFAULT_COMPANION: CompanionThemeId = "athena";

const CompanionThemeContext = createContext<CompanionThemeContextType | null>(null);

export function CompanionThemeProvider({
  children,
  initialCompanion = "athena",
}: {
  children: React.ReactNode;
  initialCompanion?: string;
}) {
  const normInitialCompanion = useMemo(() => {
    const norm = (initialCompanion?.toLowerCase() as CompanionThemeId) || DEFAULT_COMPANION;
    return COMPANION_THEMES[norm] ? norm : DEFAULT_COMPANION;
  }, [initialCompanion]);

  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [activeCompanion, setActiveCompanionState] = useState<CompanionThemeId>(normInitialCompanion);
  const [activeStyle, setActiveStyleState] = useState<UIStyleId>(() => {
    return COMPANION_DEFAULT_THEMES[normInitialCompanion]?.styleId || "professional-dark";
  });
  const [activeAccent, setActiveAccentState] = useState<AccentColorId>(() => {
    return COMPANION_DEFAULT_THEMES[normInitialCompanion]?.accentId || "burgundy";
  });
  const [accentIntensity, setAccentIntensityState] = useState<AccentIntensity>("balanced");
  const [glowIntensity, setGlowIntensityState] = useState<GlowIntensity>("soft");
  const [isCustomized, setIsCustomizedState] = useState<boolean>(false);

  // Temporary preview states (e.g. while hovering in Settings)
  const [previewCompanion, setPreviewCompanion] = useState<CompanionThemeId | null>(null);
  const [previewStyle, setPreviewStyle] = useState<UIStyleId | null>(null);
  const [previewAccent, setPreviewAccent] = useState<AccentColorId | null>(null);

  // Load user saved preferences from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      // 1. Check dedicated theme mode storage key
      const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
      if (savedMode === "light" || savedMode === "dark") {
        setModeState(savedMode);
      }

      // 2. Check full preferences object
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Partial<CompanionThemePreferences> = JSON.parse(saved);
        if (!savedMode && (parsed.mode === "light" || parsed.mode === "dark")) {
          setModeState(parsed.mode);
        }
        if (parsed.companionId && COMPANION_THEMES[parsed.companionId]) {
          setActiveCompanionState(parsed.companionId);
        }
        if (parsed.styleId && UI_STYLE_PRESETS[parsed.styleId]) {
          setActiveStyleState(parsed.styleId);
        }
        if (parsed.accentId && ACCENT_PRESETS[parsed.accentId]) {
          setActiveAccentState(parsed.accentId);
        }
        if (parsed.accentIntensity) setAccentIntensityState(parsed.accentIntensity);
        if (parsed.glowIntensity) setGlowIntensityState(parsed.glowIntensity);
        if (parsed.isCustomized !== undefined) setIsCustomizedState(parsed.isCustomized);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const effectiveCompanion = previewCompanion || activeCompanion;
  const effectiveStyle = previewStyle || activeStyle;
  const effectiveAccent = previewAccent || activeAccent;

  const theme = useMemo(() => {
    return resolveTheme(effectiveCompanion, {
      mode,
      styleId: effectiveStyle,
      accentId: effectiveAccent,
      accentIntensity,
      glowIntensity,
    });
  }, [effectiveCompanion, mode, effectiveStyle, effectiveAccent, accentIntensity, glowIntensity]);

  // Apply CSS variables and dataset attributes to root document
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Apply class and data-theme to HTML root
    if (mode === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    }

    root.setAttribute("data-companion", effectiveCompanion);
    root.setAttribute("data-style", effectiveStyle);
    root.setAttribute("data-accent", effectiveAccent);

    const cssVars = generateThemeCssVariables(theme);
    Object.entries(cssVars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [theme, mode, effectiveCompanion, effectiveStyle, effectiveAccent]);

  const saveToStorage = useCallback(
    (prefs: CompanionThemePreferences) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch {
        // Ignore localStorage error
      }
    },
    []
  );

  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      try {
        localStorage.setItem(MODE_STORAGE_KEY, nextMode);
      } catch {
        // Ignore localStorage error
      }
      saveToStorage({
        mode: nextMode,
        companionId: activeCompanion,
        styleId: activeStyle,
        accentId: activeAccent,
        accentIntensity,
        glowIntensity,
        isCustomized,
      });
    },
    [activeCompanion, activeStyle, activeAccent, accentIntensity, glowIntensity, isCustomized, saveToStorage]
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const setCompanion = useCallback(
    (id: CompanionThemeId) => {
      const validId = COMPANION_THEMES[id] ? id : DEFAULT_COMPANION;
      setActiveCompanionState(validId);

      // If the user hasn't explicitly customized their style & accent in Settings,
      // adopt the companion's recommended default combination
      let nextStyle = activeStyle;
      let nextAccent = activeAccent;

      if (!isCustomized) {
        const defaultPair = COMPANION_DEFAULT_THEMES[validId];
        if (defaultPair) {
          nextStyle = defaultPair.styleId;
          nextAccent = defaultPair.accentId;
          setActiveStyleState(nextStyle);
          setActiveAccentState(nextAccent);
        }
      }

      saveToStorage({
        mode,
        companionId: validId,
        styleId: nextStyle,
        accentId: nextAccent,
        accentIntensity,
        glowIntensity,
        isCustomized,
      });
    },
    [mode, activeStyle, activeAccent, isCustomized, accentIntensity, glowIntensity, saveToStorage]
  );

  const setStyle = useCallback(
    (styleId: UIStyleId) => {
      if (!UI_STYLE_PRESETS[styleId]) return;
      setActiveStyleState(styleId);
      setIsCustomizedState(true);
      saveToStorage({
        mode,
        companionId: activeCompanion,
        styleId,
        accentId: activeAccent,
        accentIntensity,
        glowIntensity,
        isCustomized: true,
      });
    },
    [mode, activeCompanion, activeAccent, accentIntensity, glowIntensity, saveToStorage]
  );

  const setAccent = useCallback(
    (accentId: AccentColorId) => {
      if (!ACCENT_PRESETS[accentId]) return;
      setActiveAccentState(accentId);
      setIsCustomizedState(true);
      saveToStorage({
        mode,
        companionId: activeCompanion,
        styleId: activeStyle,
        accentId,
        accentIntensity,
        glowIntensity,
        isCustomized: true,
      });
    },
    [mode, activeCompanion, activeStyle, accentIntensity, glowIntensity, saveToStorage]
  );

  const setAccentIntensity = useCallback(
    (intensity: AccentIntensity) => {
      setAccentIntensityState(intensity);
      saveToStorage({
        mode,
        companionId: activeCompanion,
        styleId: activeStyle,
        accentId: activeAccent,
        accentIntensity: intensity,
        glowIntensity,
        isCustomized,
      });
    },
    [mode, activeCompanion, activeStyle, activeAccent, glowIntensity, isCustomized, saveToStorage]
  );

  const setGlowIntensity = useCallback(
    (intensity: GlowIntensity) => {
      setGlowIntensityState(intensity);
      saveToStorage({
        mode,
        companionId: activeCompanion,
        styleId: activeStyle,
        accentId: activeAccent,
        accentIntensity,
        glowIntensity: intensity,
        isCustomized,
      });
    },
    [mode, activeCompanion, activeStyle, activeAccent, accentIntensity, isCustomized, saveToStorage]
  );

  const resetToCompanionDefault = useCallback(() => {
    const defaultPair = COMPANION_DEFAULT_THEMES[activeCompanion] || COMPANION_DEFAULT_THEMES.athena;
    setActiveStyleState(defaultPair.styleId);
    setActiveAccentState(defaultPair.accentId);
    setAccentIntensityState("balanced");
    setGlowIntensityState("soft");
    setIsCustomizedState(false);
    saveToStorage({
      mode,
      companionId: activeCompanion,
      styleId: defaultPair.styleId,
      accentId: defaultPair.accentId,
      accentIntensity: "balanced",
      glowIntensity: "soft",
      isCustomized: false,
    });
  }, [mode, activeCompanion, saveToStorage]);

  const resetToDefault = useCallback(() => {
    setModeState("dark");
    setActiveCompanionState(DEFAULT_COMPANION);
    const defaultPair = COMPANION_DEFAULT_THEMES[DEFAULT_COMPANION];
    setActiveStyleState(defaultPair.styleId);
    setActiveAccentState(defaultPair.accentId);
    setAccentIntensityState("balanced");
    setGlowIntensityState("soft");
    setIsCustomizedState(false);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, "dark");
    } catch {}
    saveToStorage({
      mode: "dark",
      companionId: DEFAULT_COMPANION,
      styleId: defaultPair.styleId,
      accentId: defaultPair.accentId,
      accentIntensity: "balanced",
      glowIntensity: "soft",
      isCustomized: false,
    });
  }, [saveToStorage]);

  const value = useMemo(
    () => ({
      mode,
      activeCompanion,
      activeStyle,
      activeAccent,
      theme,
      previewCompanion,
      previewStyle,
      previewAccent,
      accentIntensity,
      glowIntensity,
      isCustomized,
      setMode,
      toggleMode,
      setCompanion,
      setStyle,
      setAccent,
      setPreviewCompanion,
      setPreviewStyle,
      setPreviewAccent,
      setAccentIntensity,
      setGlowIntensity,
      resetToCompanionDefault,
      resetToDefault,
    }),
    [
      mode,
      activeCompanion,
      activeStyle,
      activeAccent,
      theme,
      previewCompanion,
      previewStyle,
      previewAccent,
      accentIntensity,
      glowIntensity,
      isCustomized,
      setMode,
      toggleMode,
      setCompanion,
      setStyle,
      setAccent,
      setPreviewCompanion,
      setPreviewStyle,
      setPreviewAccent,
      setAccentIntensity,
      setGlowIntensity,
      resetToCompanionDefault,
      resetToDefault,
    ]
  );

  return (
    <CompanionThemeContext.Provider value={value}>
      {children}
    </CompanionThemeContext.Provider>
  );
}

export function useCompanionTheme() {
  const ctx = useContext(CompanionThemeContext);
  if (!ctx) {
    const fallbackTheme = resolveTheme("athena");
    return {
      mode: "dark" as ThemeMode,
      activeCompanion: "athena" as CompanionThemeId,
      activeStyle: "professional-dark" as UIStyleId,
      activeAccent: "burgundy" as AccentColorId,
      theme: fallbackTheme,
      previewCompanion: null,
      previewStyle: null,
      previewAccent: null,
      accentIntensity: "balanced" as AccentIntensity,
      glowIntensity: "soft" as GlowIntensity,
      isCustomized: false,
      setMode: () => {},
      toggleMode: () => {},
      setCompanion: () => {},
      setStyle: () => {},
      setAccent: () => {},
      setPreviewCompanion: () => {},
      setPreviewStyle: () => {},
      setPreviewAccent: () => {},
      setAccentIntensity: () => {},
      setGlowIntensity: () => {},
      resetToCompanionDefault: () => {},
      resetToDefault: () => {},
    };
  }
  return ctx;
}
