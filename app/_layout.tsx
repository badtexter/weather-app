import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppThemeProvider, useAppTheme } from "../services/theme";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootTabs />
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
            fontWeight: "500",
          },
          headerStyle: {
            backgroundColor: colors.tabBackground,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 26,
            fontWeight: "600",
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
