// components/TaikaStories.tsx - Sophisticated Natu-Lang Design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// [Same story database and logic as before - keeping functionality identical]
const STORY_DATABASE = {
  'russian-english': {
    'sci-fi': {
      beginner: [
        {
          id: 'ru_en_scifi_beg_001',
          title: 'The Blue Planet Discovery',
          difficulty: 'beginner',
          points: 10,
          paragraphs: [
            {
              russian: "Маша смотрела на звёзды через большое окно космического корабля. Они сверкали как маленькие бриллианты в тёмном космосе. Вдруг она заметила что-то странное между звёздами. Это была планета необычного синего цвета, которую она никогда раньше не видела.",
              english: "Masha looked at the stars through the large spaceship window. They sparkled like tiny diamonds in the dark space. Suddenly she noticed something strange between the stars. It was a planet of unusual blue color that she had never seen before."
            },
            {
              russian: "Капитан корабля быстро подошёл к Маше и тоже посмотрел на планету. Его глаза широко открылись от удивления. 'Мы должны приземлиться там и исследовать эту планету!' - сказал он взволнованно. Маша согласно кивнула головой, чувствуя как её сердце бьётся от волнения.",
              english: "The ship's captain quickly approached Masha and also looked at the planet. His eyes opened wide with surprise. 'We must land there and explore this planet!' he said excitedly. Masha nodded in agreement, feeling her heart beating with excitement."
            },
            {
              russian: "Через час космический корабль медленно опустился на поверхность синей планеты. Команда надела специальные костюмы и вышла наружу. Планета была покрыта странными растениями, которые светились мягким голубым светом. Воздух пах сладко, как цветы весной на Земле.",
              english: "After an hour, the spaceship slowly descended to the surface of the blue planet. The crew put on special suits and went outside. The planet was covered with strange plants that glowed with soft blue light. The air smelled sweet, like spring flowers on Earth."
            }
          ]
        }
        // [Other stories here - same data structure]
      ]
    }
  },
  'chinese-english': {
    'sci-fi': {
      beginner: [
        {
          id: 'cn_en_scifi_beg_001',
          title: 'The Robot Friend',
          difficulty: 'beginner',
          points: 10,
          paragraphs: [
            {
              chinese: "小明是一个十二岁的男孩，住在未来的城市里。每天早上他都会看到机器人在街上工作。有一天，他在公园里发现了一个小机器人坐在长椅上。这个机器人看起来很伤心，小明决定去帮助它。",
              english: "Xiao Ming was a twelve-year-old boy who lived in a futuristic city. Every morning he would see robots working on the streets. One day, he found a small robot sitting on a bench in the park. The robot looked very sad, and Xiao Ming decided to help it."
            }
            // [More paragraphs...]
          ]
        }
        // [Other stories...]
      ]
    }
  }
} as const;

const LANGUAGE_PAIRS = [
  { id: 'russian-english', label: 'Russian → English', native: 'Russian', target: 'English' },
  { id: 'chinese-english', label: 'Chinese → English', native: 'Chinese', target: 'English' }
] as const;

type LanguagePairId = typeof LANGUAGE_PAIRS[number]['id'];

const STORAGE_KEYS = {
  TOTAL_POINTS: '@taika_total_points',
  COMPLETED_STORIES: '@taika_completed_stories',
  READING_TIME: '@taika_reading_time'
};

const { width } = Dimensions.get('window');

