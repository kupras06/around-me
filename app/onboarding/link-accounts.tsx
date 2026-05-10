import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Switch } from '@/craftrn-ui/components/Switch/Switch';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/useAuth';

export default function LinkAccounts() {
  const { linkAccounts, completeOnboarding } = useAuth();
  const [twitter, setTwitter] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    setError(null);
    setLoading(true);
    try {
      await linkAccounts({ twitter, instagram });
      await completeOnboarding();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to finish onboarding.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text variant="heading3">Link social accounts</Text>
        <Text variant="body2" style={{ marginTop: 8, color: '#666' }}>
          Link Twitter and/or Instagram to help creators find you and to share
          picks more easily.
        </Text>

        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Twitter</Text>
            <Switch value={twitter} onValueChange={setTwitter} />
          </View>

          <View style={{ height: 12 }} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Instagram</Text>
            <Switch value={instagram} onValueChange={setInstagram} />
          </View>

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
            <Button onPress={handleFinish} size="large">
              {loading ? 'Saving...' : 'Finish'}
            </Button>
          </View>

          <View style={{ marginTop: 12 }}>
            <Button variant="tertiary" onPress={handleFinish}>
              Skip & finish
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
