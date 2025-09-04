// app/(tabs)/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORY_DATABASE, LANGUAGE_PAIRS } from '@/constants/stories';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

// --- Types (Good practice for a larger app) ---
type LanguagePair = (typeof LANGUAGE_PAIRS)[number];
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type FilterType = 'all' | 'completed' | 'new' | 'bookmarked';

const STORAGE_KEYS = {
  COMPLETED_STORIES: '@taika_completed_stories',
  BOOKMARKED_STORIES: '@taika_bookmarked_stories',
};

export default function LibraryScreen() {
  const { theme } = useTheme();
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair['id']>('ru-en');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>([]);
  const [bookmarkedStoryIds, setBookmarkedStoryIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  // --- New State for Language Modal ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Load User Data ---
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const completed = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
          if (completed) setCompletedStoryIds(JSON.parse(completed));

          const bookmarked = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_STORIES);
          if (bookmarked) setBookmarkedStoryIds(JSON.parse(bookmarked));
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };
      loadUserData();
    }, [])
  );

  const currentLanguage = useMemo(() => LANGUAGE_PAIRS.find(p => p.id === selectedLanguagePair), [selectedLanguagePair]);

  // --- Memoized Story Filtering Logic ---
  const filteredStories = useMemo(() => {
    const storiesForLang = STORY_DATABASE[selectedLanguagePair as keyof typeof STORY_DATABASE];
    if (!storiesForLang) return [];

    const storiesForDifficulty = storiesForLang[difficulty as keyof typeof storiesForLang] || [];
    
    switch (filterType) {
      case 'completed':
        return storiesForDifficulty.filter(story => completedStoryIds.includes(story.id));
      case 'new':
        return storiesForDifficulty.filter(story => !completedStoryIds.includes(story.id));
      case 'bookmarked':
          return storiesForDifficulty.filter(story => bookmarkedStoryIds.includes(story.id));
      default:
        return storiesForDifficulty;
    }
  }, [selectedLanguagePair, difficulty, filterType, completedStoryIds, bookmarkedStoryIds]);

  const stats = useMemo(() => {
      const storiesForLang = STORY_DATABASE[selectedLanguagePair as keyof typeof STORY_DATABASE];
      if (!storiesForLang) return { total: 0, completed: 0, remaining: 0, bookmarked: 0 };
      const allStories = storiesForLang[difficulty] || [];
      const completed = allStories.filter(story => completedStoryIds.includes(story.id)).length;
      const bookmarked = allStories.filter(story => bookmarkedStoryIds.includes(story.id)).length;
      return { total: allStories.length, completed, remaining: allStories.length - completed, bookmarked };
  }, [selectedLanguagePair, difficulty, completedStoryIds, bookmarkedStoryIds]);

  const selectStory = (story: { id: string }) => {
    router.push({ pathname: '/story/[id]', params: { id: story.id } });
  };
  
  const handleSelectLanguage = (pair: LanguagePair) => {
    setSelectedLanguagePair(pair.id);
    setIsModalVisible(false);
    setSearchQuery('');
  };

  const filteredLanguagePairs = useMemo(() => 
    LANGUAGE_PAIRS.filter(pair => 
      pair.label.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  // --- Dynamic Styles ---
  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const subtitleStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const itemStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF' };
  const selectedDifficultyStyle = { backgroundColor: '#007AFF' };
  const difficultyTextStyle = { color: '#FFFFFF' };
  const modalStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7' };
  const inputStyle = { color: textStyle.color, backgroundColor: theme === 'dark' ? '#2C2C2E' : '#FFFFFF' };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- Header --- */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, textStyle]}>Story Library</Text>
          <Text style={[styles.subtitle, subtitleStyle]}>Browse and select your favorite stories</Text>
        </View>

        {/* --- Language Selector Button --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Language Pair</Text>
          <TouchableOpacity style={[styles.languageSelectorButton, itemStyle]} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.languageFlag}>{currentLanguage?.flag}</Text>
            <Text style={[styles.languageSelectorText, textStyle]}>{currentLanguage?.label}</Text>
            <Text style={styles.languageSelectorArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* --- Difficulty Selector --- */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Difficulty</Text>
          <View style={styles.difficultyButtons}>
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(level => (
              <TouchableOpacity
                key={level}
                style={[styles.difficultyButton, itemStyle, difficulty === level && selectedDifficultyStyle]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[styles.difficultyButtonText, difficulty === level ? difficultyTextStyle : textStyle]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* --- Story List (No changes needed here) --- */}
        <View style={styles.storyListContainer}>
          <Text style={[styles.sectionTitle, textStyle]}>Stories</Text>
          {filteredStories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📚</Text>
              <Text style={[styles.emptyStateTitle, subtitleStyle]}>No stories for this level yet.</Text>
            </View>
          ) : (
            <View style={styles.storyGrid}>
              {filteredStories.map((story, index) => (
                <TouchableOpacity
                  key={story.id}
                  style={[styles.storyCard, itemStyle]}
                  onPress={() => selectStory(story)}
                >
                  <Text style={[styles.storyTitle, textStyle]}>{story.title}</Text>
                  <Text style={[styles.storyDescription, subtitleStyle]}>{story.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- Language Selection Modal --- */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <SafeAreaView style={[styles.modalContainer, modalStyle]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, textStyle]}>Select Language</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder="Search languages..."
            placeholderTextColor={subtitleStyle.color}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredLanguagePairs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectLanguage(item)}>
                <Text style={styles.modalItemFlag}>{item.flag}</Text>
                <Text style={[styles.modalItemText, textStyle]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles (Updated for new components) ---
const styles = StyleSheet.create({
  // Keep existing styles...
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  headerSection: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center' },
  sectionContainer: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  languageSelectorButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12 },
  languageFlag: { fontSize: 24, marginRight: 12 },
  languageSelectorText: { flex: 1, fontSize: 16, fontWeight: '600' },
  languageSelectorArrow: { fontSize: 16 },
  difficultyButtons: { flexDirection: 'row', gap: 12 },
  difficultyButton: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  difficultyButtonText: { fontWeight: '600' },
  storyListContainer: {},
  storyGrid: { gap: 16 },
  storyCard: { borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  storyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  storyDescription: { fontSize: 14, lineHeight: 20 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyStateIcon: { fontSize: 48, marginBottom: 16 },
  emptyStateTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  // Modal Styles
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalCloseButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  searchInput: { height: 44, margin: 20, paddingHorizontal: 16, borderRadius: 12, fontSize: 16 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  modalItemFlag: { fontSize: 24, marginRight: 16 },
  modalItemText: { fontSize: 16 },
});