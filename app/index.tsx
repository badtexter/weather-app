import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
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

const RADIUS = 8;

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

// The icon set is itself soft gradient art — a tint to match for a glow behind it.
const getConditionTint = (condition: string) => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) return "255,176,64";
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) return "150,120,235";
  if (conditionLower.includes("snow")) return "140,195,255";
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "70,140,230";
  if (conditionLower.includes("fog") || conditionLower.includes("mist")) return "170,176,195";

  return "110,150,220";
};

// A soft halo behind a weather icon: three flat, translucent circles of the
// condition's own tint, shrinking and darkening toward the centre — no actual
// gradient asset, so it stays crisp at any size.
const IconGlow = ({ size, tint }: { size: number; tint: string }) => (
  <View
    style={{
      position: "absolute",
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: `rgba(${tint},0.10)`,
      }}
    />
    <View
      style={{
        position: "absolute",
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: (size * 0.7) / 2,
        backgroundColor: `rgba(${tint},0.16)`,
      }}
    />
    <View
      style={{
        position: "absolute",
        width: size * 0.42,
        height: size * 0.42,
        borderRadius: (size * 0.42) / 2,
        backgroundColor: `rgba(${tint},0.22)`,
      }}
    />
  </View>
);

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
  colors,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  showResults: boolean;
  locations: Array<{ label: string; query: string }>;
  onSelectLocation: (location: { label: string; query: string }) => void;
  colors: any;
}) => (
  <View style={{ position: "relative", zIndex: 50, paddingHorizontal: 20, marginTop: 8 }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        height: 44,
      }}
    >
      <Ionicons name="search" size={17} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Wyszukaj miasto"
        placeholderTextColor={colors.textTertiary}
        style={{
          marginLeft: 10,
          flex: 1,
          fontSize: 15,
          fontFamily: "DMSans_400Regular",
          color: colors.textPrimary,
        }}
      />
    </View>

    {showResults && locations.length > 0 && (
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          right: 20,
          borderRadius: RADIUS,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          zIndex: 100,
          backgroundColor: colors.raised,
        }}
      >
        {locations.map((location, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectLocation(location)}
            activeOpacity={0.7}
            style={{
              paddingVertical: 13,
              paddingHorizontal: 14,
              borderBottomWidth: index < locations.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: "DMSans_400Regular", color: colors.textPrimary }}>
              {location.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

// A single strip holding the three current-conditions figures, split by 1px rules —
// one KPI container rather than three separate tiles.
const ConditionStrip = ({
  items,
  colors,
}: {
  items: Array<{ icon: string; label: string; value: string }>;
  colors: any;
}) => (
  <View
    style={{
      flexDirection: "row",
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: "hidden",
    }}
  >
    {items.map((item, index) => (
      <View
        key={item.label}
        style={{
          flex: 1,
          paddingVertical: 14,
          paddingHorizontal: 10,
          alignItems: "flex-start",
          borderLeftWidth: index === 0 ? 0 : 1,
          borderLeftColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={item.icon as any} size={13} color={colors.textTertiary} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: "DMSans_500Medium",
              color: colors.textTertiary,
              marginLeft: 4,
            }}
          >
            {item.label}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 17,
            fontFamily: "DMSans_500Medium",
            color: colors.textPrimary,
            marginTop: 6,
          }}
        >
          {item.value}
        </Text>
      </View>
    ))}
  </View>
);

// Forecast row — the pale tint of the accent fills the selected row (the
// style's one move for area work); the full hue stays reserved for the figure.
const ForecastRow = ({
  day,
  temperature,
  high,
  low,
  icon,
  tint,
  selected,
  onPress,
  isLast,
  colors,
}: {
  day: string;
  temperature: string;
  high: string;
  low: string;
  icon: any;
  tint: string;
  selected: boolean;
  onPress: () => void;
  isLast: boolean;
  colors: any;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
        backgroundColor: selected ? colors.raised : "transparent",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontFamily: selected ? "DMSans_600SemiBold" : "DMSans_400Regular",
            color: selected ? colors.accentInk : colors.textPrimary,
          }}
        >
          {day}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "DMSans_500Medium",
            color: colors.textTertiary,
            marginTop: 2,
          }}
        >
          {low} / {high}
        </Text>
      </View>
      <View style={{ width: 26, height: 26, marginHorizontal: 12, alignItems: "center", justifyContent: "center" }}>
        <IconGlow size={40} tint={tint} />
        <Image source={icon} style={{ width: 26, height: 26 }} />
      </View>
      <Text
        style={{
          fontSize: 18,
          fontFamily: "DMSans_700Bold",
          color: selected ? colors.accent : colors.textPrimary,
          minWidth: 50,
          textAlign: "right",
        }}
      >
        {temperature}
      </Text>
    </View>
  </TouchableOpacity>
);

