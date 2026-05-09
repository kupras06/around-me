import AuthGate from '@/components/AuthGate/AuthGate';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { InputText } from '@/craftrn-ui/components/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

function ActualProfile() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? '');
        setDisplayName(user.user_metadata?.displayName ?? '');
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      email,
      data: { displayName: displayName },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data) {
      Alert.alert('Success', 'Profile updated successfully!');
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'around-me://reset-password', // Replace with your actual deep link for password reset
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password reset email sent. Check your inbox!');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader />

      <View style={styles.profileHeader}>
        <Avatar
          source={{
            uri: `https://ui-avatars.com/api/?name=${displayName || email}&background=random&color=fff&size=128`,
          }}
          size="large"
        />
        <Text variant="heading3" style={{ marginTop: 16 }}>
          Profile — Account & creator tools
        </Text>
      </View>

      <InputText
        label="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />
      <InputText
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        variant="primary"
        onPress={updateProfile}
        disabled={loading}
      >
        Update Profile
      </Button>

      <Button
        variant="secondary"
        onPress={resetPassword}
        disabled={loading}
      >
        Reset Password
      </Button>

      <Button
        variant="tertiary"
        onPress={() => supabase.auth.signOut()}
        disabled={loading}
      >
        Sign Out
      </Button>
    </View>
  );
}

export default function ProfileScreen() {
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
  input: {
    marginBottom: theme.spacing.medium,
  },
  button: {
    marginBottom: theme.spacing.small,
  },
}));
