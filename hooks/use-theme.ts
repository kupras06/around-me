import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ThemePreference } from '@/lib/theme-preference';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTheme,
  setModePreference,
  toggleMode,
} from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return {
    ...theme,
    setModePreference: (modePreference: ThemePreference) =>
      dispatch(setModePreference(modePreference)),
    toggleMode: () => dispatch(toggleMode()),
  };
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
