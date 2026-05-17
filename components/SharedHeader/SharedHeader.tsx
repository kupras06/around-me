import { useRouter, useSegments } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  ButtonRound,
  type Props as ButtonRoundProps,
} from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import {
  ContextMenu,
  type ContextMenuElement,
} from '@/craftrn-ui/components/ContextMenu/ContextMenu';
import { Text } from '@/craftrn-ui/components/Text';
import { useTheme } from '@/hooks/use-theme';
import { Brush } from '@/icons/BrushIcon';
import { CheckLarge } from '@/icons/CheckLargeIcon';
import { MoonIcon } from '@/icons/MoonIcon';
import { SunIcon } from '@/icons/SunIcon';
import { IconSymbol } from '../ui/icon-symbol';

type ThemeToggleButtonProps = {
  variant?: ButtonRoundProps['variant'];
};
type Props = {
  overlay?: boolean;
  title?: string;
};

export const ThemeToggleButton = ({
  variant = 'neutral',
}: ThemeToggleButtonProps) => {
  const { setModePreference, modePreference } = useTheme();
  const { theme } = useUnistyles();

  const menuItems: ContextMenuElement[] = useMemo(
    () => [
      {
        id: 'system',
        label: 'System',
        itemLeft: <Brush size={20} color={theme.colors.contentPrimary} />,
        itemRight:
          modePreference === 'system' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setModePreference('system'),
      },
      {
        type: 'divider',
        id: 'divider-1',
      },
      {
        id: 'light',
        label: 'Light',
        itemLeft: <SunIcon color={theme.colors.contentPrimary} size={20} />,
        itemRight:
          modePreference === 'light' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setModePreference('light'),
      },
      {
        id: 'dark',
        label: 'Dark',
        itemLeft: <MoonIcon color={theme.colors.contentPrimary} size={20} />,
        itemRight:
          modePreference === 'dark' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setModePreference('dark'),
      },
    ],
    [modePreference, setModePreference, theme]
  );

  return (
    <ContextMenu
      items={menuItems}
      menuAnchorPosition="bottom-right"
      trigger={(onPress) => (
        <ButtonRound
          onPress={onPress}
          accessibilityLabel="Change theme"
          animationConfig={{ scaleIn: 1.1 }}
          variant={variant}
          renderContent={({ iconSize,  }) => (
            <IconSymbol name="swatchpalette.fill" size={iconSize} color="contentPrimary" />
          )}
        />
      )}
    />
  );
};

export default function SharedHeader({ title }: Props) {
  const router = useRouter();
  const segments = useSegments();
  const known = ['index', 'saved', 'creators', 'profile'];
  const current =
    title ||
    (segments
      .slice()
      .reverse()
      .find((s) => known.includes(s)) as string) ||
    'index';

  const pageTitle =
    current === 'index'
      ? 'Map'
      : current.charAt(0).toUpperCase() + current.slice(1);

  return (
    <View style={[styles.header]}>
      <View style={styles.titleWrapper}>
        <Text variant="heading3" style={styles.titleText}>
          {pageTitle}
        </Text>
      </View>
      <View style={styles.actionWrapper}>
        <Pressable style={styles.side} onPress={() => router.push('/search')}>
          <IconSymbol name="magnifyingglass" size={24} />
        </Pressable>
        <ThemeToggleButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    minHeight: 56,
    height: 60 + rt.insets.top,
    paddingTop: rt.insets.top,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.colors.backgroundScreen,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
}));
