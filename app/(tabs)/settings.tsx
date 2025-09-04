// app/(tabs)/settings.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext'; // Import our theme hook

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme(); // Use the global theme

  // Local state for settings that aren't theme-related
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  // --- Helper Functions for Placeholders ---
  const handleLanguageSettings = () => Alert.alert('Language Settings', 'This feature is coming soon!');
  const handleDifficultySettings = () => Alert.alert('Difficulty Settings', 'This feature is coming soon!');
  const handleAbout = () => Alert.alert('About Taika', 'Taika - Bilingual Story Learning\nVersion 1.0.0');

  // --- Dynamic Styles based on the theme ---
  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#F2F2F7' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const subtitleStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const itemStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF' };
  const arrowStyle = { color: theme === 'dark' ? '#666666' : '#C7C7CC' };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, textStyle]}>Settings</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>Customize your learning experience</Text>

        {/* Learning Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Learning Preferences</Text>
          <TouchableOpacity style={[styles.settingItem, itemStyle]} onPress={handleLanguageSettings}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, textStyle]}>Language Pairs</Text>
              <Text style={[styles.settingSubtitle, subtitleStyle]}>Manage your preferred language combinations</Text>
            </View>
            <Text style={[styles.settingArrow, arrowStyle]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, itemStyle]} onPress={handleDifficultySettings}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, textStyle]}>Story Difficulty</Text>
              <Text style={[styles.settingSubtitle, subtitleStyle]}>Set your preferred reading level</Text>
            </View>
            <Text style={[styles.settingArrow, arrowStyle]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>App Preferences</Text>
          <View style={[styles.settingItem, itemStyle]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, textStyle]}>Dark Mode</Text>
              <Text style={[styles.settingSubtitle, subtitleStyle]}>Use dark theme for reading</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={[styles.settingItem, itemStyle]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, textStyle]}>Notifications</Text>
              <Text style={[styles.settingSubtitle, subtitleStyle]}>Daily reading reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        {/* Support & Info */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Support & Information</Text>
          <TouchableOpacity style={[styles.settingItem, itemStyle]} onPress={handleAbout}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, textStyle]}>About Taika</Text>
              <Text style={[styles.settingSubtitle, subtitleStyle]}>Version and app information</Text>
            </View>
            <Text style={[styles.settingArrow, arrowStyle]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Taika v1.0.0 MVP</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});