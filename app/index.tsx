import { StatusBar } from "expo-status-bar";
import { Image, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={150} source={require("../assets/images/bg.png")} className="absolute w-full h-full" />
    </View>
  );
}
