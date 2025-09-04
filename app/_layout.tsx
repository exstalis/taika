import { auth } from '@/firebaseconfig'; // Import your Firebase auth instance
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;

    // onAuthStateChanged returns an unsubscriber
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [loaded]);

  useEffect(() => {
    if (loading) return; // Wait until the auth state is confirmed

    // If the user is logged in, redirect them to the main app.
    // Otherwise, redirect them to the auth screen.
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [user, loading]);

  // Show a loading indicator while we check the auth state
  if (loading || !loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // This part of the layout will be active once the redirect happens
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}