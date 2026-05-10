import { decode } from 'base64-arraybuffer';
import { invariant } from 'es-toolkit';
import * as ImagePicker from 'expo-image-picker'; // New import
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PhoneNumberInput } from '@/components/inputs/PhoneNumberInput';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { InputText } from '@/craftrn-ui/components/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useUser } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

function ActualProfile() {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { user, updateProfile, linkPhoneNumber } = useUser();
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      setDisplayName(user.display_name ?? '');
      setPhoneNumber(user.phone ?? '');
      setLoading(false);
    };

    getProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile({ display_name: displayName });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  const handleLinkPhoneNumber = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await linkPhoneNumber(phoneNumber);
      Alert.alert('Success', 'Phone number linked successfully!');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  const uploadAvatar = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.profileHeader}>
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
          <Text variant="heading3" style={{ marginTop: 16 }}>
            Profile
          </Text>
        </View>

        <InputText
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <EmailInput email={user?.email || ''} disabled />

        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <Button
          variant="secondary"
          onPress={handleLinkPhoneNumber}
          disabled={loading}
        >
          {user.phone_linked ? 'Update Phone Number' : 'Link Phone Number'}
        </Button>
        <Button
          variant="primary"
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          Update Profile
        </Button>
      </View>
    </ScrollView>
  );
}

export default function AccountScreen() {
  return (
    <AuthGate>
      <ActualProfile />
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
  profileHeader: {
    alignItems: 'center',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  button: {
    marginBottom: theme.spacing.small,
  },
}));
