import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/craftrn-ui/components/Text';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { useAuth } from '@/hooks/useAuth';

export default function LinkPhone() {
  const router = useRouter();
  const { linkPhoneNumber } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLink = async () => {
    setError(null);
    setLoading(true);
    try {
      await linkPhoneNumber(phone);
      router.replace('/onboarding/link-accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text variant="heading3">Link your phone</Text>
        <Text variant="body2" style={{ marginTop: 8, color: '#666' }}>
          Linking a phone number helps with account recovery and verification.
        </Text>

        <View style={{ marginTop: 16 }}>
          <InputText label="Phone number" value={phone} onChangeText={setPhone} />

          {error && (
            <Text variant="body3" color="sentimentNegative" style={{ marginTop: 8 }}>
              {error}
            </Text>
          )}

          <View style={{ marginTop: 16 }}>
            <Button onPress={handleLink} size="large">
              {loading ? 'Linking...' : 'Link phone'}
            </Button>
          </View>

          <View style={{ marginTop: 12 }}>
            <Button variant="tertiary" onPress={() => router.replace('/onboarding/link-accounts')}>
              Skip
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
