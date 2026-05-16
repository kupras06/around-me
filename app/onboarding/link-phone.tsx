import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';

export default function LinkPhone() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { linkPhoneNumber } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLink = async () => {
    setError(null);
    setLoading(true);
    try {
      await linkPhoneNumber(phone);
      router.push({
        pathname: '/onboarding/link-accounts',
        params: { returnTo },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save phone number.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text variant="heading3">Link your phone</Text>
        <Text variant="body2" style={styles.subtitle}>
          Linking a phone number helps with account recovery and verification.
        </Text>

        <View style={styles.form}>
          <InputText
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {error && (
            <Text variant="body3" color="sentimentNegative" style={styles.error}>
              {error}
            </Text>
          )}

          <View style={styles.actions}>
            <Button onPress={handleLink} size="large" loading={loading}>
              Link phone
            </Button>
            <Button
              variant="tertiary"
              onPress={() =>
                router.push({
                  pathname: '/onboarding/link-accounts',
                  params: { returnTo },
                })
              }
              size="large"
            >
              Skip
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
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.large,
  },
  subtitle: {
    marginTop: theme.spacing.small,
    color: theme.colors.contentSecondary,
  },
  form: {
    marginTop: theme.spacing.xxlarge,
    gap: theme.spacing.medium,
  },
  error: {
    marginTop: theme.spacing.small,
  },
  actions: {
    marginTop: theme.spacing.large,
    gap: theme.spacing.small,
  },
}));
