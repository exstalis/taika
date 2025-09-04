// app/story/[id].tsx
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { STORY_DATABASE } from '@/constants/stories';
import { useTheme } from '@/context/ThemeContext'; // 1. Import the theme hook

import ru_en_romance_beg_001 from '@/assets/stories/ru_en_romance_beg_001.json';
import ru_en_scifi_beg_002 from '@/assets/stories/ru_en_scifi_beg_002.json';

const storyContentMap = {
  ru_en_romance_beg_001,
  ru_en_scifi_beg_002,
};
// Helper function to find a story by its ID
function findStoryById(id: string | undefined) {
  if (!id) return undefined;

  for (const lang of Object.values(STORY_DATABASE)) {
    for (const category of Object.values(lang)) {
      for (const difficulty of Object.values(category)) {
        const story = difficulty.find((s: { id: string }) => s.id === id);
        if (story) return story;
      }
    }
  }
  return undefined;
}

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme(); // 2. Get the current theme
  const storyInfo = findStoryById(id);
  const storyContent = id ? storyContentMap[id as keyof typeof storyContentMap] : null;
  // 3. Create dynamic styles based on the theme
  const containerStyle = { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' };
  const textStyle = { color: theme === 'dark' ? '#FFFFFF' : '#000000' };
  const descriptionStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };
  const pairStyle = { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7' };
  const knownTextStyle = { color: theme === 'dark' ? '#8E8E93' : '#6E6E73' };

  if (!storyInfo || !storyContent) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Story not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Stack.Screen options={{ title: storyInfo.title, headerBackTitle: 'Library' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, textStyle]}>{storyInfo.title}</Text>
          <Text style={[styles.description, descriptionStyle]}>{storyInfo.description}</Text>
        </View>

        <View style={styles.storyContent}>
          {storyContent.content.map((pair: { target: string; known: string }, index: number) => (
            <View key={index} style={[styles.paragraphPair, pairStyle]}>
              <Text style={[styles.targetLanguageText, textStyle]}>{pair.target}</Text>
              <Text style={[styles.knownLanguageText, knownTextStyle]}>{pair.known}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 4. Update the StyleSheet to remove hardcoded colors
const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 50 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18 },
  header: { marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22 },
  storyContent: { marginTop: 16 },
  paragraphPair: { marginBottom: 24, borderRadius: 12, padding: 16 },
  targetLanguageText: { fontSize: 18, lineHeight: 26, marginBottom: 12 },
  knownLanguageText: { fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
});
