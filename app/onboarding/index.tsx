import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { PressableScale } from '@/craftrn-ui/components/PressableScale/PressableScale';
import { Text } from '@/craftrn-ui/components/Text';
import { useProfile } from '@/hooks/use-auth';

export default function OnboardingScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const { completeOnboarding, setUserType } = useProfile();

  const [isCreator, setIsCreator] = useState<boolean | null>(null);

  const handleChooseCreator = async () => {
    setIsCreator(true);
    try {
      await setUserType('creator');
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  };

  const handleChooseUser = async () => {
    setIsCreator(false);
    try {
      await setUserType('user');
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding();
      router.replace((returnTo as Href) || '/');
    } catch (error) {
      console.error('Onboarding completion error:', error);
    }
  };

  if (isCreator === null) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.hero}>
              <Text variant="heading1">Welcome to AroundMe</Text>

              <Text variant="body1" style={styles.description}>
                A curated map of cafés, restaurants, stores, and experiences
                from creators you trust.
              </Text>
            </View>

            <View style={styles.actions}>
              <PressableScale
                style={styles.onboardingCard}
                onPress={handleChooseCreator}
              >
                <Text variant="heading3" style={styles.cardTitle}>
                  Create recommendations
                </Text>

                <Text variant="body2" style={styles.cardDescription}>
                  Share your favorite places and build a trusted local profile.
                </Text>
              </PressableScale>

              <PressableScale
                style={styles.onboardingCard}
                onPress={handleChooseUser}
              >
                <Text variant="heading3" style={styles.cardTitle}>
                  Explore curated places
                </Text>

                <Text variant="body2" style={styles.cardDescription}>
                  Discover cafés, restaurants, stores, and experiences
                  recommended by creators.
                </Text>
              </PressableScale>
            </View>
          </View>
        </View>
      </>
    );
  }

  if (isCreator) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.hero}>
              <Text variant="heading1">Build your creator profile</Text>

              <Text variant="body1" style={styles.description}>
                Connect your accounts and start sharing curated recommendations
                with your audience.
              </Text>
            </View>

            <View style={styles.footerActions}>
              <Button
                variant="primary"
                size="large"
                onPress={() =>
                  router.push({
                    pathname: '/onboarding/link-accounts',
                    params: { returnTo },
                  })
                }
                title="Continue"
              />

              <Button variant="tertiary" size="large" onPress={handleFinish} title="Skip for now" />
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text variant="heading1">Start exploring</Text>

            <Text variant="body1" style={styles.description}>
              Save places, follow creators, and discover the best of Bengaluru
              through curated recommendations.
            </Text>
          </View>

          <View style={styles.footerActions}>
            <Button
              variant="primary"
              size="large"
              onPress={() =>
                router.push({
                  pathname: '/onboarding/link-phone',
                  params: { returnTo },
                })
              }
              title="Get started"
            />
          </View>
        </View>
      </View>
    </>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.xlarge,
  },
  hero: {
    marginTop: theme.spacing.xxlarge,
    gap: theme.spacing.medium,
  },
  description: {
    maxWidth: 320,
    lineHeight: 26,
    color: theme.colors.contentSecondary,
  },
  actions: {
    gap: theme.spacing.medium,
  },
  onboardingCard: {
    gap: theme.spacing.small,
    padding: theme.spacing.large,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.backgroundElevated,
  },
  cardTitle: {
    color: theme.colors.contentPrimary,
  },
  cardDescription: {
    lineHeight: 22,
    color: theme.colors.contentSecondary,
  },
  footerActions: {
    gap: theme.spacing.small,
  },
}));
