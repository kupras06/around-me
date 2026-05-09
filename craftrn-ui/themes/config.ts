export const colors = {
  white: '#ffffff',
  black: '#141312',

  primaryLight: '#9f3214',
  primaryLightPress: '#872103',
  primaryLightContainer: '#c04a2a',
  onPrimaryLight: '#ffffff',
  onPrimaryLightContainer: '#fff3f0',

  primaryDark: '#ffb4a3',
  primaryDarkPress: '#ffdad2',
  primaryDarkContainer: '#e0755c',
  onPrimaryDark: '#5f1505',
  onPrimaryDarkContainer: '#591102',

  secondaryLight: '#126874',
  secondaryLightPress: '#1a6c78',
  secondaryLightContainer: '#a3ebf9',
  onSecondaryLight: '#ffffff',
  onSecondaryLightContainer: '#1a6c78',

  secondaryDark: '#69d6e8',
  secondaryDarkPress: '#9cefff',
  secondaryDarkContainer: '#209fb0',
  onSecondaryDark: '#00363d',
  onSecondaryDarkContainer: '#002f35',

  tertiaryLight: '#00607c',
  tertiaryLightContainer: '#007a9d',
  onTertiaryLight: '#ffffff',
  onTertiaryLightContainer: '#ecf8ff',

  tertiaryDark: '#cac6c4',
  tertiaryDarkContainer: '#969391',
  onTertiaryDark: '#31302f',
  onTertiaryDarkContainer: '#2d2c2b',

  surfaceLight: '#fff8f6',
  surfaceLightLow: '#fff1ed',
  surfaceLightContainer: '#ffe9e4',
  surfaceLightHigh: '#fae3de',
  surfaceLightHighest: '#f4ded8',
  onSurfaceLight: '#251916',
  onSurfaceLightVariant: '#58423c',
  outlineLight: '#8b716a',
  outlineLightVariant: '#dfc0b8',
  inverseSurfaceLight: '#3b2d2a',
  inverseOnSurfaceLight: '#ffede9',

  surfaceDark: '#141312',
  surfaceDarkLow: '#1d1b1a',
  surfaceDarkContainer: '#211f1e',
  surfaceDarkHigh: '#2b2a28',
  surfaceDarkHighest: '#363433',
  onSurfaceDark: '#e6e1df',
  onSurfaceDarkVariant: '#dcc0ba',
  outlineDark: '#a48b86',
  outlineDarkVariant: '#56423e',
  inverseSurfaceDark: '#e6e1df',
  inverseOnSurfaceDark: '#32302f',

  errorLight: '#ba1a1a',
  onErrorLight: '#ffffff',
  errorSecondaryLight: '#ffdad6',
  errorDark: '#ffb4ab',
  onErrorDark: '#690005',
  errorSecondaryDark: '#93000a',

  successLight: '#427b18',
  successSecondaryLight: '#effae7',
  successDark: '#c5e9a8',
  successSecondaryDark: '#070e03',

  diningAmber: '#ba7517',
  experienceGray: '#8b716a',
  creatorPurple: '#544171',
  creatorMaroon: '#714148',
  creatorSteel: '#415171',
  creatorForest: '#456138',
} as const;

const fontSizes = {
  xxlarge: {
    fontSize: 32,
    lineHeight: 40,
  },
  xlarge: {
    fontSize: 24,
    lineHeight: 32,
  },
  large: {
    fontSize: 18,
    lineHeight: 24,
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  xsmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  xxsmall: {
    fontSize: 10,
    lineHeight: 12,
  },
} as const;

const baseTheme = {
  colors: {
    transparent: 'transparent',
    white: colors.white,
    black: colors.black,
    purple: colors.creatorPurple,
    maroon: colors.creatorMaroon,
    steel: colors.creatorSteel,
    forest: colors.creatorForest,
    sunshine: colors.diningAmber,
    red: colors.errorLight,
    green: colors.successLight,
    blue: colors.secondaryLight,
  },
  borderRadius: {
    xsmall: 4,
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    xxlarge: 24,
    full: 999,
  },
  fontSizes,
  spacing: {
    xxsmall: 2,
    xsmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },
  textVariants: {
    heading1: {
      ...fontSizes.xxlarge,
      fontWeight: '500' as const,
      letterSpacing: -0.6,
    },
    heading2: {
      ...fontSizes.xlarge,
      fontWeight: '500' as const,
      letterSpacing: -0.3,
    },
    heading3: {
      ...fontSizes.large,
      fontWeight: '500' as const,
    },
    body1: {
      ...fontSizes.medium,
      fontWeight: '400' as const,
    },
    body2: {
      ...fontSizes.small,
      fontWeight: '400' as const,
    },
    body3: {
      ...fontSizes.xsmall,
      fontWeight: '400' as const,
    },
    body4: {
      ...fontSizes.xxsmall,
      fontWeight: '500' as const,
      letterSpacing: 0.3,
    },
  },
} as const;

const baseLight = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    informativePrimary: colors.secondaryLight,
    sentimentNegative: colors.errorLight,
    sentimentNegativePress: colors.primaryLightPress,
    sentimentSecondaryNegative: colors.errorSecondaryLight,
    sentimentSecondaryNegativePress: '#f4c7c2',
    sentimentPositive: colors.successLight,
    sentimentPositivePress: '#305911',
    sentimentSecondaryPositive: colors.successSecondaryLight,
    sentimentSecondaryPositivePress: '#e2f6d3',
  },
} as const;

