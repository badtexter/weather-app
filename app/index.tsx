import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <StatusBar style="light" />

      <Image
        blurRadius={150}
        source={require("../assets/images/bg.png")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Search section */}
        <View
          style={{
            height: "7%",
            marginHorizontal: 16,
            position: "relative",
            zIndex: 50,
          }}
        >
          {/* Search input */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: 9999,
              backgroundColor: "white",
              opacity: 0.2,
            }}
          >
            <TextInput
              placeholder="Search city"
              placeholderTextColor={"lightgray"}
              style={{
                paddingLeft: 24,
                height: 40,
                flex: 1,
                fontSize: 16,
                color: "white",
              }}
            />

            {/* Search button */}
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 9999,
                margin: 4,
                opacity: 0.3,
              }}
            >
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
