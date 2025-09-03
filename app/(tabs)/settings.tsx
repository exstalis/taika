// app/(tabs)/settings.tsx - Settings Tab for Language Preferences
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

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  const handleLanguageSettings = () => {
    Alert.alert(
      'Language Settings',
      'Language preference settings will be available in the next update!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleDifficultySettings = () => {
    Alert.alert(
      'Difficulty Settings',
      'Story difficulty preferences will be available in the next update!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Taika',
      'Taika - Bilingual Story Learning\nVersion 1.0.0\n\nLearn languages through engaging bilingual stories.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your learning experience</Text>

        {/* Learning Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Learning Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSettings}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Language Pairs</Text>
              <Text style={styles.settingSubtitle}>Manage your preferred language combinations</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDifficultySettings}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Story Difficulty</Text>
              <Text style={styles.settingSubtitle}>Set your preferred reading level</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Use dark theme for reading</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor={darkModeEnabled ? '#FFFFFF' : '#CCCCCC'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSubtitle}>Daily reading reminders</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#CCCCCC'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Auto-play Audio</Text>
              <Text style={styles.settingSubtitle}>Automatically play story audio (Coming Soon)</Text>
            </View>
            <Switch
              value={autoPlayEnabled}
              onValueChange={setAutoPlayEnabled}
              trackColor={{ false: '#333333', true: '#007AFF' }}
              thumbColor={autoPlayEnabled ? '#FFFFFF' : '#CCCCCC'}
              disabled={true}
            />
          </View>
        </View>

        {/* Reading Goals */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reading Goals</Text>
          
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Daily Goal</Text>
            <Text style={styles.goalValue}>15 minutes</Text>
            <Text style={styles.goalSubtitle}>Tap to change (Coming Soon)</Text>
          </View>

          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Weekly Goal</Text>
            <Text style={styles.goalValue}>3 stories</Text>
            <Text style={styles.goalSubtitle}>Tap to change (Coming Soon)</Text>
          </View>
        </View>

        {/* Support & Info */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support & Information</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>About Taika</Text>
              <Text style={styles.settingSubtitle}>Version and app information</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingSubtitle}>Get help with using Taika</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingSubtitle}>How we protect your data</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Taika v1.0.0 MVP</Text>
          <Text style={styles.versionSubtext}>Built with ❤️ for language learners</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60, // Account for status bar
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  settingArrow: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '300',
  },
  goalCard: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 12,
    color: '#888888',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#888888',
  },
});