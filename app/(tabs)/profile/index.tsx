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

function ProfileHero() {
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useUser();
  const { theme } = useUnistyles();

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
        const fileName = `avatar-${user.id}.${fileExtension}`;
        invariant(image.base64, 'Image base64 is not available.');
        const { data, error: uploadError } = await supabase.storage
          .from('assets-images')
          .upload(`${user.id}/${fileName}`, decode(image.base64), {
            contentType: result.assets[0].mimeType,
            cacheControl: '3600',
            upsert: true,
          });
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('assets-images')
          .getPublicUrl(`${user.id}/${fileName}`);
        
        if (publicUrlData.publicUrl) {
          await updateProfile({ avatar_url: publicUrlData.publicUrl });
          Alert.alert('Success', 'Profile picture updated!');
        } else {
          throw new Error('Could not get public URL for avatar.');
        }
      }
    } catch (error: unknown) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.heroContainer}>
      <LoaderView loading={loading}>
        <Pressable onPress={uploadAvatar} style={styles.avatarContainer}>
          <Avatar
            source={{ uri: user?.avatar_url }}
            size="hero"
          />
          <View style={styles.editBadge}>
            <IconSymbol name="pencil" size={14} color={theme.colors.white} />
          </View>
        </Pressable>
      </LoaderView>
      
      <View style={styles.heroText}>
        <Text variant="heading2" style={styles.displayName}>
          {user?.display_name ?? 'User'}
        </Text>
        <Text variant="body2" style={styles.emailText}>
          {user?.email}
        </Text>
      </View>
    </View>
  );
}

type SettingItemProps = {
  title: string;
  onPress: () => void;
  description?: string;
  icon: keyof typeof IconSymbol;
  color?: string;
};

function SettingItem({ title, onPress, description, icon, color }: SettingItemProps) {
  const { theme } = useUnistyles();
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed
      ]}
    >
      <View style={[styles.iconWrapper, color && { backgroundColor: color + '15' }]}>
        <IconSymbol
          name={icon as any}
          size={20}
          color={color || theme.colors.contentSecondary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text variant="body1" style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text variant="body3" style={styles.settingDescription}>
            {description}
          </Text>
        )}
      </View>
      <IconSymbol
        name="chevron.right"
        size={20}
        color={theme.colors.contentTertiary}
      />
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="body4" style={styles.sectionHeader}>
      {title.toUpperCase()}
    </Text>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();
  const { theme } = useUnistyles();

  return (
    <AuthGate>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero />

        <View style={styles.sectionsContainer}>
          <SectionHeader title="Account" />
          <View style={styles.sectionCard}>
            <SettingItem
              title="Edit Profile"
              icon="person"
              onPress={() => router.push('/profile/account')}
            />
            <View style={styles.separator} />
            <SettingItem
              title="Security Settings"
              description="Password & authentication"
              icon="lock"
              onPress={() => router.push('/profile/security')}
            />
            {user?.is_creator && (
              <>
                <View style={styles.separator} />
                <SettingItem
                  title="Social Accounts"
                  description="Instagram & Twitter"
                  icon="link"
                  onPress={() => router.push('/profile/social')}
                />
              </>
            )}
          </View>

          <SectionHeader title="Preferences" />
          <View style={styles.sectionCard}>
            <SettingItem
              title="App Preferences"
              description="Theme & notifications"
              icon="gearshape"
              onPress={() => Alert.alert('Settings', 'App preferences coming soon!')}
            />
          </View>

          {!user?.is_creator && (
            <>
              <SectionHeader title="Creators" />
              <View style={styles.sectionCard}>
                <SettingItem
                  title="Become a Creator"
                  description="Share recommendations"
                  icon="pencil"
                  color={theme.colors.contentAccentSecondary}
                  onPress={() => router.push({ pathname: '/onboarding', params: { returnTo: '/profile' } })}
                />
              </View>
            </>
          )}

          <SectionHeader title="Support & Legal" />
          <View style={styles.sectionCard}>
            <SettingItem
              title="Terms of Service"
              icon="info"
              onPress={() => Alert.alert('Terms', 'Terms of Service coming soon!')}
            />
            <View style={styles.separator} />
            <SettingItem
              title="Privacy Policy"
              icon="eye"
              onPress={() => Alert.alert('Privacy', 'Privacy Policy coming soon!')}
            />
          </View>

          <View style={{ marginTop: theme.spacing.xlarge }}>
            <Button
              variant="negative"
              size="large"
              onPress={logout}
              iconLeft={<IconSymbol name="arrow.right.circle" size={20} color={theme.colors.sentimentNegative} />}
            >
              Sign Out
            </Button>
          </View>
        </View>
      </ScrollView>
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxlarge + 40,
  },
  heroContainer: {
    paddingTop: theme.spacing.xxlarge,
    paddingBottom: theme.spacing.xlarge,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundScreenSecondary,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.borderNeutral,
  },
  avatarContainer: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: theme.colors.contentAccentSecondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.backgroundScreenSecondary,
  },
  heroText: {
    marginTop: theme.spacing.medium,
    alignItems: 'center',
  },
  displayName: {
    color: theme.colors.contentPrimary,
    fontWeight: '700',
  },
  emailText: {
    color: theme.colors.contentSecondary,
    marginTop: theme.spacing.xxsmall,
  },
  sectionsContainer: {
    padding: theme.spacing.large,
  },
  sectionHeader: {
    marginTop: theme.spacing.xlarge,
    marginBottom: theme.spacing.small,
    marginHorizontal: theme.spacing.small,
    color: theme.colors.contentTertiary,
  },
  sectionCard: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.borderRadius.large,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutral,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  settingItemPressed: {
    backgroundColor: theme.colors.backgroundScreenSecondary,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.backgroundScreenSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontWeight: '500',
    color: theme.colors.contentPrimary,
  },
  settingDescription: {
    color: theme.colors.contentSecondary,
  },
  separator: {
    height: 0.5,
    backgroundColor: theme.colors.borderNeutral,
    marginLeft: theme.spacing.xxlarge + theme.spacing.medium, // Align with text
  },
}));
