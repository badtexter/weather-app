import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [locations, setLocation] = React.useState([1,2,3]);
  const handleLocation = (location: number) => {
    console.log('location:', location);
  };
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
              <View style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: '#d1d5db',
                top: 64,
                borderRadius: 24
              }}>
                {
                  locations.map((location, index) => {
                    const shownBorder = index + 1 !== locations.length;
                    const borderStyle = shownBorder ? {
                      borderBottomWidth: 2,
                      borderBottomColor: '#9ca3af'
                    } : {};

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 0,
                          padding: 12,
                          paddingHorizontal: 16,
                          marginBottom: 4
                        }, borderStyle]}
                        onPress={()=> handleLocation(location)}
                      >
                        <Ionicons name="location" color="gray" size={20} />
                        <Text style={{
                          color: 'black',
                          fontSize: 18,
                          marginLeft: 8
                        }}>meow</Text>
                      </TouchableOpacity>
                    );
                  })
                }
              </View>
            ) : null
          }
        </View>
        {/* Weather section */}
        <View style={{
          marginHorizontal: 16,
          flex: 1,
          justifyContent: 'space-around',
          marginBottom: 8,
          alignItems: 'center'
        }}>
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold'
          }}>Kalisz,
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#d1d5db'
            }}> 
              Polska
            </Text>
          </Text>
          {/* Weather icon */}
          <Image
            source={require("../assets/images/icons/sunny-day.png")}
            style={{ width: 208, height: 208 }}
          />
          {/* Forecast section */}
          <View style={{
            width: '100%',
            alignItems: 'center'
          }}>
            <Text style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: 56,
              marginLeft: 20
            }}>
              20°
            </Text>
            <Text style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 20,
              letterSpacing: 2,
              marginTop: 8
            }}>
              Słonecznie
            </Text>
          </View>
          {/* Additional info */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            width: '100%'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 8
            }}>
              <Image source={require("../assets/images/icons/wind.png")} style={{ width: 24, height: 24, marginRight: 8 }} />
              <Text style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16
              }}>
                22km
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 8
            }}>
              <Image source={require("../assets/images/icons/humidity.png")} style={{ width: 24, height: 24, marginRight: 8 }} />
              <Text style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16
              }}>
                22%
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Image source={require("../assets/images/icons/humidity.png")} style={{ width: 24, height: 24, marginRight: 8 }} />
              <Text style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 16
              }}>
                22%
              </Text>
            </View>
          </View>
        </View>

        {/* Forcast section for next days */}
        <View style={{
          marginBottom: 8,
          paddingVertical: 12
        }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              marginBottom: 8
            }}>
              <Ionicons name="calendar" size={22} color="white" />
            </View>
        </View>

      </SafeAreaView>
    </View>
  );
}
