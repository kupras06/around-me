import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';

export default function CreatorSetup() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { user, updateProfile, completeOnboarding } = useAuth();

  const [bio, setBio] = useState(user?.bio || '');
  const [focus, setFocus] = useState(user?.focus_description || '');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      // In a real app, we'd have a specific updateCreator thunk,
      // but for MVP we use user_metadata
      await updateProfile({
        bio,
        focus_description: focus,
      } as any); // Type cast as we added these to UserMetadata but maybe not to updateProfile payload yet

      await completeOnboarding();
      router.replace((returnTo as Href) || '/');
    } catch (err) {
      logger.error('Creator setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Creator Profile', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="heading3">Complete your profile</Text>
        <Text variant="body2" style={styles.subtitle}>
          Tell your audience what kind of places you recommend.
        </Text>

        <View style={styles.tierInfo}>
          <Text variant="body2" style={styles.tierLabel}>
            Your Tier:
          </Text>
          <Text variant="heading3" style={styles.tierValue}>
            {user?.tier
              ? user.tier.replace('_', ' ').toUpperCase()
              : 'COMMUNITY'}
          </Text>
          <Text variant="body3" style={styles.followerInfo}>
            Based on {user?.follower_count || 0} followers
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text variant="body2" style={styles.label}>
              Bio
            </Text>
            <TextInput
              style={styles.input}
              placeholder="A short bio about yourself"
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body2" style={styles.label}>
              What do you focus on?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bangalore coffee, brunch spots, Indiranagar locals"
              value={focus}
              onChangeText={setFocus}
              multiline
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button onPress={handleFinish} size="large" loading={loading}>
            Finish Setup
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
  },
  content: {
    padding: theme.spacing.large,
  },
  subtitle: {
    marginTop: theme.spacing.small,
    color: theme.colors.contentSecondary,
    marginBottom: theme.spacing.xlarge,
  },
  tierInfo: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreenSecondary,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xlarge,
    alignItems: 'center',
  },
  tierLabel: {
    color: theme.colors.contentSecondary,
    marginBottom: theme.spacing.xsmall,
  },
  tierValue: {
    color: theme.colors.contentPrimary,
    marginBottom: theme.spacing.xsmall,
  },
  followerInfo: {
    color: theme.colors.contentSecondary,
  },
  form: {
    gap: theme.spacing.large,
  },
  inputGroup: {
    gap: theme.spacing.small,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.contentPrimary,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  actions: {
    marginTop: theme.spacing.xxlarge,
  },
}));
