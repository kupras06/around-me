import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth, useCurrentUser } from '@/hooks/use-auth';

function ActualSocialAccounts() {
  const { signInWithProvider, loading: authLoading } = useAuth();
  const { user, linkAccounts, loading: userLoading } = useCurrentUser();
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = authLoading || userLoading || localLoading;

  const handleLink = async (provider: 'x' | 'instagram' | 'facebook') => {
    try {
      setLocalLoading(true);
      await signInWithProvider(provider);
      Alert.alert('Success', `${provider} linked successfully!`);
    } catch (error) {
      if ((error as Error).message !== 'OAuth flow was cancelled') {
        Alert.alert('Link Error', (error as Error).message);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleUnlink = async (provider: 'x' | 'instagram' | 'facebook') => {
    Alert.alert(
      'Unlink Account',
      `Are you sure you want to unlink your ${provider === 'x' ? 'X (Twitter)' : provider} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setLocalLoading(true);
            try {
              await linkAccounts({ [provider]: false });
              Alert.alert('Success', 'Account unlinked successfully!');
            } catch (error) {
              Alert.alert('Error', (error as Error).message);
            } finally {
              setLocalLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!user?.is_creator) {
    return (
      <View style={styles.container}>
        <SharedHeader title="Social Accounts" />
        <View style={styles.emptyState}>
          <Text variant="heading3" style={styles.centerText}>
            Creators Only
          </Text>
          <Text
            variant="body2"
            color="contentSecondary"
            style={styles.emptyStateSubtext}
          >
            Social account linking is currently only available for verified
            creators and trusted locals.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader title="Social Accounts" />

      <View style={styles.content}>
        <View style={styles.intro}>
          <Text variant="body1" color="contentSecondary">
            Connect your social profiles to verify your creator status and sync
            your recommendations.
          </Text>
        </View>

        <View style={styles.accountList}>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text variant="body1" style={styles.accountName}>
                X (Twitter)
              </Text>
              <Text
                variant="body3"
                color={
                  user.twitter_linked ? 'contentAccent' : 'contentTertiary'
                }
              >
                {user.twitter_linked ? 'Connected' : 'Not linked'}
              </Text>
            </View>
            <Button
              variant={user.twitter_linked ? 'neutral-secondary' : 'primary'}
              size="small"
              onPress={() =>
                user.twitter_linked ? handleUnlink('x') : handleLink('x')
              }
              loading={isLoading}
            >
              {user.twitter_linked ? 'Unlink' : 'Link'}
            </Button>
          </View>

          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text variant="body1" style={styles.accountName}>
                Instagram
              </Text>
              <Text
                variant="body3"
                color={
                  user.instagram_linked ? 'contentAccent' : 'contentTertiary'
                }
              >
                {user.instagram_linked ? 'Connected' : 'Not linked'}
              </Text>
            </View>
            <Button
              variant={user.instagram_linked ? 'neutral-secondary' : 'primary'}
              size="small"
              onPress={() =>
                user.instagram_linked
                  ? handleUnlink('instagram')
                  : handleLink('instagram')
              }
              loading={isLoading}
            >
              {user.instagram_linked ? 'Unlink' : 'Link'}
            </Button>
          </View>

          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text variant="body1" style={styles.accountName}>
                Facebook
              </Text>
              <Text
                variant="body3"
                color={
                  user.facebook_linked ? 'contentAccent' : 'contentTertiary'
                }
              >
                {user.facebook_linked ? 'Connected' : 'Not linked'}
              </Text>
            </View>
            <Button
              variant={user.facebook_linked ? 'neutral-secondary' : 'primary'}
              size="small"
              onPress={() =>
                user.facebook_linked
                  ? handleUnlink('facebook')
                  : handleLink('facebook')
              }
              loading={isLoading}
            >
              {user.facebook_linked ? 'Unlink' : 'Link'}
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            variant="body3"
            color="contentTertiary"
            style={styles.centerText}
          >
            Linking your accounts allows AroundMe to verify your following and
            auto-approve your pins.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function SocialAccountsScreen() {
  return (
    <AuthGate>
      <ActualSocialAccounts />
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
    paddingTop: runtime.insets.top,
  },
  content: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  intro: {
    marginBottom: theme.spacing.small,
  },
  accountList: {
    gap: theme.spacing.medium,
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderNeutralSecondary,
  },
  accountInfo: {
    gap: theme.spacing.xsmall,
  },
  accountName: {
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxlarge,
  },
  emptyStateSubtext: {
    textAlign: 'center',
    marginTop: theme.spacing.small,
  },
  centerText: {
    textAlign: 'center',
  },
  footer: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
}));
