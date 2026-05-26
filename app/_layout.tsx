import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="index" options={{
          title: "Home",
          drawerLabel: "Home",
        }} />
         <Drawer.Screen name="settings" options={{
          title: "Settings",
          drawerLabel: "Settings",
        }} />
        <Drawer.Screen name="info" options={{
          title: "Info",
          drawerLabel: "Info",
        }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
