import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Color palette
const colors = {
  background: "#f8f8fa",
  card: "#ffffff",
  text: {
    primary: "#111111",
    secondary: "#8e8e93",
    tertiary: "#c7c7cc",
  },
  accent: "#0A84FF",
  shadow: "#000000",
};

// Shadows
const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
};

// Search Bar Component
const SearchBar = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginHorizontal: 20,
      marginVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 50,
      ...shadows.small,
    }}
  >
    <Ionicons name="search" size={20} color={colors.text.secondary} />
    <Text
      style={{
        marginLeft: 12,
        flex: 1,
        fontSize: 16,
        color: colors.text.secondary,
      }}
    >
      Search city
    </Text>
  </TouchableOpacity>
);

// Location Dropdown Component
const LocationDropdown = ({
  locations,
  onSelect,
}: {
  locations: string[];
  onSelect: (location: string) => void;
}) => (
  <View
    style={{
      position: "absolute",
      top: 72,
      left: 20,
      right: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      zIndex: 100,
      ...shadows.medium,
    }}
  >
    {locations.map((location: string, index: number) => (
      <TouchableOpacity
        key={index}
        onPress={() => onSelect(location)}
        activeOpacity={0.6}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: index < locations.length - 1 ? 1 : 0,
          borderBottomColor: colors.text.tertiary,
        }}
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={colors.text.secondary}
        />
        <Text
          style={{
            marginLeft: 12,
            fontSize: 16,
            color: colors.text.primary,
            fontWeight: "500",
          }}
        >
          {location}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Weather Info Card Component
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View
    style={{
      backgroundColor: colors.card,
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginHorizontal: 6,
      ...shadows.small,
    }}
  >
    <Ionicons name={icon as any} size={24} color={colors.accent} />
    <Text
      style={{
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 8,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: colors.text.primary,
        marginTop: 4,
      }}
    >
      {value}
    </Text>
  </View>
);

// Forecast Card Component
const ForecastCard = ({
  day,
  temperature,
  high,
  low,
  icon,
}: {
  day: string;
  temperature: number;
  high: number;
  low: number;
  icon: string;
}) => (
  <View
    style={{
      width: width * 0.28,
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      marginRight: 12,
      ...shadows.small,
    }}
  >
    <Image
      source={require("../assets/images/icons/clouds.png")}
      style={{ width: 32, height: 32, marginBottom: 8 }}
    />
    <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 4,
      }}
    >
      {day}
    </Text>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "700",
        color: colors.accent,
        marginBottom: 4,
      }}
    >
      {temperature}°
    </Text>
    <Text
      style={{
        fontSize: 12,
        color: colors.text.secondary,
      }}
    >
      {low}°
    </Text>
  </View>
);

export default function Index() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState("Kalisz");

  const locations = ["Warszawa", "Kraków", "Gdańsk", "Poznań", "Wrocław"];

  const weatherInfo = [
    { icon: "wind-outline", label: "Wind", value: "22 km/h" },
    { icon: "water-outline", label: "Humidity", value: "45%" },
    { icon: "eye-outline", label: "Visibility", value: "10 km" },
  ];

  const forecast = [
    { day: "Mon", temperature: 20, high: 20, low: 15 },
    { day: "Tue", temperature: 18, high: 18, low: 14 },
    { day: "Wed", temperature: 22, high: 22, low: 16 },
    { day: "Thu", temperature: 19, high: 19, low: 15 },
    { day: "Fri", temperature: 21, high: 21, low: 16 },
  ];

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowSearch(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="dark" />

      {/* Decorative background elements */}
      <View
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: 150,
          opacity: 0.1,
          top: 100,
          alignSelf: "center",
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Search Section */}
        <View style={{ position: "relative", zIndex: 50 }}>
          <SearchBar onPress={() => setShowSearch(!showSearch)} />
          {showSearch && locations.length > 0 && (
            <LocationDropdown
              locations={locations}
              onSelect={handleLocationSelect}
            />
          )}
        </View>

        {/* Current Weather Section */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Location & Temperature */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "600",
                color: colors.text.primary,
              }}
            >
              {selectedLocation}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.text.secondary,
                marginTop: 4,
              }}
            >
              Poland
            </Text>
          </View>

          {/* Weather Icon */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 200,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* outer glow */}
              <View
                style={{
                  position: "absolute",
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  backgroundColor: "#FFE082",
                  opacity: 0.18,
                }}
              />

              {/* inner glow */}
              <View
                style={{
                  position: "absolute",
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  backgroundColor: "#FFD54F",
                  opacity: 0.25,
                }}
              />

              <Image
                source={require("../assets/images/icons/sunny-day.png")}
                resizeMode="contain"
                style={{
                  width: 160,
                  height: 160,
                }}
              />
            </View>
          </View>

          {/* Temperature Display */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 72,
                fontWeight: "200",
                color: colors.text.primary,
              }}
            >
              20°
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: colors.text.secondary,
                marginTop: 8,
                fontWeight: "500",
              }}
            >
              Sunny
            </Text>
          </View>

          {/* Weather Details Cards */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              marginTop: 28,
              marginBottom: 36,
            }}
          >
            {weatherInfo.map((info, index) => (
              <InfoCard
                key={index}
                icon={info.icon}
                label={info.label}
                value={info.value}
              />
            ))}
          </View>

          {/* 5-Day Forecast Section */}
          <View
            style={{
              marginBottom: 28,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 24,
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#8E8E93"
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: colors.text.primary,
                  marginLeft: 10,
                  letterSpacing: -0.3,
                }}
              >
                5-Day Forecast
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              scrollEventThrottle={16}
            >
              {forecast.map((day, index) => (
                <ForecastCard
                  key={index}
                  day={day.day}
                  temperature={day.temperature}
                  high={day.high}
                  low={day.low}
                  icon="cloud-outline"
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
