import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../services/theme";

export default function Info() {
  const { colors } = useAppTheme();

  const rows = [
    { label: "Autor", value: "Klaudia Pabin" },
    {
      label: "GitHub",
      value: "@badtexter",
      accent: true,
      onPress: () => Linking.openURL("https://github.com/badtexter"),
    },
    { label: "System", value: "Android 14" },
    { label: "Licencja", value: "MIT" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.ground }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.mainPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>SkyCheck</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>Aplikacja pogodowa</Text>

          <View style={styles.versionContainer}>
            <Text style={[styles.versionLabel, { color: colors.textTertiary }]}>Wersja</Text>
            <Text style={[styles.versionValue, { color: colors.accent }]}>1.0.1</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Szczegóły</Text>
        <View style={[styles.listPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.cell,
                index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>{row.label}</Text>
              <Text
                style={[
                  styles.cellValue,
                  { color: row.accent ? colors.accent : colors.textSecondary },
                ]}
                onPress={row.onPress}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>Licencja</Text>
        <View style={[styles.licensePanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.licenseHeader}>
            <View style={[styles.licenseDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.licenseTitle, { color: colors.textPrimary }]}>MIT License</Text>
          </View>
          <Text style={[styles.licenseYear, { color: colors.textTertiary }]}>
            Copyright © 2026 Klaudia Pabin
          </Text>
          <Text style={[styles.licenseText, { color: colors.textSecondary }]}>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions.
          </Text>
          <View style={[styles.licenseTags, { borderTopColor: colors.border }]}>
            <Text style={[styles.tag, { color: colors.accentInk, backgroundColor: colors.raised }]}>
              Open Source
            </Text>
            <Text style={[styles.tag, { color: colors.accentInk, backgroundColor: colors.raised }]}>
              Free Use
            </Text>
            <Text style={[styles.tag, { color: colors.accentInk, backgroundColor: colors.raised }]}>
              MIT
            </Text>
          </View>
        </View>

        <Text
          style={[styles.link, { color: colors.accent }]}
          onPress={() => Linking.openURL("https://opensource.org/licenses/MIT")}
        >
          opensource.org/licenses/MIT →
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const RADIUS = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  mainPanel: {
    borderRadius: RADIUS,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    marginBottom: 20,
  },
  versionContainer: {
    alignItems: "center",
  },
  versionLabel: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    marginLeft: 4,
    marginBottom: 8,
  },
  listPanel: {
    borderRadius: RADIUS,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  cell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cellLabel: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  cellValue: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  licensePanel: {
    borderRadius: RADIUS,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  licenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  licenseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  licenseTitle: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  licenseYear: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginBottom: 14,
    marginLeft: 14,
  },
  licenseText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    lineHeight: 18,
    marginBottom: 16,
  },
  licenseTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tag: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  link: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