const baseDark = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    informativePrimary: colors.secondaryDark,
    sentimentNegative: colors.errorDark,
    sentimentNegativePress: colors.errorSecondaryLight,
    sentimentSecondaryNegative: colors.errorSecondaryDark,
    sentimentSecondaryNegativePress: '#690005',
    sentimentPositive: colors.successDark,
    sentimentPositivePress: '#e2f6d3',
    sentimentSecondaryPositive: colors.successSecondaryDark,
    sentimentSecondaryPositivePress: '#0f1b05',
  },
} as const;

export const aroundmeLightTheme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    interactivePrimary: colors.primaryLightContainer,
    interactivePrimaryPress: colors.primaryLight,
    interactivePrimaryContent: colors.onPrimaryLight,
    interactivePrimaryContentPress: colors.onPrimaryLightContainer,

    interactiveSecondary: colors.secondaryLightContainer,
    interactiveSecondaryPress: colors.secondaryDark,
    interactiveSecondaryContent: colors.onSecondaryLightContainer,
    interactiveSecondaryContentPress: colors.onSecondaryDark,

    interactiveNeutral: colors.white,
    interactiveNeutralPress: colors.surfaceLightHigh,
    interactiveNeutralContent: colors.onSurfaceLight,
    interactiveNeutralContentPress: colors.onSurfaceLightVariant,

    interactiveNeutralSecondary: colors.surfaceLightLow,
    interactiveNeutralSecondaryPress: colors.surfaceLightContainer,

    interactiveNeutralReversed: colors.inverseSurfaceLight,
    interactiveNeutralReversedPress: colors.onSurfaceLightVariant,
    interactiveNeutralReversedContent: colors.inverseOnSurfaceLight,
    interactiveNeutralReversedContentPress: colors.white,

    backgroundScreen: colors.surfaceLight,
    backgroundScreenSecondary: colors.surfaceLightLow,
    backgroundElevated: colors.white,
    backgroundNeutral: `${colors.outlineLightVariant}40`,
    backgroundOverlay: `${colors.secondaryLight}33`,

    baseLight: colors.white,
    baseDark: colors.black,

    borderNeutral: colors.outlineLightVariant,
    borderNeutralSecondary: colors.outlineLight,

    contentPrimary: colors.onSurfaceLight,
    contentSecondary: colors.onSurfaceLightVariant,
    contentTertiary: colors.outlineLight,
    contentAccent: colors.primaryLight,
    contentAccentSecondary: colors.primaryLightContainer,
  },
} as const;

export const aroundmeDarkTheme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    interactivePrimary: colors.primaryDarkContainer,
    interactivePrimaryPress: colors.primaryDark,
    interactivePrimaryContent: colors.onPrimaryDark,
    interactivePrimaryContentPress: colors.onPrimaryDarkContainer,

    interactiveSecondary: colors.surfaceDarkHigh,
    interactiveSecondaryPress: colors.surfaceDarkHighest,
    interactiveSecondaryContent: colors.secondaryDark,
    interactiveSecondaryContentPress: colors.secondaryDarkPress,

    interactiveNeutral: colors.surfaceDarkHigh,
    interactiveNeutralPress: colors.surfaceDarkHighest,
    interactiveNeutralContent: colors.onSurfaceDark,
    interactiveNeutralContentPress: colors.onSurfaceDarkVariant,

    interactiveNeutralSecondary: colors.surfaceDarkLow,
    interactiveNeutralSecondaryPress: colors.surfaceDarkContainer,

    interactiveNeutralReversed: colors.inverseSurfaceDark,
    interactiveNeutralReversedPress: colors.tertiaryDarkContainer,
    interactiveNeutralReversedContent: colors.inverseOnSurfaceDark,
    interactiveNeutralReversedContentPress: colors.black,

    backgroundScreen: colors.surfaceDark,
    backgroundScreenSecondary: colors.surfaceDarkLow,
    backgroundElevated: colors.surfaceDarkLow,
    backgroundNeutral: `${colors.outlineDarkVariant}50`,
    backgroundOverlay: `${colors.secondaryDark}33`,

    baseLight: colors.white,
    baseDark: colors.black,

    borderNeutral: colors.outlineDarkVariant,
    borderNeutralSecondary: colors.outlineDark,

    contentPrimary: colors.onSurfaceDark,
    contentSecondary: colors.onSurfaceDarkVariant,
    contentTertiary: colors.outlineDark,
    contentAccent: colors.primaryDark,
    contentAccentSecondary: colors.primaryDarkContainer,
  },
} as const;

export type Theme = typeof aroundmeLightTheme | typeof aroundmeDarkTheme;