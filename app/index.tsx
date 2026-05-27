import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAlerts, getCurrent, getForecast, getLocations, getSports } from "../api/weather";
import { useAppTheme } from "../services/theme";
import { getSavedLocation, saveSelectedLocation } from "../services/weatherNotifications";

const { width } = Dimensions.get("window");

// Weather condition to icon and color mapping
interface WeatherConfig {
  icon: any;
  glowColor1: string;
  glowColor2: string;
}

const getWeatherConfig = (condition: string): WeatherConfig => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return {
      icon: require("../assets/images/icons/sunny-day.png"),
      glowColor1: "#FFE082",
      glowColor2: "#FFD54F",
    };
  } else if (conditionLower.includes("cloud")) {
    return {
      icon: require("../assets/images/icons/cloudy-day.png"),
      glowColor1: "#B0BEC5",
      glowColor2: "#90A4AE",
    };
  } else if (conditionLower.includes("rain")) {
    return {
      icon: require("../assets/images/icons/rainy-day.png"),
      glowColor1: "#64B5F6",
      glowColor2: "#42A5F5",
    };
  } else if (conditionLower.includes("snow")) {
    return {
      icon: require("../assets/images/icons/snow.png"),
      glowColor1: "#E3F2FD",
      glowColor2: "#BBDEFB",
    };
  } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return {
      icon: require("../assets/images/icons/thunderstorm.png"),
      glowColor1: "#A1887F",
      glowColor2: "#8D6E63",
    };
  } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return {
      icon: require("../assets/images/icons/foggy.png"),
      glowColor1: "#CFD8DC",
      glowColor2: "#B0BEC5",
    };
  }
  
  // Default to cloudy
  return {
    icon: require("../assets/images/icons/cloudy-day.png"),
    glowColor1: "#B0BEC5",
    glowColor2: "#90A4AE",
  };
};

const translateCondition = (condition: string) => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sunny")) return "Słonecznie";
  if (conditionLower.includes("clear")) return "Bezchmurnie";
  if (conditionLower.includes("partly cloudy")) return "Częściowe zachmurzenie";
  if (conditionLower.includes("cloudy") || conditionLower.includes("overcast")) return "Pochmurno";
  if (conditionLower.includes("mist") || conditionLower.includes("fog")) return "Mgła";
  if (conditionLower.includes("thunder")) return "Burza";
  if (conditionLower.includes("snow")) return "Śnieg";
  if (conditionLower.includes("sleet")) return "Deszcz ze śniegiem";
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "Deszcz";

  return condition || "Brak danych";
};

const formatForecastDay = (date: string, index: number) => {
  if (index === 0) return "Dzisiaj";
  if (index === 1) return "Jutro";

  return new Date(date).toLocaleDateString("pl-PL", { weekday: "long" });
};

