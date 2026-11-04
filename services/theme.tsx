import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppThemeName = "light" | "dark";

export const THEME_KEY = "app.theme";

// "Sicily" palette: deep blue #1D59BB, sky blue #76B9FF, pale gold #FEF3B3,
// amber #FEBD19. Blue is the one functional accent (the full strength only on
// small marks — the main figure, the active row's ink); amber is the single
// secondary highlight, reserved for the rain-chance badge.
const themeColors = {
  light: {
    ground: "#FBFAF5",
    surface: "#FFFFFF",
    raised: "#E9F1FD",
    border: "#E6E4DC",
    textPrimary: "#15181D",
    textSecondary: "#5B6270",
    textTertiary: "#8D93A0",
    accent: "#1D59BB",
    accentInk: "#0D3C80",
    warm: "#FEBD19",
    warmInk: "#8A5A06",
    tabBackground: "#FFFFFF",
    tabBorder: "#E6E4DC",
  },
  dark: {
    ground: "#0E131C",
    surface: "#171E29",
    raised: "#212A38",
    border: "#2B3645",
    textPrimary: "#F6F8FB",
    textSecondary: "#A9B2C3",
    textTertiary: "#707A8C",
    accent: "#76B9FF",
    accentInk: "#CDE6FF",
    warm: "#FEBD19",
    warmInk: "#FEF3B3",
    tabBackground: "#171E29",
    tabBorder: "#2B3645",
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
