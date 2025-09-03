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
          paragraphs: 13, // Updated paragraph count
          description: 'A classic love story set in the beautiful city of Moscow.',
        },
      ],
    },
    'sci-fi': {
      // ... other stories
    }
  },
  'chinese-english': {
    // ... other stories
  }
} as const;
  
export const LANGUAGE_PAIRS = [
  { id: 'russian-english', label: 'Russian → English', flag: '🇷🇺→🇺🇸', native: 'Russian', target: 'English' },
  { id: 'chinese-english', label: 'Chinese → English', flag: '🇨🇳→🇺🇸', native: 'Chinese', target: 'English' }
] as const;