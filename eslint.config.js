const { fixupPluginRules } = require('@eslint/compat');
const expoConfig = require('eslint-config-expo/flat');
const reactNative = require('eslint-plugin-react-native');

module.exports = [
  ...expoConfig,

  {
    plugins: {
      'react-native': fixupPluginRules(reactNative),
    },

    rules: {
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',

      'react-native/no-raw-text': [
        'error',
        { skip: ['Text', 'Animated.Text', 'RNText', 'Button'] },
      ],

      'react-native/sort-styles': ['warn', 'asc'],

      // REMOVE THIS:
      // '@typescript-eslint/no-unused-vars': [...]

      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  {
    ignores: [
      'dist/*',
      '.expo/*',
      'android/*',
      'ios/*',
      'supabase/*',
      'craftrn-ui/*',
    ],
  },
];