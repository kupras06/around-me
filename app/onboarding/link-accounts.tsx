import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';

export default function LinkAccounts() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { linkAccounts, completeOnboarding, signInWithProvider } = useAuth();
  const [twitter, setTwitter] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTwitterOAuth = async () => {
    try {
      await signInWithProvider('x');
      setTwitter(true);
    } catch (error) {
      console.error('Twitter OAuth error:', error);
    }
  };

  const handleInstagramOAuth = async () => {
    try {
      await signInWithProvider('instagram');
      setInstagram(true);
    } catch (error) {
      console.error('Instagram OAuth error:', error);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await linkAccounts({ twitter, instagram });
      if (user?.is_creator) {
        router.push({
          pathname: '/onboarding/creator-setup',
          params: { returnTo },
        });
      } else {
        await completeOnboarding();
        router.replace((returnTo as Href) || '/');
      }
    } catch (err) {
      logger.error('Onboarding error:', err);
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
          Connect your social accounts to showcase your content and grow your
          audience.
        </Text>

        <View style={{ marginTop: 16 }}>
          <View style={styles.accountSection}>
            <View style={styles.accountHeader}>
              <Text variant="body1" style={styles.accountTitle}>
                Twitter {twitter && '✓'}
              </Text>
              <Text variant="body2" style={styles.accountDescription}>
                {twitter ? 'Connected' : 'Connect your Twitter account'}
              </Text>
            </View>
            <Button
              variant={twitter ? 'tertiary' : 'primary'}
              onPress={handleTwitterOAuth}
              size="large"
            >
              {twitter ? 'Disconnect' : 'Connect Twitter'}
            </Button>
          </View>

          <View style={{ marginTop: 24 }} />

          <View style={styles.accountSection}>
            <View style={styles.accountHeader}>
              <Text variant="body1" style={styles.accountTitle}>
                Instagram {instagram && '✓'}
              </Text>
              <Text variant="body2" style={styles.accountDescription}>
                {instagram ? 'Connected' : 'Connect your Instagram account'}
              </Text>
            </View>
            <Button
              variant={instagram ? 'tertiary' : 'primary'}
              onPress={handleInstagramOAuth}
              size="large"
            >
              {instagram ? 'Disconnect' : 'Connect Instagram'}
            </Button>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
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
  accountSection: {
    marginBottom: theme.spacing.medium,
  },
  accountHeader: {
    marginBottom: theme.spacing.small,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.xsmall,
  },
  accountDescription: {
    fontSize: 14,
    color: theme.colors.contentSecondary,
  },
}));
