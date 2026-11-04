import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getCurrent } from "../api/weather";
import { useAppTheme } from "../services/theme";
import { TemperatureUnit, WindSpeedUnit, useUnits } from "../services/units";
import {
  disableWeatherNotifications,
  enableWeatherNotifications,
  getSavedLocation,
  getWeatherNotificationsEnabled,
} from "../services/weatherNotifications";

const RADIUS = 8;

// One option of a Segmented control — its fill animates in rather than
// snapping, the same move as the selected day on the weather tab.
function SegmentedOption<T extends string>({
  option,
  active,
  onPress,
  colors,
}: {
  option: { label: string; value: T };
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", colors.raised]),
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <Animated.View
        style={[
          {
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 999,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: active ? "DMSans_600SemiBold" : "DMSans_400Regular",
            color: active ? colors.accentInk : colors.textSecondary,
          }}
        >
          {option.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// A row of options where the active one sits on the accent's pale tint with
// its dark ink — the same fill used for the selected day on the weather tab.
function Segmented<T extends string>({
  options,
  value,
  onChange,
  colors,
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
  colors: any;
}) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: colors.ground, borderRadius: 999, padding: 3 }}>
      {options.map((option) => (
        <SegmentedOption
          key={option.value}
          option={option}
          active={option.value === value}
          onPress={() => onChange(option.value)}
          colors={colors}
        />
      ))}
    </View>
  );
}

export default function Settings() {
  const { colors, theme, setTheme } = useAppTheme();
  const { temperatureUnit, windSpeedUnit, setTemperatureUnit, setWindSpeedUnit } = useUnits();
  const [notifications, setNotifications] = useState(false);
  const [notificationPending, setNotificationPending] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");

  useEffect(() => {
    getWeatherNotificationsEnabled().then(setNotifications);
  }, []);

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    setNotificationStatus("");

    if (!enabled) {
      await disableWeatherNotifications();
      return;
    }

    setNotificationPending(true);

    try {
      const location = await getSavedLocation();
      let temperatureC: number | undefined;
      let condition: string | undefined;

      try {
        const weather = await getCurrent({ cityName: location, includeAqi: "no" });
        temperatureC = weather?.current?.temp_c;
        condition = weather?.current?.condition?.text;
      } catch (error) {
        console.error("Weather notification preview failed:", error);
      }

      const enabledNotifications = await enableWeatherNotifications({
        location,
        temperatureC,
        condition,
      });

      setNotifications(enabledNotifications);
      setNotificationStatus(
        enabledNotifications
          ? `Powiadomienia ustawione dla: ${location}`
          : "Brak zgody systemowej na powiadomienia"
      );
    } catch (error) {
      console.error("Notifications setup failed:", error);
      setNotifications(false);
      setNotificationStatus("Nie udało się włączyć powiadomień");
    } finally {
      setNotificationPending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.ground }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Wygląd */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Wygląd</Text>
          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Motyw</Text>
              <Segmented
                colors={colors}
                value={theme}
                onChange={setTheme}
                options={[
                  { label: "Jasny", value: "light" },
                  { label: "Ciemny", value: "dark" },
                ]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Powiadomienia */}
        <Animated.View entering={FadeInDown.duration(300).delay(60)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Powiadomienia</Text>
          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Prognoza pogodowa</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotificationsChange}
                disabled={notificationPending}
                trackColor={{ false: colors.border, true: colors.warm }}
                ios_backgroundColor={colors.border}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
          <Animated.Text
            key={notificationStatus}
            entering={FadeIn.duration(180)}
            style={[styles.footerText, { color: colors.textTertiary }]}
          >
            {notificationStatus || "Powiadomienia będą wysyłane co 3 godziny"}
          </Animated.Text>
        </Animated.View>

        {/* Jednostki */}
        <Animated.View entering={FadeInDown.duration(300).delay(120)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Jednostki</Text>
          <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Temperatura</Text>
              <Segmented<TemperatureUnit>
                colors={colors}
                value={temperatureUnit}
                onChange={setTemperatureUnit}
                options={[
                  { label: "°C", value: "celsius" },
                  { label: "°F", value: "fahrenheit" },
                ]}
              />
            </View>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Prędkość wiatru</Text>
              <Segmented<WindSpeedUnit>
                colors={colors}
                value={windSpeedUnit}
                onChange={setWindSpeedUnit}
                options={[
                  { label: "km/h", value: "kmh" },
                  { label: "m/s", value: "ms" },
                  { label: "mph", value: "mph" },
                ]}
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    marginLeft: 20,
    marginBottom: 8,
  },
  panel: {
    borderRadius: RADIUS,
    borderWidth: 1,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    marginLeft: 20,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
