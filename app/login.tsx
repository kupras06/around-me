import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { SocialAuthButtons } from '@/views/Authentication/SocialAuthButtons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const signedInUser = await login(email, password);
      router.replace(
        signedInUser.onboarding_completed ? '/' : '/onboarding/link-phone'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text variant="heading3">Welcome back</Text>
        <Text variant="body2" style={{ marginTop: 8, color: '#666' }}>
          Sign in to access Saved, Profile and Creators.
        </Text>

        <View style={{ marginTop: 16 }}>
          <EmailInput email={email} setEmail={setEmail} />
          <View style={{ height: 12 }} />
          <PasswordInput password={password} setPassword={setPassword} />

          {error && (
            <Text
              variant="body3"
              color="sentimentNegative"
              style={{ marginTop: 8 }}
            >
              {error}
            </Text>
          )}

          <View style={{ marginTop: 16 }}>
            <Button onPress={handleLogin} size="large">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </View>

          <View style={{ marginTop: 12 }}>
            <Button
              onPress={() => router.push('/reset-password')}
              variant="tertiary"
              size="regular"
            >
              Forgot password
            </Button>
          </View>

          <View style={{ height: 16 }} />

          <View>
            <Button
              onPress={() => router.push('/register')}
              variant="neutral"
              size="regular"
            >
              Create an account
            </Button>
          </View>

          <SocialAuthButtons />
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
