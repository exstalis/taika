// app/(tabs)/progress.tsx - Optimized with useFocusEffect
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// Storage keys
const STORAGE_KEYS = {
  TOTAL_POINTS: '@taika_total_points',
  COMPLETED_STORIES: '@taika_completed_stories',
  READING_TIME: '@taika_reading_time'
};

export default function ProgressScreen() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [totalReadingTime, setTotalReadingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // This hook runs every time the user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      const loadProgressData = async () => {
        try {
          // Load total points
          const points = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
          setTotalPoints(points ? parseInt(points) : 0);

          // Load completed stories
          const stories = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
          setCompletedStories(stories ? JSON.parse(stories) : []);

          // Load reading time
          const readingTime = await AsyncStorage.getItem(STORAGE_KEYS.READING_TIME);
          setTotalReadingTime(readingTime ? parseInt(readingTime) : 0);

          setIsLoading(false);
        } catch (error) {
          console.log('Error loading progress data:', error);
          setIsLoading(false);
        }
      };

      loadProgressData();
    }, []) // Empty dependency array means this doesn't re-run unnecessarily
  );

  // Calculate stats
  const totalStoriesAvailable = 10; // This can be calculated dynamically later
  const progressPercentage = completedStories.length > 0 
    ? (completedStories.length / totalStoriesAvailable) * 100 
    : 0;
  const currentStreak = 1; // Placeholder

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your language learning journey</Text>

        {/* Points Display */}
        <View style={styles.pointsContainer}>
          <Text style={styles.sectionTitle}>Points Earned</Text>
          <View style={styles.pointsCard}>
            <Text style={styles.pointsNumber}>{totalPoints}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsSubtext}>Keep reading to earn more!</Text>
          </View>
        </View>

        {/* Reading Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Reading Statistics</Text>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedStories.length}</Text>
              <Text style={styles.statLabel}>Stories Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalReadingTime}</Text>
              <Text style={styles.statLabel}>Minutes Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Story Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Story Completion</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedStories.length} of {totalStoriesAvailable} free stories
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  pointsContainer: {
    marginBottom: 32,
  },
  pointsCard: {
    backgroundColor: '#111111',
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
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBarContainer: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
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
    color: '#CCCCCC',
    textAlign: 'center',
  },
});