// app/story/[id].tsx
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { STORY_DATABASE } from '@/constants/stories';
import { useTheme } from '@/context/ThemeContext';

// --- Dynamic Content Loader ---
// In a real app, this would be an API call: `fetch('https://api.myapp.com/stories/${id}')`
// For now, it maps IDs to local JSON files.
const getStoryContent = (id: string) => {
  switch (id) {
    case 'ru_en_romance_beg_001':
      return require('@/assets/stories/ru_en_romance_beg_001.json');
    case 'ru_en_scifi_beg_002':
      return require('@/assets/stories/ru_en_scifi_beg_002.json');
    case 'fr_en_mystery_beg_001':
      return require('@/assets/stories/fr_en_mystery_beg_001.json');
    // ... you would add a case for every story ID
    default:
      return null;
  }
};

// This helper function can stay, as it's efficient for finding metadata.
function findStoryById(id: string | undefined) {
    // ... (no changes needed to this function)
    if (!id) return undefined;
    for (const lang of Object.values(STORY_DATABASE)) {
        for (const difficulty of Object.values(lang)) {
            const story = difficulty.find((s: { id: string }) => s.id === id);
            if (story) return story;
        }
    }
    return undefined;
}

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const storyInfo = findStoryById(id);
  
  // Use our new loader function
  const storyContent = id ? getStoryContent(id) : null;

  // --- Dynamic styles (no changes needed) ---
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

// --- Styles (no changes needed) ---
const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 50 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18 },
  header: { marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2C2C2E' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22 },
  storyContent: { marginTop: 16 },
  paragraphPair: { marginBottom: 24, borderRadius: 12, padding: 16 },
  targetLanguageText: { fontSize: 18, lineHeight: 26, marginBottom: 12 },
  knownLanguageText: { fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
});