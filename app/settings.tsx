import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getCurrent } from '../api/weather';
import {
  disableWeatherNotifications,
  enableWeatherNotifications,
  getSavedLocation,
  getWeatherNotificationsEnabled,
} from '../services/weatherNotifications';

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(false);
  const [notificationPending, setNotificationPending] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState('kmh');

  useEffect(() => {
    getWeatherNotificationsEnabled().then(setNotifications);
  }, []);

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    setNotificationStatus('');

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
        const weather = await getCurrent({ cityName: location, includeAqi: 'no' });
        temperatureC = weather?.current?.temp_c;
        condition = weather?.current?.condition?.text;
      } catch (error) {
        console.error('Weather notification preview failed:', error);
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
          : 'Brak zgody systemowej na powiadomienia'
      );
    } catch (error) {
      console.error('Notifications setup failed:', error);
      setNotifications(false);
      setNotificationStatus('Nie udało się włączyć powiadomień');
    } finally {
      setNotificationPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Wygląd</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cell}
              onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              activeOpacity={0.7}>
              <Text style={styles.cellLabel}>Motyw</Text>
              <View style={styles.cellRight}>
                <Text style={styles.cellValue}>
                  {theme === 'light' ? 'Jasny' : 'Ciemny'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Powiadomienia</Text>
          <View style={styles.card}>
            <View style={styles.cell}>
              <Text style={styles.cellLabel}>Prognoza pogodowa</Text>
              <Switch
                value={notifications}
                onValueChange={handleNotificationsChange}
                disabled={notificationPending}
                trackColor={{ false: '#E5E5EA', true: '#6BA7ED' }}
                ios_backgroundColor="#E5E5EA"
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
          <Text style={styles.footerText}>
            {notificationStatus || 'Powiadomienia będą wysyłane co 3 godziny'}
          </Text>
        </View>

        {/* Units */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Jednostki</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cell}
              onPress={() => setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
              activeOpacity={0.7}>
              <Text style={styles.cellLabel}>Temperatura</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, styles.highlight]}>
                  {temperatureUnit === 'celsius' ? '°C' : '°F'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.separator} />
            
            <TouchableOpacity 
              style={styles.cell}
              onPress={() => {
                const units = ['kmh', 'ms', 'mph'];
                const currentIndex = units.indexOf(windSpeedUnit);
                const next = units[(currentIndex + 1) % units.length];
                setWindSpeedUnit(next);
              }}
              activeOpacity={0.7}>
              <Text style={styles.cellLabel}>Prędkość wiatru</Text>
              <View style={styles.cellRight}>
                <Text style={[styles.cellValue, styles.highlight]}>
                  {windSpeedUnit === 'kmh' && 'km/h'}
                  {windSpeedUnit === 'ms' && 'm/s'}
                  {windSpeedUnit === 'mph' && 'mph'}
                </Text>
                <Text style={styles.chevron}>›</Text>
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
    backgroundColor: '#F8F9FC',
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
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.3,
    marginLeft: 16,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#6BA7ED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1C1C1E',
  },
  cellRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cellValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
  },
  highlight: {
    color: '#6BA7ED',
  },
  chevron: {
    fontSize: 18,
    color: '#C6C6C8',
    fontWeight: '400',
    marginTop: -1,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E9E9EF',
    marginLeft: 16,
  },
  footerText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 16,
    marginTop: 6,
  },
  bottomSpacing: {
    height: 40,
  },
});
