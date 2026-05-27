import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="index" options={{
          title: "Pogoda",
          drawerLabel: "Pogoda",
        }} />
         <Drawer.Screen name="settings" options={{
          title: "Ustawienia",
          drawerLabel: "Ustawienia",
        }} />
        <Drawer.Screen name="info" options={{
          title: "Informacje",
          drawerLabel: "Informacje",
        }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
