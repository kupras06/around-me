import { AppStateEffects } from '@/components/AppStateEffects/AppStateEffects';
import '@/craftrn-ui/themes/unistyles';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { Provider as ReduxProvider } from 'react-redux';

import { useTheme } from '@/hooks/useTheme';
import { store } from '@/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { mode } = useTheme();

  return (
    <NavigationThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <GestureHandlerRootView>
        <ReduxProvider store={store}>
          <AppStateEffects />
          <AppContent />
        </ReduxProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}