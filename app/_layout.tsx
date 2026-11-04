import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppThemeProvider, useAppTheme } from "../services/theme";
import { UnitsProvider } from "../services/units";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <UnitsProvider>
        <RootTabs />
      </UnitsProvider>
    </AppThemeProvider>
  );
}

function RootTabs() {
  const { colors } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.tabBackground,
            borderTopWidth: 0.5,
            borderTopColor: colors.tabBorder,
            height: 70,
            paddingBottom: 15,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: "DMSans_500Medium",
          },
          headerStyle: {
            backgroundColor: colors.tabBackground,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 26,
            fontFamily: "DMSans_600SemiBold",
            color: colors.textPrimary,
          },
          headerTitleAlign: "center",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Pogoda",
            tabBarLabel: "Pogoda",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="cloud-snow" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ustawienia",
            tabBarLabel: "Ustawienia",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="info"
          options={{
            title: "Informacje",
            tabBarLabel: "Informacje",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="info" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
