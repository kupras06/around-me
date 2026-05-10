import { decode } from 'base64-arraybuffer';
import { invariant } from 'es-toolkit';
import * as ImagePicker from 'expo-image-picker'; // New import
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { LoaderView } from '@/components/ui/loader-view';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useUser } from '@/hooks/useAuth';
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
      <Pressable
        onPress={() => uploadAvatar()} // Add onPress
      >
        <Avatar
          source={{
            uri:
              user?.avatar_url ||
              'https://wzalymcnppeczexhptbt.supabase.co/storage/v1/object/sign/assets-images/7ce2bfdf-9e4c-44ff-af8c-8ee6a98cfa6a/avatar-7ce2bfdf-9e4c-44ff-af8c-8ee6a98cfa6a.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mYWRlZWEzOC02ZmQ2LTQ1MGYtOGJjYi04Yjg4ZTQ5MjZjOTQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMtaW1hZ2VzLzdjZTJiZmRmLTllNGMtNDRmZi1hZjhjLThlZTZhOThjZmE2YS9hdmF0YXItN2NlMmJmZGYtOWU0Yy00NGZmLWFmOGMtOGVlNmE5OGNmYTZhLmpwZWciLCJpYXQiOjE3NzgzNDk3ODksImV4cCI6MTc3ODk1NDU4OX0.NBy2GImLs0nCtsfk5YqbeAk9sMSHWQyeEONLZ8hQCKg',
          }}
          size="xlarge"
        />
      </Pressable>
    </LoaderView>
  );
}

type RouteSettingCardProps = {
  title: string;
  onPress: () => void;
  description?: string;
};
function RouteSettingCard({ title, onPress, description }: RouteSettingCardProps) {

  return (
    <View style={styles.contentSection}>
      <Pressable
        onPress={onPress}
        style={styles.routeSettingCard}
      >
        <Text variant="heading3">{title}</Text>
        {description && <Text variant="body3" color="contentSecondary">{description}</Text>}
      </Pressable>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <SharedHeader />
        <ProfileCard />
        <RouteSettingCard
          title="Edit Profile"
          onPress={() => {
            router.push('/profile/account');
          }}
        />
 <RouteSettingCard
          title="Security Settings"
          description='Manage password and two-factor authentication'
          onPress={() => {
            router.push('/profile/security');
          }}
        />
        
        
          <RouteSettingCard
          title="Social Accounts"
          description='Link and manage your social media accounts'
          onPress={() => {
            router.push('/profile/social');
          }}
        />
          
       <RouteSettingCard
          title="Terms of Service"
          description='Read our terms and conditions'
          onPress={() => {
             Alert.alert('Terms', 'Terms of Service coming soon!');
          }}
        />   
      <RouteSettingCard
          title=" Privacy Policy"
          description='Read our privacy policy'
          onPress={() => {
              Alert.alert('Privacy', 'Privacy Policy coming soon!');
          }}
        />   

        <Button
          variant="negative"
          onPress={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}




const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.small,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
    paddingBottom: theme.spacing.large + 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundScreen,
  },
  profileHeader: {
    alignItems: 'center',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
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
    borderColor: theme.colors.borderNeutralSecondary,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
}));