// Color palette
const colors = {
  background: "#f8f8fa",
  card: "#ffffff",
  search: "rgba(255,255,255,0.9)",
  text: {
    primary: "#111111",
    secondary: "#8e8e93",
    tertiary: "#c7c7cc",
  },
  accent: "#0A84FF",
  secondaryAccent: "#5c9ce6",
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
const SearchBar = ({
  value,
  onChangeText,
  onFocus,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
}) => (
  <View
    style={{
      marginHorizontal: 20,
      marginVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.search,
      borderRadius: 14,
      paddingHorizontal: 16,
      height: 46,
      ...shadows.small,
    }}
  >
    <Ionicons name="search" size={20} color={colors.text.secondary} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      placeholder="Wyszukaj lokalizację"
      placeholderTextColor={colors.text.secondary}
      style={{
        marginLeft: 12,
        flex: 1,
        fontSize: 15,
        color: colors.text.primary,
      }}
    />
  </View>
);

// Location Dropdown Component
const LocationDropdown = ({
  locations,
  onSelect,
}: {
  locations: Array<{ label: string; query: string }>;
  onSelect: (location: { label: string; query: string }) => void;
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
    {locations.map((location, index) => (
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
          {location.label}
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
      paddingVertical: 18,
      borderRadius: 22,
      alignItems: "center",
      marginHorizontal: 4,
      minHeight: 110,
      ...shadows.small,
    }}
  >
    <Ionicons name={icon as any} size={20} color={colors.secondaryAccent} />
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
  selected,
  onPress,
}: {
  day: string;
  temperature: number;
  high: number;
  low: number;
  icon: any;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      width: 88,
      backgroundColor: selected ? colors.accent : colors.card,
      borderRadius: 20,
      paddingVertical: 18,
      alignItems: "center",
      marginRight: 12,
      ...shadows.small,
    }}
  >
    <Image
      source={icon}
      style={{ width: 32, height: 32, marginBottom: 8 }}
    />
    <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color: selected ? "#FFFFFF" : colors.text.primary,
        marginBottom: 4,
      }}
    >
      {day}
    </Text>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "700",
        color: selected ? "#FFFFFF" : colors.accent,
        marginBottom: 4,
      }}
    >
      {temperature}°
    </Text>
    <Text
      style={{
        fontSize: 12,
        color: selected ? "rgba(255,255,255,0.75)" : colors.text.secondary,
      }}
    >
      {low}°
    </Text>
  </TouchableOpacity>
);

const ForecastListRow = ({
  day,
  temperature,
  high,
  low,
  icon,
  selected,
  onPress,
}: {
  day: string;
  temperature: number;
  high: number;
  low: number;
  icon: any;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      backgroundColor: selected ? colors.search : "transparent",
      borderRadius: 14,
      paddingVertical: 13,
      paddingHorizontal: 14,
      marginBottom: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "600",
          color: selected ? colors.accent : colors.text.primary,
          textTransform: "capitalize",
        }}
      >
        {day}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: colors.text.secondary,
          marginTop: 3,
        }}
      >
        Min. {low}° / maks. {high}°
      </Text>
    </View>
    <Image source={icon} style={{ width: 36, height: 36, marginHorizontal: 14 }} />
    <Text
      style={{
        minWidth: 58,
        textAlign: "right",
        fontSize: 28,
        fontWeight: "300",
        color: selected ? colors.accent : colors.text.primary,
        lineHeight: 32,
      }}
    >
      {temperature}°
    </Text>
  </TouchableOpacity>
);

const HourlyCard = ({
  time,
  temperature,
  condition,
  icon,
  rainChance,
}: {
  time: string;
  temperature: number;
  condition: string;
  icon: any;
  rainChance?: number;
}) => (
  <View
    style={{
      width: 74,
      minHeight: 112,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: "center",
      marginRight: 12,
      ...shadows.small,
    }}
  >
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.primary,
        marginBottom: 8,
      }}
    >
      {time}
    </Text>
    <Image source={icon} style={{ width: 32, height: 32, marginBottom: 8 }} />
    <Text
      style={{
        fontSize: 19,
        fontWeight: "600",
        color: colors.accent,
      }}
    >
      {temperature}°
    </Text>
    {typeof rainChance === "number" && rainChance > 0 && (
      <Text
        style={{
          fontSize: 11,
          color: colors.text.secondary,
          marginTop: 4,
        }}
      >
        {rainChance}%
      </Text>
    )}
  </View>
);

