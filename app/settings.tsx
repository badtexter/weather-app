import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { getCurrent } from "../api/weather";
import { useAppTheme } from "../services/theme";
import { useUnits } from "../services/units";
import {
  disableWeatherNotifications,
  enableWeatherNotifications,
  getSavedLocation,
  getWeatherNotificationsEnabled,
} from "../services/weatherNotifications";

export default function Settings() {
  const { colors, theme, toggleTheme } = useAppTheme();
  const { temperatureUnit, windSpeedUnit, toggleTemperatureUnit, cycleWindSpeedUnit } = useUnits();
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

  const textColor = theme === "light" ? "#111" : "#FFFFFF";
  const textSecondary = theme === "light" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.6)";
  const textTertiary = theme === "light" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";
  const borderColor = theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Wygląd */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: textSecondary }]}>WYGLĄD</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor, borderWidth: theme === "light" ? 0 : 0.5 }]}>
            <TouchableOpacity style={styles.cell} onPress={toggleTheme} activeOpacity={0.6}>
              <Text style={[styles.cellLabel, { color: textColor }]}>Motyw</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: textSecondary }]}>
                  {theme === "light" ? "Jasny" : "Ciemny"}
                </Text>
                <Text style={[styles.chevron, { color: textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Powiadomienia */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: textSecondary }]}>POWIADOMIENIA</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor, borderWidth: theme === "light" ? 0 : 0.5 }]}>
            <View style={styles.cell}>
              <Text style={[styles.cellLabel, { color: textColor }]}>Prognoza pogodowa</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotificationsChange}
                disabled={notificationPending}
                trackColor={{ false: borderColor, true: "#4A90E2" }}
                ios_backgroundColor={borderColor}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
          {notificationStatus ? (
            <Text style={[styles.footerText, { color: textSecondary }]}>{notificationStatus}</Text>
          ) : (
            <Text style={[styles.footerText, { color: textSecondary }]}>
              Powiadomienia będą wysyłane co 3 godziny
            </Text>
          )}
        </View>

        {/* Jednostki */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: textSecondary }]}>JEDNOSTKI</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor, borderWidth: theme === "light" ? 0 : 0.5 }]}>
            <TouchableOpacity style={styles.cell} onPress={toggleTemperatureUnit} activeOpacity={0.6}>
              <Text style={[styles.cellLabel, { color: textColor }]}>Temperatura</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: "#4A90E2" }]}>
                  {temperatureUnit === "celsius" ? "°C" : "°F"}
                </Text>
                <Text style={[styles.chevron, { color: textTertiary }]}>›</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.separator, { backgroundColor: borderColor }]} />

            <TouchableOpacity style={styles.cell} onPress={cycleWindSpeedUnit} activeOpacity={0.6}>
              <Text style={[styles.cellLabel, { color: textColor }]}>Prędkość wiatru</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, { color: "#4A90E2" }]}>
                  {windSpeedUnit === "kmh" && "km/h"}
                  {windSpeedUnit === "ms" && "m/s"}
                  {windSpeedUnit === "mph" && "mph"}
                </Text>
                <Text style={[styles.chevron, { color: textTertiary }]}>›</Text>
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
    marginTop: 15,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.8,
    marginLeft: 20,
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  cell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  cellRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cellValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  chevron: {
    fontSize: 20,
    fontWeight: "300",
    marginTop: -2,
  },
  separator: {
    height: 0.5,
    marginLeft: 18,
  },
  footerText: {
    fontSize: 12,
    marginLeft: 20,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});