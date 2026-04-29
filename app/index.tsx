import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [locations, setLocation] = React.useState([1,2,3]);
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
              alignItems: "center",
              borderRadius: 9999,
              backgroundColor: showSearch ? "rgba(255,255,255,0.25)" : 'transparent',
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            {/* When search is shown */}
            {showSearch ? (
              <TextInput
                placeholder="Search city"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={{
                  paddingLeft: 24,
                  height: 40,
                  flex: 1,
                  fontSize: 16,
                  color: "white",
                }}
              />
            ) : null}

            {/* Search button */}
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                padding: 12,
                borderRadius: 9999,
                margin: 4,
              }}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Ionicons name="search" color="white" size={25} />
            </TouchableOpacity>
          </View>
          {
            locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {
                  locations.map((location, index) => (
                    <TouchableOpacity key={index}>
                      <Text>meow</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            ) : null
          }
        </View>
      </SafeAreaView>
    </View>
  );
}
