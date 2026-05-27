import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppThemeName = "light" | "dark";

export const THEME_KEY = "app.theme";

const themeColors = {
  light: {
    background: "#F8F9FC",
    gradient: ["#F3F0FF", "#FFFFFF", "#EAF6FF"] as const,
    card: "#FFFFFF",
    search: "rgba(255,255,255,0.9)",
    textPrimary: "#111111",
    textSecondary: "#8E8E93",
    textTertiary: "#C7C7CC",
    border: "#E9E9EF",
    accent: "#0A84FF",
    secondaryAccent: "#5C9CE6",
    shadow: "#000000",
    tabBackground: "#FFFFFF",
    tabBorder: "#E5E5EA",
  },
  dark: {
    background: "#0D1117",
    gradient: ["#101624", "#0D1117", "#111B22"] as const,
    card: "#171D26",
    search: "rgba(23,29,38,0.94)",
    textPrimary: "#F4F7FB",
    textSecondary: "#A5AFBC",
    textTertiary: "#3A4452",
    border: "#263140",
    accent: "#69A7FF",
    secondaryAccent: "#7DB7FF",
    shadow: "#000000",
    tabBackground: "#121821",
    tabBorder: "#263140",
  },
};

type AppThemeColors = (typeof themeColors)[AppThemeName];

type AppThemeContextValue = {
  theme: AppThemeName;
  isDark: boolean;
  colors: AppThemeColors;
  setTheme: (theme: AppThemeName) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppThemeName>("light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(savedTheme => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      }
    });
  }, []);

  const setTheme = async (nextTheme: AppThemeName) => {
    setThemeState(nextTheme);
    await AsyncStorage.setItem(THEME_KEY, nextTheme);
  };

  const toggleTheme = async () => {
    await setTheme(theme === "light" ? "dark" : "light");
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      colors: themeColors[theme],
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(AppThemeContext);

  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return value;
}
