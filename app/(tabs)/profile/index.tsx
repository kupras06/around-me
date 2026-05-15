import { decode } from 'base64-arraybuffer';
import { invariant } from 'es-toolkit';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoaderView } from '@/components/ui/loader-view';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth, useLogout, useUser } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

function ProfileCard() {
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useUser();
  const uploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true);
        const image = result.assets[0];
        const fileExtension = image.uri.split('.').pop();
        const fileName = `avatar-${user.id}.${fileExtension}`; // Simple unique name
        invariant(image.base64, 'Image base64 is not available.');
        const { data, error: uploadError } = await supabase.storage
          .from('assets-images') // Assuming 'avatars' bucket exists and is configured for public access
          .upload(`${user.id}/${fileName}`, decode(image.base64), {
            contentType: result.assets[0].mimeType,
            cacheControl: '3600',
            upsert: true,
          });
        logger.info('Uploaded', data, uploadError);
        if (uploadError) {
          logger.error(uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('assets-images')
          .getPublicUrl(`${user.id}/${fileName}`);
        logger.info(publicUrlData);
        if (publicUrlData.publicUrl) {
          await updateProfile({
            avatar_url: publicUrlData.publicUrl,
          });
          Alert.alert('Success', 'Profile picture updated!');
        } else {
          throw new Error('Could not get public URL for avatar.');
        }
      }
    } catch (error: unknown) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      logger.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderView loading={loading} style={styles.profileHeader}>
      <Pressable onPress={uploadAvatar}>
        <Avatar
          source={{
            uri: user?.avatar_url,
          }}
          size="hero"
        />
      </Pressable>
      <View style={styles.userInfo}>
        <Text variant="heading3" numberOfLines={1}>
          {user?.display_name ?? 'Unnamed User'}
        </Text>

        <Text variant="body2" color="contentSecondary" numberOfLines={1}>
          {user?.email}
        </Text>
      </View>
    </LoaderView>
  );
}

type RouteSettingCardProps = {
  title: string;
  onPress: () => void;
  description?: string;
};
function RouteSettingCard({
  title,
  onPress,
  description,
}: RouteSettingCardProps) {
  const { theme } = useUnistyles();
  return (
    <View style={styles.contentSection}>
      <Pressable onPress={onPress} style={styles.routeSettingCard}>
        <View>
          <Text variant="heading3">{title}</Text>
          {description && (
            <Text variant="body3" color="contentSecondary">
              {description}
            </Text>
          )}
        </View>
        <IconSymbol
          name="chevron.right"
          size={24}
          color={theme.colors.contentSecondary}
        />
      </Pressable>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();
  return (
    <AuthGate>
      <ScrollView>
        <View style={styles.container}>
          <Stack.Screen options={{ headerShown: false }} />
          <ProfileCard />
          <RouteSettingCard
            title="Edit Profile"
            onPress={() => {
              router.push('/profile/account');
            }}
          />
          <RouteSettingCard
            title="Security Settings"
            description="Manage password and two-factor authentication"
            onPress={() => {
              router.push('/profile/security');
            }}
          />
          {user?.is_creator ? (
            <RouteSettingCard
              title="Social Accounts"
              description="Link and manage your social media accounts"
              onPress={() => {
                router.push('/profile/social');
              }}
            />
          ) : (
            <RouteSettingCard
              title="I am a creator"
              description="Switch to creator mode"
              onPress={() => {
                router.push({
                  pathname: '/onboarding',
                  params: {
                    returnTo: '/profile',
                  },
                });
              }}
            />
          )}

          <RouteSettingCard
            title="Terms of Service"
            description="Read our terms and conditions"
            onPress={() => {
              Alert.alert('Terms', 'Terms of Service coming soon!');
            }}
          />
          <RouteSettingCard
            title=" Privacy Policy"
            description="Read our privacy policy"
            onPress={() => {
              Alert.alert('Privacy', 'Privacy Policy coming soon!');
            }}
          />

          <Button
            variant="negative"
            onPress={logout}
            iconLeft={
              <IconSymbol
                name="arrow.right.circle"
                size={24}
                color="contentNegative"
              />
            }
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    height: '100%',
    gap: theme.spacing.small,
    padding: theme.spacing.large,
    paddingBottom: theme.spacing.large + 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    alignItems: 'center',
  },
  button: {
    marginBottom: theme.spacing.small,
  },
  segmentedContainer: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    marginBottom: theme.spacing.medium,
  },
  contentSection: {
    gap: theme.spacing.medium,
  },
  routeSettingCard: {
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.backgroundNeutral,
    borderWidth: 1,
    display: 'flex',
    gap: theme.spacing.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: theme.colors.borderNeutralSecondary,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  avatarWrapper: {
    position: 'relative',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
}));
