// app/story/[id].tsx
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { STORY_DATABASE } from '@/constants/stories';
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COMPLETED_STORIES: '@taika_completed_stories',
};

// (No changes to the dynamic content loader and helper function)
const getStoryContent = (id: string) => {
  switch (id) {
    case 'ru_en_romance_beg_001':
      return require('@/assets/stories/ru_en_romance_beg_001.json');
    case 'ru_en_scifi_beg_002':
      return require('@/assets/stories/ru_en_scifi_beg_002.json');
    case 'fr_en_mystery_beg_001':
      return require('@/assets/stories/fr_en_mystery_beg_001.json');
    default:
      return null;
  }
};

function findStoryById(id: string | undefined) {
    if (!id) return undefined;
    for (const lang of Object.values(STORY_DATABASE)) {
        for (const difficulty of Object.values(lang)) {
            const story = (difficulty as any[]).find((s: { id: string }) => s.id === id);
            if (story) return story;
        }
    }
    return undefined;
}


export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const storyInfo = findStoryById(id);
  const storyContent = id ? getStoryContent(id) : null;
  
  // --- NEW: State for navigation and completion ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkIfCompleted = async () => {
      if (!id) return;
      const completedStoriesStr = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
      const completedStories = completedStoriesStr ? JSON.parse(completedStoriesStr) : [];
      if (completedStories.includes(id)) {
        setIsCompleted(true);
      }
    };
    checkIfCompleted();
  }, [id]);
  
  // --- NEW: Function to mark story as complete ---
  const handleMarkComplete = async () => {
    if (!id) return;
    try {
      const completedStoriesStr = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
      let completedStories = completedStoriesStr ? JSON.parse(completedStoriesStr) : [];
      if (!completedStories.includes(id)) {
        completedStories.push(id);
        await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_STORIES, JSON.stringify(completedStories));
      }
      // Navigate back to the library screen
      router.back();
    } catch (error) {
      console.error("Failed to save completion status:", error);
    }
  };

  const handleNext = () => {
    if (storyContent && currentIndex < storyContent.content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleMarkComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const descriptionStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const pairStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7' };
  const knownTextStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };

  if (!storyInfo || !storyContent) {
    return (
      <SafeAreaView style={[containerStyle, styles.centered]}>
        <Text style={[styles.errorText, textStyle]}>Story not found.</Text>
      </SafeAreaView>
    );
  }

  const currentPair = storyContent.content[currentIndex];
  const isLastPage = currentIndex === storyContent.content.length - 1;

  return (
    <SafeAreaView style={containerStyle}>
      <Stack.Screen options={{ title: storyInfo.title, headerBackTitle: 'Library' }} />
      <View style={styles.contentContainer}>
        {isCompleted && (
          <View style={styles.completedBanner}>
            <Text style={styles.completedBannerText}>✓ You've completed this story before</Text>
          </View>
        )}
        <View style={styles.paragraphPair} >
            <Text style={[styles.targetLanguageText, textStyle]}>{currentPair.target}</Text>
            <Text style={[styles.knownLanguageText, knownTextStyle]}>{currentPair.known}</Text>
        </View>
      </View>
      
      {/* --- NEW: Navigation Controls --- */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]} 
          onPress={handlePrev} 
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, textStyle]}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLastPage ? 'Mark Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18 },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  paragraphPair: {
    padding: 16,
  },
  targetLanguageText: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 24,
    textAlign: 'center',
  },
  knownLanguageText: {
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#111111',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedBanner: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    alignItems: 'center',
    marginBottom: 20,
  },
  completedBannerText: {
    color: '#34C759',
    fontWeight: '600',
  },
});