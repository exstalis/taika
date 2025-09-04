// app/(tabs)/settings.tsx
// app/(tabs)/settings.tsx
import { useTheme } from '@/context/ThemeContext'; // Import our theme hook
import { auth } from '@/firebaseconfig'; // 1. Import Firebase auth
import { signOut } from 'firebase/auth'; // 1. Import the signOut function
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme(); // Use the global theme

  // Local state for settings that aren't theme-related
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 2. Create the handleSignOut function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Our listener in _layout.tsx will handle the redirect automatically!
    } catch (error) {
      console.log('Error signing out:', error);
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  // --- Helper Functions for Placeholders ---
  const handleLanguageSettings = () => Alert.alert('Language Settings', 'This feature is coming soon!');
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

        {/* App Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>App Preferences</Text>
          <View style={[styles.settingItem, itemStyle]}>
            <Text style={[styles.settingTitle, textStyle]}>Dark Mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={[styles.settingItem, itemStyle]}>
            <Text style={[styles.settingTitle, textStyle]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Account</Text>
          {/* 3. Add the Sign Out button to the UI */}
          <TouchableOpacity
            style={[styles.settingItem, itemStyle, styles.signOutButton]}
            onPress={handleSignOut}>
            <Text style={[styles.settingTitle, styles.signOutText]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Support & Info */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Support & Information</Text>
          <TouchableOpacity style={[styles.settingItem, itemStyle]} onPress={handleAbout}>
            <Text style={[styles.settingTitle, textStyle]}>About Taika</Text>
            <Text style={[styles.settingArrow, arrowStyle]}>›</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  signOutButton: {
    justifyContent: 'center',
  },
  signOutText: {
    color: '#FF3B30', // A red color for sign out actions
    textAlign: 'center',
  },
});