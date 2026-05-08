import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export type ThemeColor = 'teal' | 'orange';
export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  color: ThemeColor;
  mode: ThemeMode;
};

const initialState: ThemeState = {
  color: 'teal',
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setColor: (state, action: PayloadAction<ThemeColor>) => {
      state.color = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setMode, setColor, toggleMode } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme;

export default themeSlice.reducer;
