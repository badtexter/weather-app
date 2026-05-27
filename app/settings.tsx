import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { getCurrent } from "../api/weather";
import { useAppTheme } from "../services/theme";
import {
  disableWeatherNotifications,
  enableWeatherNotifications,
  getSavedLocation,
  getWeatherNotificationsEnabled,
} from "../services/weatherNotifications";

export default function Settings() {
  const { colors, theme, toggleTheme } = useAppTheme();
  const [notifications, setNotifications] = useState(false);
  const [notificationPending, setNotificationPending] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [windSpeedUnit, setWindSpeedUnit] = useState("kmh");

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

  const cardStyle = [styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }];
  const cellStyle = [styles.cell, { backgroundColor: colors.card }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Wygląd</Text>
          <View style={cardStyle}>
            <TouchableOpacity style={cellStyle} onPress={toggleTheme} activeOpacity={0.7}>
              <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>Motyw</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: colors.textSecondary }]}>
                  {theme === "light" ? "Jasny" : "Ciemny"}
                </Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Powiadomienia</Text>
          <View style={cardStyle}>
            <View style={cellStyle}>
              <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>Prognoza pogodowa</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotificationsChange}
                disabled={notificationPending}
                trackColor={{ false: colors.border, true: colors.secondaryAccent }}
                ios_backgroundColor={colors.border}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {notificationStatus || "Powiadomienia będą wysyłane co 3 godziny"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Jednostki</Text>
          <View style={cardStyle}>
            <TouchableOpacity
              style={cellStyle}
              onPress={() => setTemperatureUnit(temperatureUnit === "celsius" ? "fahrenheit" : "celsius")}
              activeOpacity={0.7}
            >
              <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>Temperatura</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: colors.secondaryAccent }]}>
                  {temperatureUnit === "celsius" ? "°C" : "°F"}
                </Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={cellStyle}
              onPress={() => {
                const units = ["kmh", "ms", "mph"];
                const currentIndex = units.indexOf(windSpeedUnit);
                const next = units[(currentIndex + 1) % units.length];
                setWindSpeedUnit(next);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>Prędkość wiatru</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: colors.secondaryAccent }]}>
                  {windSpeedUnit === "kmh" && "km/h"}
                  {windSpeedUnit === "ms" && "m/s"}
                  {windSpeedUnit === "mph" && "mph"}
                </Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingTop: 35,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginLeft: 16,
    marginBottom: 6,
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  cell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  cellRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cellValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  chevron: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: -1,
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
  },
  footerText: {
    fontSize: 11,
    marginLeft: 16,
    marginTop: 6,
  },
  bottomSpacing: {
    height: 40,
  },
});
