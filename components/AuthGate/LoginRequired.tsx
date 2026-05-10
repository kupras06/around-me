import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';

export default function LoginRequiredScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/login');
  };

  const handleDismiss = () => {
    // Go back to previous page or home
    router.back();
  };

  return (
    <BottomSheet
      visible={true}
      onRequestClose={handleDismiss}
      enableSwipeToClose={false}
      enableOverlayTapToClose={false}
      showHandleBar={false}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.lockIcon}>
            <Text style={styles.lockText}>🔒</Text>
          </View>
        </View>

        <Text variant="heading3" style={styles.title}>
          Sign In Required
        </Text>

        <Text variant="body1" style={styles.description}>
          Please sign in to access this feature and save your favorite places.
        </Text>

        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleLogin}>
            Sign In
          </Button>

          <Button variant="tertiary" onPress={handleDismiss}>
            Maybe Later
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing.large,
    alignItems: 'center',
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: theme.spacing.medium,
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.backgroundScreenSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.small,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.contentSecondary,
    marginBottom: theme.spacing.large,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.small,
  },
  signInButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
}));
