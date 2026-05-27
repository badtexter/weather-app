import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0.5,
            borderTopColor: "#E5E5EA",
            height: 70,
            paddingBottom: 15,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 26,
            fontWeight: "600",
            color: "#1C1C1E",
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