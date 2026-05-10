import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useUser } from '@/hooks/useAuth';

function ActualSocialAccounts() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleLinkTwitter = async () => {
    Alert.alert('Twitter', 'Twitter linking coming soon!');
  };

  const handleLinkInstagram = async () => {
    Alert.alert('Instagram', 'Instagram linking coming soon!');
  };

  const handleLinkFacebook = async () => {
    Alert.alert('Facebook', 'Facebook linking coming soon!');
  };

  const handleUnlinkTwitter = async () => {
    setLoading(true);
    try {
      // TODO: Implement Twitter unlinking
      Alert.alert('Success', 'Twitter unlinked successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  const handleUnlinkInstagram = async () => {
    setLoading(true);
    try {
      // TODO: Implement Instagram unlinking
      Alert.alert('Success', 'Instagram unlinked successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  const handleUnlinkFacebook = async () => {
    setLoading(true);
    try {
      // TODO: Implement Facebook unlinking
      Alert.alert('Success', 'Facebook unlinked successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader />

      <View style={styles.section}>
        <Text variant="heading3">Social Accounts</Text>

        <View style={styles.accountItem}>
          <View style={styles.accountInfo}>
            <Text variant="body2">Twitter</Text>
            <Text variant="body3" color="contentSecondary">
              {user.twitter_linked ? '@username' : 'Not linked'}
            </Text>
          </View>
          <View style={styles.accountActions}>
            {user.twitter_linked ? (
              <Button
                variant="tertiary"
                onPress={handleUnlinkTwitter}
                disabled={loading}
              >
                Unlink
              </Button>
            ) : (
              <Button
                variant="primary"
                onPress={handleLinkTwitter}
                disabled={loading}
              >
                Link Twitter
              </Button>
            )}
          </View>
        </View>

        <View style={styles.accountItem}>
          <View style={styles.accountInfo}>
            <Text variant="body2">Instagram</Text>
            <Text variant="body3" color="contentSecondary">
              {user.instagram_linked ? '@username' : 'Not linked'}
            </Text>
          </View>
          <View style={styles.accountActions}>
            {user.instagram_linked ? (
              <Button
                variant="tertiary"
                onPress={handleUnlinkInstagram}
                disabled={loading}
              >
                Unlink
              </Button>
            ) : (
              <Button
                variant="primary"
                onPress={handleLinkInstagram}
                disabled={loading}
              >
                Link Instagram
              </Button>
            )}
          </View>
        </View>

        <View style={styles.accountItem}>
          <View style={styles.accountInfo}>
            <Text variant="body2">Facebook</Text>
            <Text variant="body3" color="contentSecondary">
              {user.facebook_linked ? '@username' : 'Not linked'}
            </Text>
          </View>
          <View style={styles.accountActions}>
            {user.facebook_linked ? (
              <Button
                variant="tertiary"
                onPress={handleUnlinkFacebook}
                disabled={loading}
              >
                Unlink
              </Button>
            ) : (
              <Button
                variant="primary"
                onPress={handleLinkFacebook}
                disabled={loading}
              >
                Link Facebook
              </Button>
            )}
          </View>
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.large,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
    paddingBottom: theme.spacing.large + 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundScreen,
  },
  section: {
    gap: theme.spacing.medium,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderNeutralSecondary,
  },
  accountInfo: {
    flex: 1,
    gap: theme.spacing.xsmall,
  },
  accountActions: {
    gap: theme.spacing.small,
  },
}));
