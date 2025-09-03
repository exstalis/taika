// app/story/[id].tsx
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { STORY_DATABASE } from '@/constants/stories';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is where we will map story IDs to their JSON content files
// The 'require' statement bundles the JSON with your app
const storyContentMap = {
  'ru_en_romance_beg_001': require('../../assets/stories/ru_en_romance_beg_001.json'),
  // When you add a new story JSON file, you'll add a new entry here
};

const STORAGE_KEYS = {
  TOTAL_POINTS: '@taika_total_points',
  COMPLETED_STORIES: '@taika_completed_stories',
};

const findStoryById = (storyId: string | undefined) => {
  if (!storyId) return null;

  for (const langPair of Object.values(STORY_DATABASE)) {
    for (const genre of Object.values(langPair)) {
      for (const level of Object.values(genre)) {
        // We removed the "(level as any[])" part here
        const foundStory = level.find((story: { id: string }) => story.id === storyId);
        if (foundStory) {
          return foundStory as typeof foundStory & { points: number };
        }
      }
    }
  }
  return null;
};

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyInfo = findStoryById(id);
  const storyContent = id ? storyContentMap[id as keyof typeof storyContentMap] : null;

  const handleCompleteStory = async () => {
    // ... (This function remains the same as before)
  };

  if (!storyInfo || !storyContent) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.centered}><Text style={styles.errorText}>Story not found.</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: storyInfo.title, headerBackTitle: 'Library' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{storyInfo.title}</Text>
          <Text style={styles.description}>{storyInfo.description}</Text>
        </View>

        <View style={styles.storyContent}>
          {storyContent.content.map((pair: { target: string; known: string }, index: number) => (
            <View key={index} style={styles.paragraphPair}>
              <Text style={styles.targetLanguageText}>{pair.target}</Text>
              <Text style={styles.knownLanguageText}>{pair.known}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteStory} activeOpacity={0.8}>
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
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
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  storyContent: {
    marginTop: 16,
  },
  paragraphPair: {
    marginBottom: 24,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
  },
  targetLanguageText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 12,
  },
  knownLanguageText: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  completeButton: {
    backgroundColor: '#34C759', // A nice green color
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});