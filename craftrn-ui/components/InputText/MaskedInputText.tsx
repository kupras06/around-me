import { Platform, View } from 'react-native';
import {
  MaskedTextInput,
  type MaskedTextInputProps,
} from 'react-native-advanced-input-mask';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from '../Text';

type Size = 'small' | 'medium' | 'large';

export type InputTextProps = MaskedTextInputProps & {
  /**
   * Optional label shown above the input.
   */
  label?: string;

  /**
   * Input size.
   * @default 'medium'
   */
  size?: Size;

  /**
   * Error message shown below the input.
   */
  error?: string;

  /**
   * Optional left accessory.
   */
  itemLeft?: React.ReactNode;

  /**
   * Optional right accessory.
   */
  itemRight?: React.ReactNode;
};

export const InputText =
  ({
    label,
    size = 'medium',
    error,
    itemLeft,
    itemRight,
    style,
    editable = true,
    readOnly = false,
    ...restProps
  }:InputTextProps) => {
    const { theme } = useUnistyles();

    return (
      <View style={styles.wrapper}>
        {label && (
          <Text variant="body3" color="contentSecondary" style={styles.label}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.container({
              size,
              error: !!error,
              disabled: !editable || readOnly,
            }),
          ]}
        >
          {itemLeft && <View style={styles.itemLeft}>{itemLeft}</View>}
          <MaskedTextInput
            autocomplete={false}
            keyboardType="numeric"
            {...restProps}
            editable={editable && !readOnly}
            placeholderTextColor={theme.colors.contentTertiary}
            selectionColor={theme.colors.contentAccentSecondary}
            style={[
              styles.input({
                size,
              }),
              style,
            ]}
          />

          {itemRight && <View style={styles.itemRight}>{itemRight}</View>}
        </View>

        {error && (
          <Text variant="body3" color="sentimentNegative" style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    );
  }

const styles = StyleSheet.create((theme) => {
  const getTypography = (size: Size) => {
    switch (size) {
      case 'small':
        return theme.textVariants.body3;
      case 'large':
        return theme.textVariants.body1;
      default:
        return theme.textVariants.body2;
    }
  };

  const getHeight = (size: Size) => {
    switch (size) {
      case 'small':
        return 40;

      case 'large':
        return 56;

      case 'medium':
      default:
        return 48;
    }
  };

  return {
    wrapper: {
      width: '100%',
    },

    label: {
      marginBottom: theme.spacing.xsmall,
    },

    container: ({
      size,
      error,
      disabled,
    }: {
      size: Size;
      error: boolean;
      disabled: boolean;
    }) => ({
      minHeight: getHeight(size),
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: error
        ? theme.colors.sentimentNegative
        : theme.colors.borderNeutralSecondary,
      backgroundColor: disabled ? 'gray' : theme.colors.backgroundElevated,
      paddingHorizontal: theme.spacing.small,
      flexDirection: 'row',
      alignItems: 'center',
      opacity: disabled ? 0.6 : 1,
    }),

    input: ({ size }: { size: Size }) => {
      const typography = getTypography(size);
      return {
        flex: 1,
        minWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        color: theme.colors.contentPrimary,

        ...typography,

        ...(Platform.OS === 'android' && {
          textAlignVertical: 'center' as const,
        }),
      };
    },

    itemLeft: {
      marginRight: theme.spacing.xsmall,
    },

    itemRight: {
      marginLeft: theme.spacing.xsmall,
    },

    error: {
      marginTop: theme.spacing.xsmall,
    },
  };
});
