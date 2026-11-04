import { formatForecastDay, getWeatherIcon, translateCondition } from "../index";

describe("translateCondition", () => {
  it("translates known WeatherAPI conditions to Polish", () => {
    expect(translateCondition("Sunny")).toBe("Słonecznie");
    expect(translateCondition("Partly cloudy")).toBe("Częściowe zachmurzenie");
    expect(translateCondition("Patchy rain nearby")).toBe("Deszcz");
    expect(translateCondition("Thundery outbreaks possible")).toBe("Burza");
  });

  it("is case-insensitive", () => {
    expect(translateCondition("SUNNY")).toBe("Słonecznie");
  });

  it("falls back to the raw condition text when nothing matches", () => {
    expect(translateCondition("Volcanic ash")).toBe("Volcanic ash");
  });

  it("falls back to a placeholder for an empty condition", () => {
    expect(translateCondition("")).toBe("Brak danych");
  });
});

describe("formatForecastDay", () => {
  it("labels the first two days as today and tomorrow", () => {
    expect(formatForecastDay("2026-01-01", 0)).toBe("Dzisiaj");
    expect(formatForecastDay("2026-01-02", 1)).toBe("Jutro");
  });

  it("spells out the weekday for later days", () => {
    // 2026-01-03 is a Saturday.
    expect(formatForecastDay("2026-01-03", 2)).toBe("sobota");
  });
});

describe("getWeatherIcon", () => {
  it("returns an icon asset for every condition it recognises", () => {
    for (const condition of ["Sunny", "Cloudy", "Rain", "Snow", "Thunder", "Fog", "something else"]) {
      expect(getWeatherIcon(condition)).toBeTruthy();
    }
  });

  it("falls back to the cloudy icon for an unrecognised condition", () => {
    expect(getWeatherIcon("mystery weather")).toBe(getWeatherIcon("cloudy"));
  });
});