export default function Index() {
  const { colors: themeColors, isDark } = useAppTheme();
  colors.background = themeColors.background;
  colors.card = themeColors.card;
  colors.search = themeColors.search;
  colors.text.primary = themeColors.textPrimary;
  colors.text.secondary = themeColors.textSecondary;
  colors.text.tertiary = themeColors.border;
  colors.accent = themeColors.accent;
  colors.secondaryAccent = themeColors.secondaryAccent;
  colors.shadow = themeColors.shadow;
  shadows.small.shadowColor = themeColors.shadow;
  shadows.medium.shadowColor = themeColors.shadow;

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Kalisz");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [forecastData, setForecastData] = useState<any | null>(null);
  const [selectedForecastDayIndex, setSelectedForecastDayIndex] = useState(0);
  const [sportsData, setSportsData] = useState<any | null>(null);
  const [futureData, setFutureData] = useState<any | null>(null);
  const [alertsData, setAlertsData] = useState<any | null>(null);
  const [locationOptions, setLocationOptions] = useState<Array<{ label: string; query: string }>>([
    { label: "Warszawa", query: "Warszawa" },
    { label: "Kraków", query: "Kraków" },
    { label: "Gdańsk", query: "Gdańsk" },
    { label: "Poznań", query: "Poznań" },
    { label: "Wrocław", query: "Wrocław" },
  ]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getFutureDate = () => {
    const future = new Date();
    future.setDate(future.getDate() + 14);
    return future.toISOString().split("T")[0];
  };

  const fetchWeather = async (location: string) => {
    setLoading(true);
    try {
      const [currentResult, forecastResult, sportsResult, alertsResult] = await Promise.allSettled([
        getCurrent({ cityName: location, includeAqi: "yes" }),
        getForecast({ cityName: location, days: 3, includeAqi: "yes", includeAlerts: "no" }),
        getSports({ cityName: location }),
        getAlerts({ cityName: location }),
      ]);

      if (currentResult.status === "fulfilled") {
        setWeatherData(currentResult.value);
      } else {
        console.error("Current weather failed:", currentResult.reason);
        setWeatherData(null);
      }

      if (forecastResult.status === "fulfilled") {
        setForecastData(forecastResult.value);
      } else {
        console.error("Forecast failed:", forecastResult.reason);
        setForecastData(null);
      }

      if (sportsResult.status === "fulfilled") {
        setSportsData(sportsResult.value);
      } else {
        console.error("Sports fetch failed:", sportsResult.reason);
        setSportsData(null);
      }

      if (alertsResult.status === "fulfilled") {
        setAlertsData(alertsResult.value);
      } else {
        console.error("Alerts fetch failed:", alertsResult.reason);
        setAlertsData(null);
      }
    } catch (error) {
      console.error("Weather fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedLocation()
      .then(location => {
        setSelectedLocation(location);
      })
      .finally(() => {
        setPreferencesLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) {
      return;
    }

    saveSelectedLocation(selectedLocation);
    fetchWeather(selectedLocation);
  }, [preferencesLoaded, selectedLocation]);

  useEffect(() => {
    setSelectedForecastDayIndex(0);
  }, [forecastData]);

  const fetchLocationSuggestions = async (query: string) => {
    if (!query.trim()) {
      setLocationOptions([
        { label: "Warszawa", query: "Warszawa" },
        { label: "Kraków", query: "Krakow" },
        { label: "Gdańsk", query: "Gdansk" },
        { label: "Poznań", query: "Poznan" },
        { label: "Wrocław", query: "Wroclaw" },
      ]);
      return;
    }

    try {
      const results = await getLocations({ cityName: query });
      if (Array.isArray(results)) {
        setLocationOptions(
          results.map((item: any) => ({
            label: [item.name, item.region, item.country].filter(Boolean).join(", "),
            query: item.name,
          }))
        );
      } else {
        setLocationOptions([]);
      }
    } catch (error) {
      console.error("Location search failed:", error);
      setLocationOptions([]);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchLocationSuggestions(searchQuery);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const weatherInfo = [
    {
      icon: "speedometer-outline",
      label: "Wiatr",
      value: weatherData ? `${weatherData.current.wind_kph} km/h` : "-",
    },
    {
      icon: "water-outline",
      label: "Wilgotność",
      value: weatherData ? `${weatherData.current.humidity}%` : "-",
    },
    {
      icon: "eye-outline",
      label: "Widoczność",
      value: weatherData ? `${weatherData.current.vis_km} km` : "-",
    },
  ];

  const forecast: Array<{
    date: string;
    day: string;
    temperature: number;
    high: number;
    low: number;
    icon: any;
    hours: Array<{
      time: string;
      temperature: number;
      condition: string;
      icon: any;
      rainChance?: number;
    }>;
  }> =
    forecastData?.forecast?.forecastday?.map((day: any, index: number) => ({
      date: day.date,
      day: formatForecastDay(day.date, index),
      temperature: Math.round(day.day.avgtemp_c),
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      icon: getWeatherConfig(day.day.condition.text).icon,
      hours:
        day.hour?.map((hour: any) => ({
          time: hour.time?.split(" ")[1] || "",
          temperature: Math.round(hour.temp_c),
          condition: translateCondition(hour.condition?.text || ""),
          icon: getWeatherConfig(hour.condition?.text || "Cloudy").icon,
          rainChance: hour.chance_of_rain,
        })) || [],
    })) || [];

  const selectedForecastDay = forecast[selectedForecastDayIndex] || forecast[0];

  const handleLocationSelect = (location: { label: string; query: string }) => {
    setSelectedLocation(location.query);
    setSearchQuery(location.label);
    setShowSearch(false);
  };

  

  return (
    <LinearGradient
      colors={themeColors.gradient}
      style={{ flex: 1 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Search Section */}
        <View style={{ position: "relative", zIndex: 50 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            onFocus={() => setShowSearch(true)}
          />
          {showSearch && locationOptions.length > 0 && (
            <LocationDropdown
              locations={locationOptions}
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
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: "500",
                color: themeColors.textPrimary,
              }}
              numberOfLines={1}
            >
              {selectedLocation}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: themeColors.textSecondary,
                marginTop: 4,
                fontWeight: "400",
              }}
            >
              Polska
            </Text>
          </View>

          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Image
              source={getWeatherConfig(weatherData?.current?.condition?.text || "Cloudy").icon}
              resizeMode="contain"
              style={{
                width: 150,
                height: 150,
              }}
            />
          </View>

          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 86,
                fontWeight: "100",
                color: themeColors.textPrimary,
                lineHeight: 90,
              }}
            >
              {weatherData ? `${Math.round(weatherData.current.temp_c)}°` : "--°"}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: themeColors.textSecondary,
                marginTop: 2,
                fontWeight: "400",
              }}
            >
              {weatherData
                ? translateCondition(weatherData.current.condition.text)
                : loading
                  ? "Ładowanie..."
                  : "Brak danych"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              marginBottom: 24,
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

          {/* Daily Forecast Section */}
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
                color={themeColors.textSecondary}
              />

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: themeColors.textPrimary,
                  marginLeft: 10,
                  letterSpacing: -0.3,
                }}
              >
                Prognoza dzienna
              </Text>
            </View>

            <View
              style={{
                marginHorizontal: 24,
                padding: 6,
                borderRadius: 22,
                backgroundColor: themeColors.card,
                ...shadows.medium,
              }}
            >
              {forecast.map((day, index) => (
                <ForecastListRow
                  key={index}
                  day={day.day}
                  temperature={day.temperature}
                  high={day.high}
                  low={day.low}
                  icon={day.icon}
                  selected={selectedForecastDayIndex === index}
                  onPress={() => setSelectedForecastDayIndex(index)}
                />
              ))}
            </View>
          </View>

          {/* Hourly Forecast Section */}
          <View
            style={{
              marginBottom: 28,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 24,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="time-outline" size={18} color={themeColors.textSecondary} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    color: themeColors.textPrimary,
                    marginLeft: 10,
                    letterSpacing: -0.3,
                  }}
                >
                  Prognoza godzinowa
                </Text>
              </View>
              {selectedForecastDay && (
                <Text
                  style={{
                    fontSize: 13,
                    color: themeColors.textSecondary,
                    fontWeight: "500",
                  }}
                >
                  {selectedForecastDay.day}
                </Text>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingRight: 40 }}
              scrollEventThrottle={16}
            >
              {selectedForecastDay?.hours?.map((hour, index) => (
                <HourlyCard
                  key={`${selectedForecastDay.date}-${hour.time}-${index}`}
                  time={hour.time}
                  temperature={hour.temperature}
                  condition={hour.condition}
                  icon={hour.icon}
                  rainChance={hour.rainChance}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
