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
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Pogoda", headerShown: false }} />
        <Tabs.Screen name="settings" options={{ title: "Ustawienia", headerShown: false }} />
        <Tabs.Screen name="info" options={{ title: "Informacje", headerShown: false }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}