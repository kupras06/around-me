import { createMMKV } from 'react-native-mmkv';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = 'light' | 'dark';

const storage = createMMKV({
  id: 'around-me-theme',
});

const THEME_PREFERENCE_KEY = 'theme-preference';

export const getStoredThemePreference = (): ThemePreference => {
  const storedValue = storage.getString(THEME_PREFERENCE_KEY);

  if (storedValue === 'light' || storedValue === 'dark' || storedValue === 'system') {
    return storedValue;
  }

  return 'system';
};

export const setStoredThemePreference = (preference: ThemePreference) => {
  storage.set(THEME_PREFERENCE_KEY, preference);
};
