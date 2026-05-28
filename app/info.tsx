import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../services/theme";

export default function Info() {
  const { colors } = useAppTheme();

  const cardStyle = [styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }];
  const labelStyle = [styles.infoLabel, { color: colors.textSecondary }];
  const valueStyle = [styles.infoValue, { color: colors.textPrimary }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.mainCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>SkyCheck</Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>Aplikacja Pogodowa</Text>

          <View style={styles.versionContainer}>
            <Text style={[styles.versionLabel, { color: colors.textSecondary }]}>Wersja</Text>
            <Text style={[styles.versionValue, { color: colors.textPrimary }]}>1.0.1</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={cardStyle}>
            <Text style={labelStyle}>Autor</Text>
            <Text style={valueStyle}>Klaudia Pabin</Text>
          </View>

          <View style={cardStyle}>
            <Text style={labelStyle}>GitHub</Text>
            <Text
              style={[styles.infoValue, { color: colors.secondaryAccent }]}
              onPress={() => Linking.openURL("https://github.com/badtexter")}
            >
              @badtexter
            </Text>
          </View>

          <View style={cardStyle}>
            <Text style={labelStyle}>System</Text>
            <Text style={valueStyle}>Android 14</Text>
          </View>

          <View style={cardStyle}>
            <Text style={labelStyle}>Licencja</Text>
            <Text style={valueStyle}>MIT</Text>
          </View>
        </View>

        <View style={[styles.licenseCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
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
    borderRadius: 28,
    padding: 28,
    marginBottom: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    width: "48%",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  licenseCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
