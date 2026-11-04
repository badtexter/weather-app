import { renderHook, act } from "@testing-library/react-native";
import React from "react";
import { UnitsProvider, useUnits } from "../units";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UnitsProvider>{children}</UnitsProvider>
);

describe("formatTemperature", () => {
  it("rounds and labels Celsius by default", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    expect(result.current.formatTemperature(6.4)).toBe("6°");
    expect(result.current.formatTemperature(6.6)).toBe("7°");
  });

  it("converts to Fahrenheit once the unit is switched", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    await act(async () => {
      await result.current.setTemperatureUnit("fahrenheit");
    });

    expect(result.current.formatTemperature(0)).toBe("32°");
    expect(result.current.formatTemperature(100)).toBe("212°");
  });

  it("falls back to a placeholder when there is no reading", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    expect(result.current.formatTemperature(null)).toBe("--°");
    expect(result.current.formatTemperature(undefined)).toBe("--°");
  });
});

describe("formatWindSpeed", () => {
  it("defaults to km/h", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    expect(result.current.formatWindSpeed(36)).toBe("36 km/h");
  });

  it("cycles through km/h → m/s → mph and back", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    await act(async () => {
      await result.current.cycleWindSpeedUnit();
    });
    expect(result.current.formatWindSpeed(36)).toBe("10.0 m/s");

    await act(async () => {
      await result.current.cycleWindSpeedUnit();
    });
    expect(result.current.formatWindSpeed(36)).toBe("22 mph");

    await act(async () => {
      await result.current.cycleWindSpeedUnit();
    });
    expect(result.current.formatWindSpeed(36)).toBe("36 km/h");
  });

  it("falls back to a dash when there is no reading", async () => {
    const { result } = await renderHook(() => useUnits(), { wrapper });

    expect(result.current.formatWindSpeed(null)).toBe("-");
  });
});

describe("useUnits", () => {
  it("throws when used outside a UnitsProvider", async () => {
    await expect(renderHook(() => useUnits())).rejects.toThrow(
      "useUnits must be used inside UnitsProvider"
    );
  });
});