// Hourly Row
const HourlyRow = ({
  time,
  temperature,
  icon,
  tint,
  rainChance,
  isLast,
  colors,
}: {
  time: string;
  temperature: string;
  icon: any;
  tint: string;
  rainChance?: number;
  isLast: boolean;
  colors: any;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: colors.border,
    }}
  >
    <Text
      style={{
        width: 52,
        fontSize: 13,
        fontFamily: "DMSans_500Medium",
        color: colors.textSecondary,
      }}
    >
      {time}
    </Text>
    <View style={{ width: 24, height: 24, marginHorizontal: 14, alignItems: "center", justifyContent: "center" }}>
      <IconGlow size={38} tint={tint} />
      <Image source={icon} style={{ width: 24, height: 24 }} />
    </View>
    <View style={{ flex: 1 }}>
      {typeof rainChance === "number" && rainChance > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            backgroundColor: colors.raised,
            borderRadius: 999,
            paddingVertical: 3,
            paddingHorizontal: 8,
          }}
        >
          <Ionicons name="water" size={11} color={colors.accentInk} style={{ marginRight: 3 }} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "DMSans_500Medium",
              color: colors.accentInk,
            }}
          >
            {rainChance}%
          </Text>
        </View>
      ) : null}
    </View>
    <Text
      style={{
        fontSize: 15,
        fontFamily: "DMSans_700Bold",
        color: colors.textPrimary,
        minWidth: 46,
        textAlign: "right",
      }}
    >
      {temperature}
    </Text>
  </View>
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
      value: weatherData ? formatWindSpeed(weatherData.current.wind_kph) : "–",
    },
    {
      icon: "water-outline",
      label: "Wilgotność",
      value: weatherData ? `${weatherData.current.humidity}%` : "–",
    },
    {
      icon: "eye-outline",
      label: "Widoczność",
      value: weatherData ? `${weatherData.current.vis_km} km` : "–",
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
      tint: getConditionTint(day.day.condition.text),
      hours:
        day.hour?.map((hour: any) => ({
          time: hour.time?.split(" ")[1] || "",
          temperature: formatTemperature(hour.temp_c),
          icon: getWeatherIcon(hour.condition?.text || "Cloudy"),
          tint: getConditionTint(hour.condition?.text || "Cloudy"),
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.ground }}>
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
          colors={colors}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Location */}
          <View style={{ alignItems: "center", marginTop: 20, marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "DMSans_600SemiBold",
                color: colors.textPrimary,
              }}
              numberOfLines={1}
            >
              {selectedLocation}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "DMSans_400Regular",
                color: colors.textTertiary,
                marginTop: 3,
              }}
            >
              Polska
            </Text>
          </View>

          {/* Weather Icon */}
          <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 12, height: 110 }}>
            <IconGlow size={190} tint={getConditionTint(weatherData?.current?.condition?.text || "Cloudy")} />
            <Image
              source={getWeatherIcon(weatherData?.current?.condition?.text || "Cloudy")}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          </View>

          {/* Temperature */}
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 64,
                fontFamily: "DMSans_700Bold",
                color: colors.accent,
              }}
            >
              {formatTemperature(weatherData?.current?.temp_c)}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "DMSans_500Medium",
                color: colors.textSecondary,
                marginTop: 4,
              }}
            >
              {weatherData
                ? translateCondition(weatherData.current.condition.text)
                : loading ? "Ładowanie..." : "Brak danych"}
            </Text>
          </View>

          {/* Current conditions */}
          <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
            <ConditionStrip items={weatherInfo} colors={colors} />
          </View>

          {/* Daily Forecast */}
          <View style={{ marginTop: 28, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: "DMSans_500Medium", color: colors.textTertiary, marginBottom: 8 }}>
              Prognoza dzienna
            </Text>
            <View style={{ borderRadius: RADIUS, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" }}>
              {forecast.map((day, index) => (
                <ForecastRow
                  key={index}
                  day={day.day}
                  temperature={day.temperature}
                  high={day.high}
                  low={day.low}
                  icon={day.icon}
                  tint={day.tint}
                  selected={selectedForecastDayIndex === index}
                  onPress={() => setSelectedForecastDayIndex(index)}
                  isLast={index === forecast.length - 1}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          {/* Hourly Forecast */}
          <View style={{ marginTop: 24, marginBottom: 20, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontFamily: "DMSans_500Medium", color: colors.textTertiary }}>
                Prognoza godzinowa
              </Text>
              {selectedForecastDay && (
                <Text style={{ fontSize: 12, fontFamily: "DMSans_400Regular", color: colors.textTertiary }}>
                  {selectedForecastDay.day}
                </Text>
              )}
            </View>

            <View style={{ borderRadius: RADIUS, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" }}>
              {selectedForecastDay?.hours?.map((hour, index) => (
                <HourlyRow
                  key={index}
                  time={hour.time}
                  temperature={hour.temperature}
                  icon={hour.icon}
                  tint={hour.tint}
                  rainChance={hour.rainChance}
                  isLast={index === selectedForecastDay.hours.length - 1}
                  colors={colors}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
