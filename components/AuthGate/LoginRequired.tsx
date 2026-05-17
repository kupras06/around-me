import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';

const DEFAULT_DESCRIPTION =
  'Please sign in to access this feature and save your favorite places.';

type LoginRequiredProps = {
  redirectTo: string;
  errorDescription?: string;
};

export default function LoginRequiredScreen({
  redirectTo,
  errorDescription = DEFAULT_DESCRIPTION,
}: LoginRequiredProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.replace(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  };

  const handleDismiss = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <BottomSheet
      visible={true}
      onRequestClose={handleDismiss}
      enableSwipeToClose={false}
      enableOverlayTapToClose={false}
      showHandleBar={false}
    >
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <IconSymbol name="lock" size={24} />
        </View>

        <Text variant="heading3" style={styles.title}>
          Sign In Required
        </Text>

        <Text variant="body2" style={styles.description}>
          {errorDescription}
        </Text>

        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleLogin} size="large">
            Sign In
          </Button>
          <Button variant="tertiary" onPress={handleDismiss} size="large">
            Maybe Later
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    margin: theme.spacing.large,
    padding: theme.spacing.large,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.borderRadius.large,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.backgroundScreenSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.medium,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.small,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.contentSecondary,
    marginBottom: theme.spacing.large,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.small,
  },
}));
