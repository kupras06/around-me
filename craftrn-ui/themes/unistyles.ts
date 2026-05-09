import { StyleSheet } from 'react-native-unistyles';
import { aroundmeDarkTheme, aroundmeLightTheme } from './config';

type AppThemes = {
  aroundmeLight: typeof aroundmeLightTheme;
  aroundmeDark: typeof aroundmeDarkTheme;
};

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    aroundmeLight: aroundmeLightTheme,
    aroundmeDark: aroundmeDarkTheme,
  },
  settings: {
    initialTheme: 'aroundmeLight',
  },
});

