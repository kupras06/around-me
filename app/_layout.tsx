import '@/craftrn-ui/themes/unistyles';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  // Temporarily bypass theme system to fix Redux context issue
  const mode = 'light';

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <GestureHandlerRootView>
        <ReduxProvider store={store}>
          <AppContent />
        </ReduxProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}