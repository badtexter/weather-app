import AsyncStorage from "@react-native-async-storage/async-storage";

export const SELECTED_LOCATION_KEY = "weather.selectedLocation";

const WEATHER_NOTIFICATIONS_ENABLED_KEY = "weather.notificationsEnabled";

export async function getSavedLocation() {
  return (await AsyncStorage.getItem(SELECTED_LOCATION_KEY)) || "Kalisz";
}

export async function saveSelectedLocation(location: string) {
  await AsyncStorage.setItem(SELECTED_LOCATION_KEY, location);
}

export async function getWeatherNotificationsEnabled() {
  return (await AsyncStorage.getItem(WEATHER_NOTIFICATIONS_ENABLED_KEY)) === "true";
}

export async function disableWeatherNotifications() {
  await AsyncStorage.setItem(WEATHER_NOTIFICATIONS_ENABLED_KEY, "false");
}

export async function enableWeatherNotifications(_params: {
  location: string;
  temperatureC?: number;
  condition?: string;
}) {
  await AsyncStorage.setItem(WEATHER_NOTIFICATIONS_ENABLED_KEY, "false");
  return false;
}
