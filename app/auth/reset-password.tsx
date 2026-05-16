import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword, updatePassword, loading, isRecoveringPassword } =
    useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to send reset email.'
      );
    }
  };

  const handlePasswordUpdate = async () => {
    setError(null);
    try {
      await updatePassword(password);
      setUpdated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update password.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text variant="heading3">
          {isRecoveringPassword ? 'Set a new password' : 'Reset password'}
        </Text>
        <Text variant="body2" style={styles.subtitle}>
          {isRecoveringPassword
            ? 'Enter your new password to finish recovering your account.'
            : "Enter the email associated with your account and we'll send reset instructions."}
        </Text>

        <View style={styles.form}>
          {isRecoveringPassword ? (
            <PasswordInput password={password} setPassword={setPassword} />
          ) : (
            <EmailInput email={email} setEmail={setEmail} />
          )}

          {error && (
            <Text
              variant="body3"
              style={styles.error}
            >
              {error}
            </Text>
          )}

          {!isRecoveringPassword && sent ? (
            <Text variant="body2" style={styles.message}>
              Instructions sent — check your inbox.
            </Text>
          ) : isRecoveringPassword && updated ? (
            <Text variant="body2" style={styles.message}>
              Password updated. You can continue to the app.
            </Text>
          ) : (
            <View style={styles.spacerMedium}>
              <Button
                onPress={
                  isRecoveringPassword ? handlePasswordUpdate : handleReset
                }
                size="large"
              >
                {loading
                  ? isRecoveringPassword
                    ? 'Updating...'
                    : 'Sending...'
                  : isRecoveringPassword
                    ? 'Update password'
                    : 'Send reset link'}
              </Button>
            </View>
          )}

          <View style={styles.spacerSmall}>
            <Button
              variant="tertiary"
              onPress={() => router.push(updated ? '/' : '/auth/login')}
            >
              {updated ? 'Continue' : 'Back to sign in'}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
    paddingTop: runtime.insets.top + theme.spacing.xlarge,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.xlarge,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: theme.spacing.small,
    color: theme.colors.contentSecondary,
  },
  form: {
    marginTop: theme.spacing.xxlarge,
  },
  error: {
    marginTop: theme.spacing.medium,
    color: theme.colors.sentimentNegative,
  },
  message: {
    marginTop: theme.spacing.medium,
  },
  spacerSmall: { height: theme.spacing.small },
  spacerMedium: { height: theme.spacing.medium },
}));
