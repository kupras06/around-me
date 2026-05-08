import { useTheme } from '@/hooks/useTheme';
import {
  ButtonRound,
  type Props as ButtonRoundProps,
} from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { ContextMenu, ContextMenuElement } from '@/craftrn-ui/components/ContextMenu/ContextMenu';
import { MoonIcon } from '@/icons/MoonIcon';
import { SunIcon } from '@/icons/SunIcon';
import { Brush } from '@/tetrisly-icons/Brush';
import { CheckLarge } from '@/tetrisly-icons/CheckLarge';
import React, { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

type ThemeToggleButtonProps = {
  variant?: ButtonRoundProps['variant'];
};

export const ThemeToggleButton = ({ variant = 'neutral' }: ThemeToggleButtonProps) => {
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
    [modePreference, setModePreference, theme],
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
          renderContent={({ iconSize, iconColor }) => <Brush size={iconSize} color={iconColor} />}
        />
      )}
    />
  );
};
