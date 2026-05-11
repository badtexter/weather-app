import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [locations, setLocation] = React.useState([1,2,3]);
  const handleLocation = (location: number) => {
    console.log('location:', location);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
      <StatusBar style="dark" />

      <View
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: "#FFD66B",
          opacity: 0.2,
          top: 150,
          alignSelf: "center",
        }}
      />

      <Image
        source={require("../assets/images/icons/sunny-day.png")}
        blurRadius={30}
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          top: 140,
          alignSelf: "center",
          opacity: 0.08,
        }}
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
          {/* Search section */}
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
                paddingHorizontal: 16,
                height: 50,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}>
              <Ionicons name="search" size={20} color="#8e8e93" />

              <TextInput
                placeholder="Search city"
                placeholderTextColor="#8e8e93"
                style={{
                  marginLeft: 10,
                  flex: 1,
                  fontSize: 16,
                  color: "#111",
                }}/>
            </View>
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
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 34,
                fontWeight: "600",
                color: "#111",
              }}
            >
              Kalisz
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#8e8e93",
                marginTop: 4,
              }}
            >
              Polska
            </Text>

            <Image
              source={require("../assets/images/icons/sunny-day.png")}
              style={{
                width: 140,
                height: 140,
                marginVertical: 20,
              }}
            />

            <Text
              style={{
                fontSize: 72,
                fontWeight: "200",
                color: "#111",
              }}
            >
              20°
            </Text>

            <Text
              style={{
                fontSize: 20,
                color: "#8e8e93",
                marginTop: 6,
              }}
            >
              Słonecznie
            </Text>
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
              <Text style={{
                color: 'white',
                fontSize: 16,
                marginLeft: 8
              }}>Dzienna prognoza</Text>
            </View>
            <ScrollView horizontal contentContainerStyle={{
              paddingHorizontal: 16
            }} showsHorizontalScrollIndicator={false}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Poniedziałek</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Wtorek</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Środa</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Czwartek</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Piątek</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Sobota</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                borderRadius: 24,
                paddingVertical: 12,
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                <Image source={require("../assets/images/icons/clouds.png")} style={{ width: 32, height: 32 }} />
                <Text style={{
                  color: 'white',
                  fontSize: 14
                }}>Niedziela</Text>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>20°</Text>
              </View>
            </ScrollView>
        </View>

      </SafeAreaView>
    </View>
  );
}
