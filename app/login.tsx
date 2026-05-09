import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

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
      router.replace(signedInUser.onboardingCompleted ? '/' : '/onboarding/link-phone');
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
          <InputText label="Email" value={email} onChangeText={setEmail} />
          <View style={{ height: 12 }} />
          <InputText label="Password" value={password} onChangeText={setPassword} secureTextEntry />

          {error && (
            <Text variant="body3" color="sentimentNegative" style={{ marginTop: 8 }}>
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
            <Button onPress={() => router.push('/register')} variant="neutral" size="regular">
              Create an account
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
    backgroundColor: theme.colors.backgroundScreen,
    paddingTop: UnistylesRuntime.insets.top + theme.spacing.large,
  },
  content: {
    padding: theme.spacing.large,
  },
}));