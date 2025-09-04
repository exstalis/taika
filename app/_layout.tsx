// app/_layout.tsx
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Import our new ThemeProvider
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // We need a component that can access the theme context
  // to apply the correct theme from @react-navigation
  function AppContent() {
    const { theme } = useTheme();
    // The ThemeProvider from @react-navigation is different from ours.
    // We'll keep it for now as it provides default navigation colors.
    const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

    return (
      <NavigationThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    );
  }

  // The main layout now wraps everything in OUR ThemeProvider
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}