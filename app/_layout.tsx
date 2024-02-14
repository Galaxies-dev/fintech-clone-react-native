import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = () => {
  const router = useRouter();
  return (
    // <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: '',
            headerBackTitle: '',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </>
  );
};
