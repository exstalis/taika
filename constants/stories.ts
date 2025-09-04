// constants/stories.ts

// A helper array of the languages you want to support.
const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'fr', name: 'French', flag: '🇫🇷' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'it', name: 'Italian', flag: '🇮🇹' },
  { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { id: 'ru', name: 'Russian', flag: '🇷🇺' },
];

// Dynamically generate all 42 language pair combinations.
// This is much more maintainable than a static list.
export const LANGUAGE_PAIRS = LANGUAGES.flatMap(target =>
  LANGUAGES.map(source => ({
    id: `${source.id}-${target.id}`,
    label: `${source.name} → ${target.name}`,
    flag: `${source.flag}→${target.flag}`,
    source: source.name,
    target: target.name,
  }))
).filter(p => p.id.split('-')[0] !== p.id.split('-')[1]); // Filter out pairs like 'en-en'

// The new STORY_DATABASE structure is simpler and ready for more content.
// We've removed the 'genre' layer and added 'advanced' difficulty.
export const STORY_DATABASE = {
  'ru-en': { // Russian to English
    beginner: [
      {
        id: 'ru_en_romance_beg_001',
        title: 'Anna and Dmitry',
        difficulty: 'beginner',
        points: 15,
        description: 'A classic love story set in the beautiful city of Moscow.',
      },
      {
        id: 'ru_en_scifi_beg_002',
        title: 'The Friendly Robot',
        difficulty: 'beginner',
        points: 10,
        description: 'A heartwarming story about helping a lost robot find home.',
      },
      // ... Add 18 more beginner stories for Russian-English
    ],
    intermediate: [
        // ... Add 20 intermediate stories for Russian-English
    ],
    advanced: [
        // ... Add 20 advanced stories for Russian-English
    ],
  },
  'fr-en': { // French to English
    beginner: [
        {
            id: 'fr_en_mystery_beg_001',
            title: 'The Secret of the Old Library',
            difficulty: 'beginner',
            points: 15,
            description: 'Two friends uncover a hidden message in a mysterious book.',
        },
        // ... Add 19 more beginner stories for French-English
    ],
    intermediate: [],
    advanced: [],
  },
  // ... You would add entries for all other 40 language pairs here.
  // Example: 'de-en', 'es-en', 'zh-en', 'it-en', 'en-ru', etc.
} as const;