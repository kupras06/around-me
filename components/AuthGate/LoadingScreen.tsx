import { ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/craftrn-ui/components/Text';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconSymbol name="location" size={28} />
      </View>
      <ActivityIndicator size="small"  />
      <Text variant="body2" style={styles.label}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundScreen,
    gap: theme.spacing.medium,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundScreenSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.small,
  },
  spinner: {
    color: theme.colors.contentAccentSecondary,
  },
  label: {
    color: theme.colors.contentTertiary,
  },
}));
