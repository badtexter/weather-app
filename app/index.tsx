import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image blurRadius={150} source={require("../assets/images/bg.png")} className="absolute w-full h-full" />
      
      <SafeAreaView className="flex flex-1">
          {/* Search section */}
          
          <View style={{height: '7%'}} className="mx-4 relative z-50">
            
            {/* Search input */}
            <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor: 'white'}}>
              <TextInput placeholder="Search city" placeholderTextColor={'lightgray'} 
              className="pl-6 h-10 flex-1 text-base text-white"/>
              
              {/* Search button */}
              <TouchableOpacity style={{backgroundColor: 'white'}} className="p-3 rounded-full m-1">
            
              </TouchableOpacity>
            </View>
          </View>
      </SafeAreaView>
    </View>
  );
}
