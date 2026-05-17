// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

type IconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialIcons>['name']
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  magnifyingglass: 'search',
  'line.3.horizontal': 'menu',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  ellipsis: 'more-horiz',

  // User / Profile
  person: 'person',
  'person.fill': 'person',
  'person.2.fill': 'groups',
  'person.crop.circle': 'account-circle',

  // Visibility
  eye: 'visibility',
  'eye.slash': 'visibility-off',

  // Communication
  'paperplane.fill': 'send',
  envelope: 'mail',
  phone: 'phone',

  // Location / Map
  location: 'location-on',
  map: 'map',
  mappin: 'place',
  'mappin.circle.fill': 'place',
  safari: 'explore',

  // Actions
  heart: 'favorite-border',
  'heart.fill': 'favorite',
  bookmark: 'bookmark-border',
  'bookmark.fill': 'bookmark',
  // squareandarrowup: '',
  link: 'link',

  // Media
  camera: 'photo-camera',
  photo: 'image',
  play: 'play-arrow',

  // Settings / System
  gearshape: 'settings',
  bell: 'notifications-none',
  'bell.fill': 'notifications',
  lock: 'lock',
  'rectangle.portrait.and.arrow.right': 'logout',

  // Status
  checkmark: 'check',
  xmark: 'close',
  exclamationmark: 'error-outline',
  info: 'info-outline',

  // Content
  plus: 'add',
  minus: 'remove',
  pencil: 'edit',
  trash: 'delete-outline',
  'swatchpalette.fill': 'palette',

  // Dev
  'chevron.left.forwardslash.chevron.right': 'code',
  'arrow.right.circle': 'logout',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const { theme } = useUnistyles();
  return (
    <MaterialIcons
      size={size}
      name={MAPPING[name] || name}
      color={color || theme.colors.interactiveNeutral}
      style={style}
    />
  );
}
