import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "ms" | "mph";

const TEMPERATURE_UNIT_KEY = "units.temperature";
const WIND_SPEED_UNIT_KEY = "units.windSpeed";

type UnitsContextValue = {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => Promise<void>;
  setWindSpeedUnit: (unit: WindSpeedUnit) => Promise<void>;
  toggleTemperatureUnit: () => Promise<void>;
  cycleWindSpeedUnit: () => Promise<void>;
  formatTemperature: (tempC?: number | null) => string;
  formatWindSpeed: (windKph?: number | null) => string;
};

const UnitsContext = createContext<UnitsContextValue | null>(null);

export function UnitsProvider({ children }: { children: React.ReactNode }) {
  const [temperatureUnit, setTemperatureUnitState] = useState<TemperatureUnit>("celsius");
  const [windSpeedUnit, setWindSpeedUnitState] = useState<WindSpeedUnit>("kmh");

  useEffect(() => {
    AsyncStorage.multiGet([TEMPERATURE_UNIT_KEY, WIND_SPEED_UNIT_KEY]).then(values => {
      const savedTemperatureUnit = values[0]?.[1];
      const savedWindSpeedUnit = values[1]?.[1];

      if (savedTemperatureUnit === "celsius" || savedTemperatureUnit === "fahrenheit") {
        setTemperatureUnitState(savedTemperatureUnit);
      }

      if (savedWindSpeedUnit === "kmh" || savedWindSpeedUnit === "ms" || savedWindSpeedUnit === "mph") {
        setWindSpeedUnitState(savedWindSpeedUnit);
      }
    });
  }, []);

  const setTemperatureUnit = async (unit: TemperatureUnit) => {
    setTemperatureUnitState(unit);
    await AsyncStorage.setItem(TEMPERATURE_UNIT_KEY, unit);
  };

  const setWindSpeedUnit = async (unit: WindSpeedUnit) => {
    setWindSpeedUnitState(unit);
    await AsyncStorage.setItem(WIND_SPEED_UNIT_KEY, unit);
  };

  const toggleTemperatureUnit = async () => {
    await setTemperatureUnit(temperatureUnit === "celsius" ? "fahrenheit" : "celsius");
  };

  const cycleWindSpeedUnit = async () => {
    const units: WindSpeedUnit[] = ["kmh", "ms", "mph"];
    const currentIndex = units.indexOf(windSpeedUnit);
    await setWindSpeedUnit(units[(currentIndex + 1) % units.length]);
  };

  const formatTemperature = (tempC?: number | null) => {
    if (typeof tempC !== "number") {
      return "--°";
    }

    if (temperatureUnit === "fahrenheit") {
      return `${Math.round((tempC * 9) / 5 + 32)}°`;
    }

    return `${Math.round(tempC)}°`;
  };

  const formatWindSpeed = (windKph?: number | null) => {
    if (typeof windKph !== "number") {
      return "-";
    }

    if (windSpeedUnit === "ms") {
      return `${(windKph / 3.6).toFixed(1)} m/s`;
    }

    if (windSpeedUnit === "mph") {
      return `${Math.round(windKph * 0.621371)} mph`;
    }

    return `${Math.round(windKph)} km/h`;
  };

  const value = useMemo(
    () => ({
      temperatureUnit,
      windSpeedUnit,
      setTemperatureUnit,
      setWindSpeedUnit,
      toggleTemperatureUnit,
      cycleWindSpeedUnit,
      formatTemperature,
      formatWindSpeed,
    }),
    [temperatureUnit, windSpeedUnit]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits() {
  const value = useContext(UnitsContext);

  if (!value) {
    throw new Error("useUnits must be used inside UnitsProvider");
  }

  return value;
}
