import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useCurrentUser, useProfile } from '@/hooks/use-auth';
import { getSafeRedirectHref } from '@/lib/auth-redirect';
import { logger } from '@/lib/logger';

export default function CreatorSetup() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { user } = useCurrentUser();
  const { updateProfile, completeOnboarding } = useProfile();

  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateProfile({
        bio,
      });

      await completeOnboarding();
      router.replace(getSafeRedirectHref(returnTo));
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
          <InputText
            label="Bio"
            placeholder="A short bio about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            style={styles.textArea}
          />
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    marginTop: theme.spacing.xxlarge,
  },
}));
