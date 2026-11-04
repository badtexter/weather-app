import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
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
import {
  getCurrent,
  getForecast,
  getLocations
} from "../api/weather";
import { useAppTheme } from "../services/theme";
import { useUnits } from "../services/units";
import {
  getSavedLocation,
  saveSelectedLocation,
} from "../services/weatherNotifications";

const { width } = Dimensions.get("window");

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return require("../assets/images/icons/sunny-day.png");
  } else if (conditionLower.includes("cloud")) {
    return require("../assets/images/icons/cloudy-day.png");
  } else if (conditionLower.includes("rain")) {
    return require("../assets/images/icons/rainy-day.png");
  } else if (conditionLower.includes("snow")) {
    return require("../assets/images/icons/snow.png");
  } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return require("../assets/images/icons/thunderstorm.png");
  } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return require("../assets/images/icons/foggy.png");
  }

  return require("../assets/images/icons/cloudy-day.png");
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

// Search Bar
const SearchBar = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  showResults,
  locations,
  onSelectLocation,
  isDark,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  showResults: boolean;
  locations: Array<{ label: string; query: string }>;
  onSelectLocation: (location: { label: string; query: string }) => void;
  isDark: boolean;
}) => (
  <View style={{ position: "relative", zIndex: 50, paddingHorizontal: 20, marginTop: 8 }}>
    <BlurView
      intensity={80}
      tint={isDark ? "dark" : "light"}
      style={{
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.7)",
          paddingHorizontal: 16,
          height: 52,
        }}
      >
        <Ionicons name="search" size={20} color={isDark ? "white" : "#333"} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Wyszukaj miasto"
          placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
          style={{
            marginLeft: 12,
            flex: 1,
            fontSize: 16,
            color: isDark ? "white" : "#111",
          }}
        />
      </View>
    </BlurView>

    {showResults && locations.length > 0 && (
      <BlurView
        intensity={90}
        tint={isDark ? "dark" : "light"}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          right: 20,
          borderRadius: 20,
          overflow: "hidden",
          zIndex: 100,
        }}
      >
        <View style={{ backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)" }}>
          {locations.map((location, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectLocation(location)}
              activeOpacity={0.7}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: index < locations.length - 1 ? 0.5 : 0,
                borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
            >
              <Text style={{ fontSize: 15, color: isDark ? "white" : "#111" }}>
                {location.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>
    )}
  </View>
);

// Info Card
const InfoCard = ({
  icon,
  label,
  value,
  isDark,
}: {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
}) => (
  <BlurView
    intensity={70}
    tint={isDark ? "dark" : "light"}
    style={{
      flex: 1,
      borderRadius: 24,
      overflow: "hidden",
      marginHorizontal: 6,
    }}
  >
    <View
      style={{
        backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)",
        paddingVertical: 16,
        alignItems: "center",
      }}
    >
      <Ionicons name={icon as any} size={22} color={isDark ? "white" : "#333"} />
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
          marginTop: 8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: isDark ? "white" : "#111",
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
  </BlurView>
);

// Forecast Card
const ForecastCard = ({
  day,
  temperature,
  high,
  low,
  icon,
  selected,
  onPress,
  isDark,
  accentColor,
}: {
  day: string;
  temperature: string;
  high: string;
  low: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
  accentColor: string;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <BlurView
      intensity={selected ? 90 : 50}
      tint={isDark ? "dark" : "light"}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          backgroundColor: selected
            ? isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)"
            : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.3)",
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeftWidth: selected ? 3 : 0,
          borderLeftColor: accentColor,
        }}
      >
        <View style={{ flex: 1, marginLeft: selected ? 9 : 0 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: selected ? "600" : "400",
              color: selected ? accentColor : isDark ? "white" : "#111",
            }}
          >
            {day}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              marginTop: 2,
            }}
          >
            {low} / {high}
          </Text>
        </View>
        <Image source={icon} style={{ width: 32, height: 32, marginHorizontal: 12 }} />
        <Text
          style={{
            fontSize: 22,
            fontWeight: selected ? "600" : "300",
            color: isDark ? "white" : "#111",
          }}
        >
          {temperature}
        </Text>
      </View>
    </BlurView>
  </TouchableOpacity>
);

// Hourly Card
const HourlyCard = ({
  time,
  temperature,
  icon,
  rainChance,
  isDark,
}: {
  time: string;
  temperature: string;
  icon: any;
  rainChance?: number;
  isDark: boolean;
}) => (
  <BlurView
    intensity={60}
    tint={isDark ? "dark" : "light"}
    style={{
      width: 80,
      borderRadius: 24,
      overflow: "hidden",
      marginRight: 12,
    }}
  >
    <View
      style={{
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)",
        paddingVertical: 12,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: isDark ? "white" : "#333",
          marginBottom: 8,
        }}
      >
        {time}
      </Text>
      <Image source={icon} style={{ width: 32, height: 32, marginBottom: 8 }} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: isDark ? "white" : "#111",
        }}
      >
        {temperature}
      </Text>
      {typeof rainChance === "number" && rainChance > 0 && (
        <Text
          style={{
            fontSize: 10,
            fontWeight: "500",
            color: isDark ? "#90CAF9" : "#1565C0",
            marginTop: 4,
          }}
        >
          {rainChance}%
        </Text>
      )}
    </View>
  </BlurView>
);

