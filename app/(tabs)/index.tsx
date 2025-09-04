import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORY_DATABASE, LANGUAGE_PAIRS } from '@/constants/stories';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

type LanguagePairId = typeof LANGUAGE_PAIRS[number]['id'];
type Difficulty = 'beginner' | 'intermediate';

const STORAGE_KEYS = {
  COMPLETED_STORIES: '@taika_completed_stories',
  BOOKMARKED_STORIES: '@taika_bookmarked_stories',
};

export default function LibraryScreen() {
  const { theme } = useTheme();
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePairId>('russian-english');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>([]);
  const [bookmarkedStoryIds, setBookmarkedStoryIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'new' | 'bookmarked'>('all');

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const completedStories = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
          if (completedStories) setCompletedStoryIds(JSON.parse(completedStories));

          const bookmarkedStories = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_STORIES);
          if (bookmarkedStories) setBookmarkedStoryIds(JSON.parse(bookmarkedStories));
        } catch (error) {
          console.log('Error loading user data:', error);
        }
      };
      loadUserData();
    }, [])
  );

  const toggleBookmark = async (storyId: string) => {
    try {
      let updatedBookmarks;
      if (bookmarkedStoryIds.includes(storyId)) {
        updatedBookmarks = bookmarkedStoryIds.filter(id => id !== storyId);
      } else {
        updatedBookmarks = [...bookmarkedStoryIds, storyId];
      }
      setBookmarkedStoryIds(updatedBookmarks);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKED_STORIES, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.log('Error toggling bookmark:', error);
    }
  };

  const selectStory = (story: { id: string }) => {
    router.push({
      pathname: '/story/[id]',
      params: { id: story.id },
    });
  };

  const getStoriesForCurrentLanguage = () => {
    const languageData = STORY_DATABASE[selectedLanguagePair];
    if (!languageData) return [];
    const allGenres = Object.values(languageData);
    const allStories = allGenres.flatMap((genre: any) => genre[difficulty] || []);
    return allStories;
  };
  
  const getFilteredStories = () => {
    const allStories = getStoriesForCurrentLanguage();
    switch (filterType) {
      case 'completed':
        return allStories.filter(story => completedStoryIds.includes(story.id));
      case 'new':
        return allStories.filter(story => !completedStoryIds.includes(story.id));
      case 'bookmarked':
        return allStories.filter(story => bookmarkedStoryIds.includes(`${selectedLanguagePair}_${story.title}`));
      default:
        return allStories;
    }
  };

  const getStoryStats = () => {
    const allStories = getStoriesForCurrentLanguage();
    const completed = allStories.filter(story => completedStoryIds.includes(story.id)).length;
    const bookmarked = allStories.filter(story => bookmarkedStoryIds.includes(`${selectedLanguagePair}_${story.title}`)).length;
    return {
      total: allStories.length,
      completed,
      remaining: allStories.length - completed,
      bookmarked,
    };
  };

  const filteredStories = getFilteredStories();
  const stats = getStoryStats();

  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const subtitleStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const itemStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF' };
  const selectedDifficultyStyle = { backgroundColor: '#007AFF' };
  const difficultyTextStyle = { color: '#FFFFFF' };
  const selectedLanguageButtonTextStyle = { color: theme === 'dark' ? '#007AFF' : '#007AFF' };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, textStyle]}>Story Library</Text>
          <Text style={[styles.subtitle, subtitleStyle]}>Browse and select your favorite stories</Text>
        </View>

        <View style={styles.languageSelectorContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Language Pair</Text>
          <View style={styles.languageButtons}>
            {LANGUAGE_PAIRS.map((pair) => (
              <TouchableOpacity
                key={pair.id}
                style={[styles.languageButton, itemStyle, selectedLanguagePair === pair.id && styles.selectedLanguageButton]}
                onPress={() => setSelectedLanguagePair(pair.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.languageFlag}>{pair.flag}</Text>
                <Text style={[styles.languageButtonText, textStyle, selectedLanguagePair === pair.id && selectedLanguageButtonTextStyle]}>
                  {pair.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Difficulty</Text>
          <View style={styles.difficultyButtons}>
            <TouchableOpacity
              style={[styles.difficultyButton, itemStyle, difficulty === 'beginner' && selectedDifficultyStyle]}
              onPress={() => setDifficulty('beginner')}
            >
              <Text style={[styles.difficultyButtonText, difficultyTextStyle]}>
                Beginner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.difficultyButton, itemStyle, difficulty === 'intermediate' && selectedDifficultyStyle]}
              onPress={() => setDifficulty('intermediate')}
            >
              <Text style={[styles.difficultyButtonText, difficultyTextStyle]}>
                Intermediate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Your Progress</Text>
          <View style={[styles.statsGrid, itemStyle]}>
            <View style={styles.statCard}><Text style={[styles.statNumber, textStyle]}>{stats.total}</Text><Text style={[styles.statLabel, subtitleStyle]}>Total Stories</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNumber, styles.completedStat]}>{stats.completed}</Text><Text style={[styles.statLabel, subtitleStyle]}>Completed</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNumber, styles.remainingStat]}>{stats.remaining}</Text><Text style={[styles.statLabel, subtitleStyle]}>Remaining</Text></View>
            <View style={styles.statCard}><Text style={[styles.statNumber, styles.bookmarkedStat]}>{stats.bookmarked}</Text><Text style={[styles.statLabel, subtitleStyle]}>Bookmarked</Text></View>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Filter Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            <View style={styles.filterButtons}>
              {[{ key: 'all', label: 'All Stories', count: stats.total }, { key: 'new', label: 'New', count: stats.remaining }, { key: 'completed', label: 'Completed', count: stats.completed }, { key: 'bookmarked', label: 'Bookmarked', count: stats.bookmarked }].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[styles.filterButton, itemStyle, filterType === filter.key && styles.selectedFilterButton]}
                  onPress={() => setFilterType(filter.key as any)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterButtonText, subtitleStyle, filterType === filter.key && styles.selectedFilterButtonText]}>{filter.label}</Text>
                  {filter.count > 0 && (<View style={[styles.filterBadge, filterType === filter.key && styles.selectedFilterBadge]}><Text style={[styles.filterBadgeText, filterType === filter.key && styles.selectedFilterBadgeText]}>{filter.count}</Text></View>)}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.storyListContainer}>
          {filteredStories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📚</Text>
              <Text style={[styles.emptyStateTitle, subtitleStyle]}>No stories found</Text>
            </View>
          ) : (
            <View style={styles.storyGrid}>
              {filteredStories.map((story, index) => {
                const storyId = `${selectedLanguagePair}_${story.title}`;
                const isCompleted = completedStoryIds.includes(story.id);
                const isBookmarked = bookmarkedStoryIds.includes(storyId);
                
                return (
                  <TouchableOpacity
                    key={story.id}
                    style={[styles.storyCard, itemStyle, isCompleted && styles.completedStoryCard]}
                    onPress={() => selectStory(story)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.storyCardHeader}>
                      <View style={styles.storyNumberContainer}>
                        <Text style={[styles.storyNumber, isCompleted && styles.completedStoryNumber]}>
                          {isCompleted ? '✓' : index + 1}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bookmarkButton}
                        onPress={() => toggleBookmark(storyId)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkedIcon]}>
                          {isBookmarked ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.storyCardContent}>
                      <Text style={[styles.storyTitle, textStyle, isCompleted && styles.completedStoryTitle]}>
                        {story.title}
                      </Text>
                      <Text style={[styles.storyDescription, subtitleStyle]}>
                        {story.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  languageSelectorContainer: {
    marginBottom: 32,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLanguageButton: {
    borderColor: '#007AFF',
  },
  languageFlag: {
    fontSize: 20,
    marginBottom: 8,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedLanguageButtonText: {
    color: '#007AFF',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedDifficultyButton: {
    backgroundColor: '#007AFF',
  },
  difficultyButtonText: {
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    padding: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  completedStat: {
    color: '#34C759',
  },
  remainingStat: {
    color: '#FF9500',
  },
  bookmarkedStat: {
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 32,
  },
  filterScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  filterButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedFilterButtonText: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  selectedFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  selectedFilterBadgeText: {
    color: '#FFFFFF',
  },
  storyListContainer: {
    marginBottom: 32,
  },
  storyGrid: {
    gap: 16,
  },
  storyCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  completedStoryCard: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  storyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedStoryNumber: {
    fontSize: 16,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: '#3A3A3C',
  },
  bookmarkedIcon: {
    color: '#FF9500',
  },
  storyCardContent: {
    gap: 8,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedStoryTitle: {
    color: '#34C759',
  },
  storyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});