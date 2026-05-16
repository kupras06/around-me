import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { SocialAuthButtons } from '@/views/Authentication/SocialAuthButtons';

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
        <Text variant="body2" style={styles.subtitle}>
          Join AroundMe to save places and follow creators.
        </Text>

        <View style={styles.form}>
          <InputText
            autoFocus
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <View style={styles.spacerSmall} />
          <EmailInput email={email} setEmail={setEmail} />
          <View style={styles.spacerSmall} />
          <PasswordInput password={password} setPassword={setPassword} />

          {error && (
            <Text variant="body3" style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.spacerMedium} />
          <Button onPress={handleRegister} size="large">
            {loading ? 'Creating account...' : 'Create account'}
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
}));
