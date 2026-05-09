import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

import { getStoredThemePreference, type ResolvedThemeMode, type ThemePreference } from '@/lib/theme-preference';
import type { RootState } from '@/store';

type ThemeState = {
  modePreference: ThemePreference;
  mode: ResolvedThemeMode;
};

const getSystemMode = (): ResolvedThemeMode =>
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

const initialPreference = getStoredThemePreference();

const initialState: ThemeState = {
  modePreference: initialPreference,
  mode: initialPreference === 'system' ? getSystemMode() : initialPreference,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setModePreference: (state, action: PayloadAction<ThemePreference>) => {
      state.modePreference = action.payload;
      state.mode = action.payload === 'system' ? getSystemMode() : action.payload;
    },
    setResolvedMode: (state, action: PayloadAction<ResolvedThemeMode>) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.modePreference = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { setModePreference, setResolvedMode, toggleMode } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme;

export default themeSlice.reducer;