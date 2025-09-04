// app/(tabs)/progress.tsx - Updated with Light/Dark Mode support
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext'; // 1. Import the theme hook

// Storage keys
const STORAGE_KEYS = {
  TOTAL_POINTS: '@taika_total_points',
  COMPLETED_STORIES: '@taika_completed_stories',
  READING_TIME: '@taika_reading_time'
};

export default function ProgressScreen() {
  const { theme } = useTheme(); // 2. Get the current theme
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [totalReadingTime, setTotalReadingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProgressData = async () => {
        setIsLoading(true);
        try {
          const points = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
          setTotalPoints(points ? parseInt(points) : 0);

          const stories = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
          setCompletedStories(stories ? JSON.parse(stories) : []);

          const readingTime = await AsyncStorage.getItem(STORAGE_KEYS.READING_TIME);
          setTotalReadingTime(readingTime ? parseInt(readingTime) : 0);
        } catch (error) {
          console.log('Error loading progress data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProgressData();
    }, [])
  );

  // 3. Create dynamic styles that change based on the theme
  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#F2F2F7' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const subtitleStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const cardStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF' };
  const progressTrackStyle = { backgroundColor: theme === 'dark' ? '#333333' : '#E5E5EA' };

  // Calculate stats
  const totalStoriesAvailable = 10;
  const progressPercentage = completedStories.length > 0 
    ? (completedStories.length / totalStoriesAvailable) * 100 
    : 0;
  const currentStreak = 1; // Placeholder

  if (isLoading) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.loadingText, subtitleStyle]}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, textStyle]}>Your Progress</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>Track your language learning journey</Text>

        {/* Points Display */}
        <View style={styles.pointsContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Points Earned</Text>
          <View style={[styles.pointsCard, cardStyle]}>
            <Text style={styles.pointsNumber}>{totalPoints}</Text>
            <Text style={[styles.pointsLabel, textStyle]}>Total Points</Text>
            <Text style={[styles.pointsSubtext, subtitleStyle]}>Keep reading to earn more!</Text>
          </View>
        </View>

        {/* Reading Statistics */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Reading Statistics</Text>
          <View style={[styles.statRow, cardStyle]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, textStyle]}>{completedStories.length}</Text>
              <Text style={[styles.statLabel, subtitleStyle]}>Stories Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, textStyle]}>{totalReadingTime}</Text>
              <Text style={[styles.statLabel, subtitleStyle]}>Minutes Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, textStyle]}>{currentStreak}</Text>
              <Text style={[styles.statLabel, subtitleStyle]}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Story Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Story Completion</Text>
          <View style={[styles.progressBarCard, cardStyle]}>
            <View style={[styles.progressBar, progressTrackStyle]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, subtitleStyle]}>
              {completedStories.length} of {totalStoriesAvailable} free stories
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 4. Update StyleSheet to be color-agnostic
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  pointsContainer: {
    marginBottom: 32,
  },
  pointsCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  pointsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pointsSubtext: {
    fontSize: 14,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBarCard: {
    padding: 16,
    borderRadius: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
});