import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { getSafeRedirectHref, getSafeRedirectPath } from '@/lib/auth-redirect';
import { SocialAuthButtons } from '@/views/Authentication/SocialAuthButtons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const safeRedirectTo = getSafeRedirectPath(redirectTo);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const signedInUser = await login(email, password);
      if (signedInUser.onboarding_completed) {
        router.replace(getSafeRedirectHref(safeRedirectTo));
      } else {
        router.replace({
          pathname: '/onboarding/link-phone',
          params: { returnTo: safeRedirectTo },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text variant="heading3">Welcome back</Text>
        <Text variant="body2" style={styles.subtitle}>
          Sign in to access Saved, Profile and Creators.
        </Text>

        <View style={styles.form}>
          <EmailInput email={email} setEmail={setEmail} />
          <View style={styles.spacerSmall} />
          <PasswordInput password={password} setPassword={setPassword} />

          {error && (
            <Text variant="body3" style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.spacerMedium} />
          <Button onPress={handleLogin} size="large">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <View style={styles.spacerSmall} />
          <Button
            onPress={() => router.push('/auth/reset-password')}
            variant="tertiary"
            size="regular"
          >
            Forgot password
          </Button>

          <View style={styles.spacerLarge} />
          <Button
            onPress={() => router.push('/auth/register')}
            variant="neutral"
            size="regular"
          >
            Create an account
          </Button>

          <SocialAuthButtons />
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
    marginTop: theme.spacing.small,
    color: theme.colors.sentimentNegative,
  },
  spacerSmall: { height: theme.spacing.small },
  spacerMedium: { height: theme.spacing.medium },
  spacerLarge: { height: theme.spacing.large },
}));
