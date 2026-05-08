import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTheme,
  setColor,
  setMode,
  toggleMode,
  type ThemeColor,
  type ThemeMode,
} from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  return {
    ...theme,
    setMode: (mode: ThemeMode) => dispatch(setMode(mode)),
    setColor: (color: ThemeColor) => dispatch(setColor(color)),
    toggleMode: () => dispatch(toggleMode()),
  };
};
