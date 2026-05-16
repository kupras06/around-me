import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth, useCurrentUser, useProfile } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';

export default function LinkAccounts() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { signInWithProvider } = useAuth();
  const { completeOnboarding } = useProfile();
  const { linkAccounts, user } = useCurrentUser();
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
        <Text variant="body2" style={styles.subtitle}>
          Connect your social accounts to showcase your content and grow your
          audience.
        </Text>

        <View style={styles.accountsContainer}>
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
              title={twitter ? 'Disconnect' : 'Connect Twitter'}
              size="large"
            />
          </View>

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
              title={instagram ? 'Disconnect' : 'Connect Instagram'}
              size="large"
            />
          </View>
        </View>

        <View style={styles.footerActions}>
          <Button onPress={handleFinish} size="large" loading={loading} title="Finish" />
          <Button variant="tertiary" onPress={handleFinish} size="large" title="Skip & finish" />
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
  accountsContainer: {
    marginTop: theme.spacing.xxlarge,
    gap: theme.spacing.large,
  },
  accountSection: {
    padding: theme.spacing.medium,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
    borderRadius: theme.borderRadius.medium,
  },
  accountHeader: {
    marginBottom: theme.spacing.medium,
  },
  accountTitle: {
    fontWeight: '600',
  },
  accountDescription: {
    color: theme.colors.contentSecondary,
    marginTop: theme.spacing.xsmall,
  },
  footerActions: {
    marginTop: theme.spacing.xxlarge,
    gap: theme.spacing.small,
  },
}));
