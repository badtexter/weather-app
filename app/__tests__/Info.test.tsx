import { render, screen } from "@testing-library/react-native";
import React from "react";
import { AppThemeProvider } from "../../services/theme";
import Info from "../info";

describe("Info screen", () => {
  it("shows the app name and the license", async () => {
    await render(
      <AppThemeProvider>
        <Info />
      </AppThemeProvider>
    );

    expect(screen.getByText("SkyCheck")).toBeTruthy();
    expect(screen.getByText("MIT License")).toBeTruthy();
    expect(screen.getByText("@badtexter")).toBeTruthy();
  });
});
