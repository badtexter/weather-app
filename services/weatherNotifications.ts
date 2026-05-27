import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const SELECTED_LOCATION_KEY = "weather.selectedLocation";

const WEATHER_NOTIFICATION_ID_KEY = "weather.notificationId";
const WEATHER_NOTIFICATIONS_ENABLED_KEY = "weather.notificationsEnabled";
const WEATHER_NOTIFICATION_CHANNEL_ID = "weather-updates";
const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getSavedLocation() {
  return (await AsyncStorage.getItem(SELECTED_LOCATION_KEY)) || "Kalisz";
}

export async function saveSelectedLocation(location: string) {
  await AsyncStorage.setItem(SELECTED_LOCATION_KEY, location);
}

export async function getWeatherNotificationsEnabled() {
  return (await AsyncStorage.getItem(WEATHER_NOTIFICATIONS_ENABLED_KEY)) === "true";
}

async function requestNotificationPermission() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(WEATHER_NOTIFICATION_CHANNEL_ID, {
      name: "Pogoda",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.status === "granted") {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.status === "granted";
}

export async function disableWeatherNotifications() {
  const notificationId = await AsyncStorage.getItem(WEATHER_NOTIFICATION_ID_KEY);

  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  await AsyncStorage.removeItem(WEATHER_NOTIFICATION_ID_KEY);
  await AsyncStorage.setItem(WEATHER_NOTIFICATIONS_ENABLED_KEY, "false");
}

export async function enableWeatherNotifications(params: {
  location: string;
  temperatureC?: number;
  condition?: string;
}) {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    await AsyncStorage.setItem(WEATHER_NOTIFICATIONS_ENABLED_KEY, "false");
    return false;
  }

  await disableWeatherNotifications();

  const temperatureText =
    typeof params.temperatureC === "number" ? `${Math.round(params.temperatureC)}°C` : "sprawdź pogodę";
  const conditionText = params.condition ? `, ${params.condition}` : "";

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Aktualna pogoda",
      body: `${params.location}: ${temperatureText}${conditionText}`,
      data: { screen: "weather", location: params.location },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: THREE_HOURS_IN_SECONDS,
      repeats: true,
      channelId: WEATHER_NOTIFICATION_CHANNEL_ID,
    },
  });

  await AsyncStorage.setItem(WEATHER_NOTIFICATION_ID_KEY, notificationId);
  await AsyncStorage.setItem(WEATHER_NOTIFICATIONS_ENABLED_KEY, "true");

  return true;
}
