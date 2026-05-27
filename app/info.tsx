import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Info() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.mainCard}>
          <Text style={styles.appName}>SkyCheck</Text>
          <Text style={styles.appSubtitle}>Aplikacja Pogodowa</Text>
          
          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>Wersja</Text>
            <Text style={styles.versionValue}>1.0.1</Text>
          </View>
        </View>

        {/* Main grid with info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Autor</Text>
            <Text style={styles.infoValue}>Klaudia Pabin</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>GitHub</Text>
            <Text 
              style={[styles.infoValue, styles.linkText]}
              onPress={() => Linking.openURL('https://github.com/badtexter')}>
              @badtexter
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>System</Text>
            <Text style={styles.infoValue}>Android 14</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Licencja</Text>
            <Text style={styles.infoValue}>MIT</Text>
          </View>
        </View>

        {/* License card */}
        <View style={styles.licenseCard}>
          <View style={styles.licenseHeader}>
            <View style={styles.licenseDot} />
            <Text style={styles.licenseTitle}>MIT License</Text>
          </View>
          <Text style={styles.licenseYear}>
            Copyright © 2026 Klaudia Pabin
          </Text>
          <Text style={styles.licenseText}>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions.
          </Text>
          <View style={styles.licenseTags}>
            <Text style={styles.tag}>Open Source</Text>
            <Text style={styles.tag}>Free Use</Text>
            <Text style={styles.tag}>MIT</Text>
          </View>
        </View>

        {/* Link */}
        <Text 
          style={styles.link}
          onPress={() => Linking.openURL('https://opensource.org/licenses/MIT')}>
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
    backgroundColor: '#F0F4F8',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#6BA7ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '500',
    color: '#1A2B3E',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E9AAB',
    marginBottom: 24,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 12,
    color: '#8E9AAB',
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2B3E',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E9AAB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A2B3E',
  },
  linkText: {
    color: '#6BA7ED',
  },
  licenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  licenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  licenseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6BA7ED',
    marginRight: 8,
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2B3E',
  },
  licenseYear: {
    fontSize: 13,
    color: '#8E9AAB',
    marginBottom: 14,
    marginLeft: 16,
  },
  licenseText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#5A6A7C',
    marginBottom: 16,
  },
  licenseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8EDF2',
  },
  tag: {
    fontSize: 11,
    color: '#6BA7ED',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    overflow: 'hidden',
  },
  link: {
    fontSize: 13,
    color: '#6BA7ED',
    textAlign: 'center',
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});