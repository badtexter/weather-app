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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.mainCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>SkyCheck</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>Aplikacja pogodowa</Text>

          <View style={styles.versionContainer}>
            <Text style={[styles.versionLabel, { color: colors.textSecondary }]}>Wersja</Text>
            <Text style={[styles.versionValue, { color: colors.textPrimary }]}>1.0.1</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Szczegóły</Text>
        <View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {rows.map((row, index) => (
            <React.Fragment key={row.label}>
              <View style={styles.cell}>
                <Text style={[styles.cellLabel, { color: colors.textPrimary }]}>{row.label}</Text>
                <Text
                  style={[
                    styles.cellValue,
                    { color: row.accent ? colors.secondaryAccent : colors.textSecondary },
                  ]}
                  onPress={row.onPress}
                >
                  {row.value}
                </Text>
              </View>
              {index < rows.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>Licencja</Text>
        <View style={[styles.licenseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.licenseHeader}>
            <View style={[styles.licenseDot, { backgroundColor: colors.secondaryAccent }]} />
            <Text style={[styles.licenseTitle, { color: colors.textPrimary }]}>MIT License</Text>
          </View>
          <Text style={[styles.licenseYear, { color: colors.textSecondary }]}>
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
            <Text style={[styles.tag, { color: colors.secondaryAccent, backgroundColor: colors.border }]}>
              Open Source
            </Text>
            <Text style={[styles.tag, { color: colors.secondaryAccent, backgroundColor: colors.border }]}>
              Free Use
            </Text>
            <Text style={[styles.tag, { color: colors.secondaryAccent, backgroundColor: colors.border }]}>
              MIT
            </Text>
          </View>
        </View>

        <Text
          style={[styles.link, { color: colors.secondaryAccent }]}
          onPress={() => Linking.openURL("https://opensource.org/licenses/MIT")}
        >
          opensource.org/licenses/MIT →
        </Text>

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
    paddingHorizontal: 20,
    paddingTop: 35,
  },
  mainCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    marginBottom: 24,
    alignItems: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 24,
  },
  versionContainer: {
    alignItems: "center",
  },
  versionLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
    marginBottom: 8,
  },
  listCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  cell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  cellValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  separator: {
    height: 0.5,
    marginLeft: 18,
  },
  licenseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  licenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  licenseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  licenseYear: {
    fontSize: 13,
    marginBottom: 14,
    marginLeft: 16,
  },
  licenseText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  licenseTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    overflow: "hidden",
  },
  link: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
