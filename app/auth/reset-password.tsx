import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { getConfirmedPasswordError } from '@/lib/password-validation';
import { PasswordRequirements } from '@/views/Authentication/PasswordRequirements';

const RESET_COPY = {
  recovery: {
    title: 'Set a new password',
    subtitle: 'Enter your new password to finish recovering your account.',
  },
  request: {
    title: 'Reset password',
    subtitle:
      "Enter the email associated with your account and we'll send reset instructions.",
  },
};

type RecoveryFieldsProps = {
  password: string;
  confirmPassword: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
};

function RecoveryFields({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
}: RecoveryFieldsProps) {
  const confirmError =
    confirmPassword && password !== confirmPassword
      ? 'Passwords do not match.'
      : undefined;

  return (
    <>
      <PasswordInput
        label="New password"
        password={password}
        setPassword={setPassword}
      />
      <View style={styles.spacerSmall} />
      <PasswordInput
        label="Confirm new password"
        password={confirmPassword}
        setPassword={setConfirmPassword}
        error={confirmError}
      />
      <View style={styles.spacerSmall} />
      <PasswordRequirements password={password} />
    </>
  );
}

function getActionLabel({
  loading,
  recoveringPassword,
}: {
  loading: boolean;
  recoveringPassword: boolean;
}) {
  if (loading) {
    return recoveringPassword ? 'Updating...' : 'Sending...';
  }

  return recoveringPassword ? 'Update password' : 'Send reset link';
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { resetPassword, updatePassword, loading, isRecoveringPassword } =
    useAuth();
  const recoveringPassword =
    mode === 'recovery' || Boolean(isRecoveringPassword);
  const copy = recoveringPassword ? RESET_COPY.recovery : RESET_COPY.request;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordError = useMemo(
    () => getConfirmedPasswordError({ password, confirmPassword }),
    [confirmPassword, password]
  );

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

    const blockingError = passwordError;

    if (blockingError) {
      setError(blockingError);
      return;
    }

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
        <Text variant="heading3">{copy.title}</Text>
        <Text variant="body2" style={styles.subtitle}>
          {copy.subtitle}
        </Text>

        <View style={styles.form}>
          {recoveringPassword ? (
            <RecoveryFields
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
            />
          ) : (
            <EmailInput email={email} setEmail={setEmail} />
          )}

          {error && (
            <Text variant="body3" style={styles.error}>
              {error}
            </Text>
          )}

          {!recoveringPassword && sent ? (
            <Text variant="body2" style={styles.message}>
              Instructions sent — check your inbox.
            </Text>
          ) : recoveringPassword && updated ? (
            <Text variant="body2" style={styles.message}>
              Password updated. You can continue to the app.
            </Text>
          ) : (
            <>
              <View style={styles.spacerMedium} />
              <Button
                onPress={
                  recoveringPassword ? handlePasswordUpdate : handleReset
                }
                size="large"
              >
                {getActionLabel({ loading, recoveringPassword })}
              </Button>
            </>
          )}

          <View style={styles.spacerSmall} />
          <Button
            variant="tertiary"
            onPress={() => router.push(updated ? '/' : '/auth/login')}
          >
            {updated ? 'Continue' : 'Back to sign in'}
          </Button>
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
