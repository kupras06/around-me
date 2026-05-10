import * as SecureStore from 'expo-secure-store';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = 'light' | 'dark';

const THEME_PREFERENCE_KEY = 'theme-preference';

export const getStoredThemePreference = (): ThemePreference => {
  const storedValue = SecureStore.getItem(THEME_PREFERENCE_KEY);

  if (
    storedValue === 'light' ||
    storedValue === 'dark' ||
    storedValue === 'system'
  ) {
    return storedValue;
  }

  return 'system';
};

export const setStoredThemePreference = (preference: ThemePreference) => {
  SecureStore.setItem(THEME_PREFERENCE_KEY, preference);
};
