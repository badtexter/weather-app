import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppThemeName = "light" | "dark";

export const THEME_KEY = "app.theme";

// data-terminal: dense, monospace numbers, cards barely lighter than the ground,
// one blue used only as a 1px selection line and on the main data figure.
const themeColors = {
  light: {
    ground: "#F2F3F5",
    surface: "#FFFFFF",
    raised: "#E8E9EC",
    border: "#DEDFE2",
    textPrimary: "#14151A",
    textSecondary: "#5B5D63",
    textTertiary: "#8C8E93",
    accent: "#1D63B8",
    tabBackground: "#FFFFFF",
    tabBorder: "#DEDFE2",
  },
  dark: {
    ground: "#0B1020",
    surface: "#121832",
    raised: "#1B2340",
    border: "#283158",
    textPrimary: "#ECEEF5",
    textSecondary: "#9AA0BE",
    textTertiary: "#70769A",
    accent: "#FFFFFF",
    tabBackground: "#121832",
    tabBorder: "#283158",
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
