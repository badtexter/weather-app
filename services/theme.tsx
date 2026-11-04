import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppThemeName = "light" | "dark";

export const THEME_KEY = "app.theme";

// accent-ladder: the full blue only on small marks (the main figure, a badge,
// the active row's icon); its pale tint does the area work (selected rows,
// badges). Everything else stays plain ink on a near-white ground.
const themeColors = {
  light: {
    ground: "#F7FAFE",
    surface: "#FFFFFF",
    raised: "#EAF2FE",
    border: "#E5E7EB",
    textPrimary: "#111827",
    textSecondary: "#5F6672",
    textTertiary: "#9CA3AF",
    accent: "#2F6FED",
    accentInk: "#0B4A8F",
    tabBackground: "#FFFFFF",
    tabBorder: "#E5E7EB",
  },
  dark: {
    ground: "#101521",
    surface: "#171D2C",
    raised: "#1C2740",
    border: "#28324A",
    textPrimary: "#F3F5FA",
    textSecondary: "#A7AFC2",
    textTertiary: "#6E7690",
    accent: "#5B9BFF",
    accentInk: "#BFD9FF",
    tabBackground: "#171D2C",
    tabBorder: "#28324A",
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
