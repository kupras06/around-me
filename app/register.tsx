import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    try {
      await register({ displayName, email, password });
      // Route guards will move the user into onboarding
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text variant="heading3">Create an account</Text>
        <Text variant="body2" style={{ marginTop: 8, color: '#666' }}>
          Join AroundMe to save places and follow creators.
        </Text>

        <View style={{ marginTop: 16 }}>
          <InputText
            autoFocus
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <View style={{ height: 12 }} />
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
            <Button onPress={handleRegister} size="large">
              {loading ? 'Creating account...' : 'Create account'}
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
