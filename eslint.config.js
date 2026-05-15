const { fixupPluginRules } = require('@eslint/compat');
const expoConfig = require('eslint-config-expo/flat');
const reactNative = require('eslint-plugin-react-native');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  ...expoConfig,
  {
    plugins: {
      'react-native': fixupPluginRules(reactNative),
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': ['error', { skip: ['Text', 'Animated.Text', 'RNText'] }],
      'react-native/sort-styles': ['warn', 'asc'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'android/*', 'ios/*'],
  },
];
