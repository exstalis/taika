// constants/stories.ts

// constants/stories.ts

// constants/stories.ts

export const STORY_DATABASE = {
  'russian-english': {
    romance: {
      beginner: [
        {
          id: 'ru_en_romance_beg_001',
          title: 'Anna and Dmitry',
          difficulty: 'beginner',
          points: 15,
          paragraphs: 13,
          description: 'A classic love story set in the beautiful city of Moscow.',
        },
      ],
      intermediate: [ // New Intermediate Level
        {
          id: 'ru_en_romance_int_001',
          title: 'The Long Wait',
          difficulty: 'intermediate',
          points: 25,
          paragraphs: 20,
          description: 'A story of two friends separated by distance and time.',
          content: [],
        }
      ]
    },
    'sci-fi': {
      beginner: [
        {
          id: 'ru_en_scifi_beg_001',
          title: 'The Blue Planet Discovery',
          difficulty: 'beginner',
          points: 10,
          paragraphs: 3,
          description: 'A space adventure about discovering a mysterious blue planet',
          content: []
        },
        {
          id: 'ru_en_scifi_beg_002',
          title: 'The Friendly Robot',
          difficulty: 'beginner',
          points: 10,
          paragraphs: 3,
          description: 'A heartwarming story about helping a lost robot find home',
          content: []
        },
      ]
    }
  },
  'chinese-english': {
    // ...
  }
} as const;

// ... LANGUAGE_PAIRS remains the same
  
export const LANGUAGE_PAIRS = [
  { id: 'russian-english', label: 'Russian → English', flag: '🇷🇺→🇺🇸', native: 'Russian', target: 'English' },
  { id: 'chinese-english', label: 'Chinese → English', flag: '🇨🇳→🇺🇸', native: 'Chinese', target: 'English' }
] as const;