export default function Index() {
  const { isDark, colors } = useAppTheme();
  const { formatTemperature, formatWindSpeed } = useUnits();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Kalisz");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [forecastData, setForecastData] = useState<any | null>(null);
  const [selectedForecastDayIndex, setSelectedForecastDayIndex] = useState(0);
  const [locationOptions, setLocationOptions] = useState<
    Array<{ label: string; query: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    try {
      const [currentResult, forecastResult] = await Promise.allSettled([
        getCurrent({ cityName: location, includeAqi: "yes" }),
        getForecast({
          cityName: location,
          days: 3,
          includeAqi: "yes",
          includeAlerts: "no",
        }),
      ]);

      if (currentResult.status === "fulfilled") {
        setWeatherData(currentResult.value);
      }
      if (forecastResult.status === "fulfilled") {
        setForecastData(forecastResult.value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSavedLocation()
      .then((location) => {
        setSelectedLocation(location);
      })
      .finally(() => {
        setPreferencesLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    saveSelectedLocation(selectedLocation);
    fetchWeather(selectedLocation);
  }, [preferencesLoaded, selectedLocation]);

  useEffect(() => {
    setSelectedForecastDayIndex(0);
  }, [forecastData]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setLocationOptions([]);
        return;
      }

      try {
        const results = await getLocations({ cityName: searchQuery });
        if (Array.isArray(results)) {
          setLocationOptions(
            results.map((item: any) => ({
              label: [item.name, item.region, item.country]
                .filter(Boolean)
                .join(", "),
              query: item.name,
            }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const weatherInfo = [
    {
      icon: "speedometer-outline",
      label: "Wiatr",
      value: weatherData ? formatWindSpeed(weatherData.current.wind_kph) : "-",
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

  const forecast =
    forecastData?.forecast?.forecastday?.map((day: any, index: number) => ({
      date: day.date,
      day: formatForecastDay(day.date, index),
      temperature: formatTemperature(day.day.avgtemp_c),
      high: formatTemperature(day.day.maxtemp_c),
      low: formatTemperature(day.day.mintemp_c),
      icon: getWeatherIcon(day.day.condition.text),
      hours:
        day.hour?.map((hour: any) => ({
          time: hour.time?.split(" ")[1] || "",
          temperature: formatTemperature(hour.temp_c),
          icon: getWeatherIcon(hour.condition?.text || "Cloudy"),
          rainChance: hour.chance_of_rain,
        })) || [],
    })) || [];

  const selectedForecastDay = forecast[selectedForecastDayIndex] || forecast[0];

  const handleLocationSelect = (location: { label: string; query: string }) => {
    setSelectedLocation(location.query);
    setSearchQuery(location.label);
    setShowSearch(false);
    setLocationOptions([]);
  };

  // Kolory tekstu w zależności od trybu
  const textColor = isDark ? "white" : "#111";
  const textSecondary = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const textTertiary = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)";

  return (
    <LinearGradient
      colors={isDark 
        ? ["#0B1020", "#1B2A49", "#243B63", "#3E5C8A"]
        : ["#E8F0FE", "#D4E4FC", "#C0D8FA", "#ACCCF8"]
      }
      locations={[0, 0.3, 0.7, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSearch(true)}
          onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          showResults={showSearch}
          locations={locationOptions}
          onSelectLocation={handleLocationSelect}
          isDark={isDark}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Location */}
          <View style={{ alignItems: "center", marginTop: 20, marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 38,
                fontWeight: "500",
                color: textColor,
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {selectedLocation}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: textSecondary,
                marginTop: 2,
              }}
            >
              Polska
            </Text>
          </View>

          {/* Weather Icon */}
          <View style={{ alignItems: "center", marginVertical: 16 }}>
            <Image
              source={getWeatherIcon(weatherData?.current?.condition?.text || "Cloudy")}
              style={{ width: 130, height: 130 }}
              resizeMode="contain"
            />
          </View>

          {/* Temperature */}
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 72,
                fontWeight: "200",
                color: textColor,
                letterSpacing: -2,
              }}
            >
              {formatTemperature(weatherData?.current?.temp_c)}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                color: textSecondary,
                marginTop: 6,
              }}
            >
              {weatherData
                ? translateCondition(weatherData.current.condition.text)
                : loading ? "Ładowanie..." : "Brak danych"}
            </Text>
          </View>

          {/* Info Cards */}
          <View style={{ flexDirection: "row", paddingHorizontal: 20, marginTop: 32 }}>
            {weatherInfo.map((info, index) => (
              <InfoCard key={index} icon={info.icon} label={info.label} value={info.value} isDark={isDark} />
            ))}
          </View>

          {/* Daily Forecast */}
          <View style={{ marginTop: 36, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: textColor, marginBottom: 12, letterSpacing: -0.3 }}>
              Prognoza dzienna
            </Text>
            {forecast.map((day, index) => (
              <ForecastCard
                key={index}
                day={day.day}
                temperature={day.temperature}
                high={day.high}
                low={day.low}
                icon={day.icon}
                selected={selectedForecastDayIndex === index}
                onPress={() => setSelectedForecastDayIndex(index)}
                isDark={isDark}
                accentColor={colors.accent}
              />
            ))}
          </View>

          {/* Hourly Forecast */}
          <View style={{ marginTop: 28, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: textColor, letterSpacing: -0.3 }}>
                Prognoza godzinowa
              </Text>
              {selectedForecastDay && (
                <Text style={{ fontSize: 14, color: textSecondary }}>
                  {selectedForecastDay.day}
                </Text>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 40 }}
            >
              {selectedForecastDay?.hours?.map((hour, index) => (
                <HourlyCard
                  key={index}
                  time={hour.time}
                  temperature={hour.temperature}
                  icon={hour.icon}
                  rainChance={hour.rainChance}
                  isDark={isDark}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}