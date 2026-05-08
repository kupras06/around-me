import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTheme,
  setModePreference,
  toggleMode,
} from '@/store/slices/themeSlice';
import type { ThemePreference } from '@/lib/theme-preferences';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return {
    ...theme,
    setModePreference: (modePreference: ThemePreference) => dispatch(setModePreference(modePreference)),
    toggleMode: () => dispatch(toggleMode()),
  };
};
