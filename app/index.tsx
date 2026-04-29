import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image source={require("../assets/images/bg.png")} className="absolute w-full h-full" />
      <Text className="text-white text-2xl">Hello world</Text>
    </View>
  );
}