export default function TaikaStories() {
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'reading' | 'complete'>('setup');
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePairId>('russian-english');
  const [story, setStory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStoryTitle, setCurrentStoryTitle] = useState('');
  const [currentStoryPoints, setCurrentStoryPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showPointsEarned, setShowPointsEarned] = useState(false);
  const [startReadingTime, setStartReadingTime] = useState<number | null>(null);
  const [totalReadingTime, setTotalReadingTime] = useState(0);
  const [completedStoryIds, setCompletedStoryIds] = useState<string[]>([]);

  // [All the same logic functions as before - no changes to functionality]
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const points = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_POINTS);
      if (points) {
        setTotalPoints(parseInt(points));
      }
      
      const readingTime = await AsyncStorage.getItem(STORAGE_KEYS.READING_TIME);
      if (readingTime) {
        setTotalReadingTime(parseInt(readingTime));
      }

      const completedStories = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
      if (completedStories) {
        const stories = JSON.parse(completedStories);
        setCompletedStoryIds(stories);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveReadingTime = async (additionalMinutes: number) => {
    try {
      const updatedTime = totalReadingTime + additionalMinutes;
      await AsyncStorage.setItem(STORAGE_KEYS.READING_TIME, updatedTime.toString());
      setTotalReadingTime(updatedTime);
    } catch (error) {
      console.log('Error saving reading time:', error);
    }
  };

  const savePoints = async (newPoints: number) => {
    try {
      const updatedTotal = totalPoints + newPoints;
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_POINTS, updatedTotal.toString());
      setTotalPoints(updatedTotal);
    } catch (error) {
      console.log('Error saving points:', error);
    }
  };

  const saveCompletedStory = async (storyId: string) => {
    try {
      const completedStories = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
      const stories = completedStories ? JSON.parse(completedStories) : [];
      
      if (!stories.includes(storyId)) {
        stories.push(storyId);
        await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_STORIES, JSON.stringify(stories));
        setCompletedStoryIds(stories);
      }
    } catch (error) {
      console.log('Error saving completed story:', error);
    }
  };

  const generateStory = () => {
    const stories = STORY_DATABASE[selectedLanguagePair]?.['sci-fi']?.beginner || [];
    
    if (stories.length === 0) {
      Alert.alert('Coming Soon!', `${selectedLanguagePair} stories are being prepared!`);
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const selectedStory = stories[Math.floor(Math.random() * stories.length)];
      setStory([...selectedStory.paragraphs]);
      setCurrentStoryTitle(selectedStory.title);
      setCurrentStoryPoints(selectedStory.points);
      setCurrentPage(0);
      setStartReadingTime(Date.now());
      setIsGenerating(false);
      setCurrentScreen('reading');
    }, 2000);
  };

  const selectSpecificStory = (storyTitle: string) => {
    const stories = STORY_DATABASE[selectedLanguagePair]?.['sci-fi']?.beginner || [];
    
    const selectedStory = stories.find(story => story.title === storyTitle);
    if (!selectedStory) return;

    setIsGenerating(true);
    setTimeout(() => {
      setStory([...selectedStory.paragraphs]);
      setCurrentStoryTitle(selectedStory.title);
      setCurrentStoryPoints(selectedStory.points);
      setCurrentPage(0);
      setStartReadingTime(Date.now());
      setIsGenerating(false);
      setCurrentScreen('reading');
    }, 1500);
  };

  const nextPage = () => {
    if (currentPage < story.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      completeStory();
    }
  };

  const completeStory = async () => {
    const storyId = `${selectedLanguagePair}_${currentStoryTitle}`;
    const isFirstTime = !completedStoryIds.includes(storyId);
    
    if (startReadingTime) {
      const endTime = Date.now();
      const readingDurationMs = endTime - startReadingTime;
      const readingDurationMinutes = Math.ceil(readingDurationMs / (1000 * 60));
      await saveReadingTime(readingDurationMinutes);
    }
    
    if (isFirstTime) {
      await savePoints(currentStoryPoints);
      await saveCompletedStory(storyId);
      setShowPointsEarned(true);
    } else {
      setShowPointsEarned(false);
    }
    
    setCurrentScreen('complete');
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetApp = () => {
    setCurrentScreen('setup');
    setStory([]);
    setCurrentPage(0);
    setShowPointsEarned(false);
    setStartReadingTime(null);
  };

  const getLanguageTexts = (paragraph: any) => {
    const pair = selectedLanguagePair.split('-');
    const nativeLanguage = pair[0];
    
    if (nativeLanguage === 'chinese') {
      return {
        native: paragraph.chinese || 'Text not available',
        target: paragraph.english || 'Text not available'
      };
    } else {
      return {
        native: paragraph.russian || 'Text not available',
        target: paragraph.english || 'Text not available'
      };
    }
  };

  // Setup Screen - SOPHISTICATED REDESIGN
  if (currentScreen === 'setup') {
    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.appTitle}>Taika</Text>
            <Text style={styles.appSubtitle}>Learn languages through stories</Text>
            
            {/* Points Display */}
            {totalPoints > 0 && (
              <View style={styles.pointsCard}>
                <View style={styles.pointsIconContainer}>
                  <Text style={styles.pointsIcon}>⭐</Text>
                </View>
                <View style={styles.pointsTextContainer}>
                  <Text style={styles.pointsNumber}>{totalPoints}</Text>
                  <Text style={styles.pointsLabel}>Points earned</Text>
                </View>
              </View>
            )}
          </View>

          {/* Language Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Choose your language pair</Text>
            <View style={styles.languageGrid}>
              {LANGUAGE_PAIRS.map((pair) => (
                <TouchableOpacity
                  key={pair.id}
                  style={[
                    styles.languageCard,
                    selectedLanguagePair === pair.id && styles.selectedLanguageCard
                  ]}
                  onPress={() => setSelectedLanguagePair(pair.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.languageCardContent}>
                    <Text style={[
                      styles.languageCardTitle,
                      selectedLanguagePair === pair.id && styles.selectedLanguageCardTitle
                    ]}>
                      {pair.label}
                    </Text>
                    <Text style={styles.languageCardSubtitle}>
                      Read in {pair.native}, learn {pair.target}
                    </Text>
                  </View>
                  {selectedLanguagePair === pair.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={generateStory}
              activeOpacity={0.8}
            >
              <View style={styles.primaryButtonContent}>
                <Text style={styles.primaryButtonIcon}>🎲</Text>
                <Text style={styles.primaryButtonText}>Surprise me!</Text>
              </View>
              <Text style={styles.primaryButtonSubtext}>Get a random story</Text>
            </TouchableOpacity>

            {/* Story Selection */}
            <View style={styles.storySelectionContainer}>
              <Text style={styles.sectionTitle}>Or choose a specific story</Text>
              <View style={styles.storyGrid}>
                {STORY_DATABASE[selectedLanguagePair]?.['sci-fi']?.beginner?.map((story, index) => {
                  const storyId = `${selectedLanguagePair}_${story.title}`;
                  const isCompleted = completedStoryIds.includes(storyId);
                  
                  return (
                    <TouchableOpacity
                      key={story.id}
                      style={[
                        styles.storyCard,
                        isCompleted && styles.completedStoryCard
                      ]}
                      onPress={() => selectSpecificStory(story.title)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.storyCardHeader}>
                        <View style={styles.storyNumber}>
                          <Text style={styles.storyNumberText}>
                            {isCompleted ? '✓' : index + 1}
                          </Text>
                        </View>
                        <View style={styles.storyCardContent}>
                          <Text style={[
                            styles.storyCardTitle,
                            isCompleted && styles.completedStoryTitle
                          ]}>
                            {story.title}
                          </Text>
                          <View style={styles.storyCardMeta}>
                            <Text style={styles.storyCardPoints}>{story.points} points</Text>
                            {isCompleted && (
                              <Text style={styles.completedBadge}>Completed</Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Loading Screen - SOPHISTICATED REDESIGN
  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingAnimation}>
            <Text style={styles.loadingIcon}>📖</Text>
          </View>
          <Text style={styles.loadingTitle}>Preparing your story</Text>
          <Text style={styles.loadingSubtitle}>Finding the perfect bilingual adventure...</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  // Reading Screen - SOPHISTICATED REDESIGN
  if (currentScreen === 'reading') {
    const currentParagraph = story[currentPage];
    const { native, target } = getLanguageTexts(currentParagraph);
    
    return (
      <View style={styles.readingContainer}>
        {/* Reading Header */}
        <View style={styles.readingHeader}>
          <View style={styles.progressSection}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${((currentPage + 1) / story.length) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentPage + 1} of {story.length}
              </Text>
            </View>
          </View>

          <View style={styles.storyInfo}>
            <Text style={styles.readingStoryTitle}>{currentStoryTitle}</Text>
            <Text style={styles.readingStoryMeta}>{currentStoryPoints} points</Text>
          </View>
        </View>

        {/* Story Content */}
        <View style={styles.storyContent}>
          <View style={styles.textContainer}>
            <View style={styles.nativeTextSection}>
              <Text style={styles.nativeText}>{native}</Text>
            </View>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.targetTextSection}>
              <Text style={styles.targetText}>{target}</Text>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity 
            style={[
              styles.navButton,
              styles.prevButton,
              currentPage === 0 && styles.disabledNavButton
            ]}
            onPress={prevPage}
            disabled={currentPage === 0}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.navButtonText,
              currentPage === 0 && styles.disabledNavText
            ]}>
              ← Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]} 
            onPress={nextPage}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>
              {currentPage === story.length - 1 ? 'Complete' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Complete Screen - SOPHISTICATED REDESIGN
  if (currentScreen === 'complete') {
    return (
      <View style={styles.completeContainer}>
        <View style={styles.completeContent}>
          <View style={styles.completeIconContainer}>
            <Text style={styles.completeIcon}>🎉</Text>
          </View>
          
          <Text style={styles.completeTitle}>Story Complete!</Text>
          
          {showPointsEarned ? (
            <View style={styles.pointsEarnedCard}>
              <Text style={styles.pointsEarnedText}>+{currentStoryPoints} Points</Text>
              <Text style={styles.totalPointsText}>Total: {totalPoints} points</Text>
            </View>
          ) : (
            <View style={styles.rereadCard}>
              <Text style={styles.rereadText}>Thanks for re-reading!</Text>
              <Text style={styles.rereadSubtext}>You've already earned points for this story</Text>
            </View>
          )}
          
          <Text style={styles.completeMessage}>
            Great job reading in both languages! Keep building your skills.
          </Text>
          
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={resetApp}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 24,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pointsIconContainer: {
    marginRight: 12,
  },
  pointsIcon: {
    fontSize: 24,
  },
  pointsTextContainer: {
    alignItems: 'flex-start',
  },
  pointsNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    lineHeight: 24,
  },
  pointsLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Section Styling
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },

  // Language Selection
  languageGrid: {
    gap: 12,
  },
  languageCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedLanguageCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderColor: '#007AFF',
  },
  languageCardContent: {
    flex: 1,
  },
  languageCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  selectedLanguageCardTitle: {
    color: '#007AFF',
  },
  languageCardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Action Section
  actionSection: {
    gap: 32,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Story Selection
  storySelectionContainer: {
    // gap: 16,
  },
  storyGrid: {
    gap: 12,
  },
  storyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  completedStoryCard: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  storyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  storyNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  storyCardContent: {
    flex: 1,
  },
  storyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  completedStoryTitle: {
    color: '#34C759',
  },
  storyCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storyCardPoints: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  completedBadge: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingAnimation: {
    marginBottom: 24,
  },
  loadingIcon: {
    fontSize: 64,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  dot1: {
    // Animation would be added here
  },
  dot2: {
    // Animation would be added here
  },
  dot3: {
    // Animation would be added here
  },

  // Reading Screen
  readingContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  readingHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  storyInfo: {
    alignItems: 'center',
  },
  readingStoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  readingStoryMeta: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },

  // Story Content
  storyContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  nativeTextSection: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    minHeight: 200,
    overflow: 'hidden', // Ensure content stays within bounds
  },
  nativeText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'left',
    fontWeight: '400',
    width: '100%', // Ensure text takes full width
    flexWrap: 'wrap', // Allow text to wrap
    flexShrink: 1, // Allow text to shrink if needed
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#2C2C2E',
    borderRadius: 1,
  },
  targetTextSection: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
    minHeight: 200,
    overflow: 'hidden', // Ensure content stays within bounds
  },
  targetText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8E8E93',
    textAlign: 'left',
    fontWeight: '400',
    width: '100%', // Ensure text takes full width
    flexWrap: 'wrap', // Allow text to wrap
    flexShrink: 1, // Allow text to shrink if needed
  },

  // Navigation
  navigationSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledNavButton: {
    backgroundColor: '#0A0A0A',
    borderColor: '#1C1C1E',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledNavText: {
    color: '#3A3A3C',
  },

  // Complete Screen
  completeContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    maxWidth: 400,
  },
  completeIconContainer: {
    marginBottom: 24,
  },
  completeIcon: {
    fontSize: 80,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 38,
  },
  pointsEarnedCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    minWidth: 200,
  },
  pointsEarnedText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  totalPointsText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  rereadCard: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    minWidth: 200,
  },
  rereadText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    textAlign: 'center',
  },
  rereadSubtext: {
    fontSize: 14,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 18,
  },
  completeMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});