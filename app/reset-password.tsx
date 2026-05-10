import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/useAuth';

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
        <Text variant="body2" style={{ marginTop: 8, color: '#666' }}>
          {isRecoveringPassword
            ? 'Enter your new password to finish recovering your account.'
            : "Enter the email associated with your account and we'll send reset instructions."}
        </Text>

        <View style={{ marginTop: 16 }}>
          {isRecoveringPassword ? (
            <PasswordInput password={password} setPassword={setPassword} />
          ) : (
            <EmailInput email={email} setEmail={setEmail} />
          )}

          {error && (
            <Text
              variant="body3"
              color="sentimentNegative"
              style={{ marginTop: 12 }}
            >
              {error}
            </Text>
          )}

          {!isRecoveringPassword && sent ? (
            <Text variant="body2" style={{ marginTop: 12 }}>
              Instructions sent — check your inbox.
            </Text>
          ) : isRecoveringPassword && updated ? (
            <Text variant="body2" style={{ marginTop: 12 }}>
              Password updated. You can continue to the app.
            </Text>
          ) : (
            <View style={{ marginTop: 16 }}>
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

          <View style={{ marginTop: 12 }}>
            <Button
              variant="tertiary"
              onPress={() => router.push(updated ? '/' : '/login')}
            >
              {updated ? 'Continue' : 'Back to sign in'}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: UnistylesRuntime.insets.top + theme.spacing.large,
  },
  content: {
    padding: theme.spacing.large,
  },
}));
