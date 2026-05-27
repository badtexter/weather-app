import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerType: "slide",

          drawerStyle: {
            backgroundColor: "#F5F5F7",
            width: "82%",
          },

          overlayColor: "rgba(0,0,0,0.15)",

          headerStyle: {
            backgroundColor: "#FFFFFF",
          },

          headerShadowVisible: false,

          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },

          headerTintColor: "#007AFF",

          drawerActiveBackgroundColor: "#E9E9EB",
          drawerActiveTintColor: "#000000",

          drawerInactiveTintColor: "#6E6E73",

          drawerLabelStyle: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: "500",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Pogoda",
            drawerLabel: "Pogoda",
          }}
        />

        <Drawer.Screen
          name="settings"
          options={{
            title: "Ustawienia",
            drawerLabel: "Ustawienia",
          }}
        />

        <Drawer.Screen
          name="info"
          options={{
            title: "Informacje",
            drawerLabel: "Informacje",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}