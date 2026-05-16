import { invariant } from 'es-toolkit';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { Button } from '@/craftrn-ui/components/Button';
import { InputText } from '@/craftrn-ui/components/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useUser } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

function ActualSecurity() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user } = useUser();

  const handleUpdatePassword = async () => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      invariant(user.email, 'User email is required');
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
    setLoading(false);
  };

  const handleEnable2FA = () => {
    Alert.alert('2FA', 'Two-factor authentication coming soon!');
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

      <View style={styles.section}>
        <Text variant="heading3">Security</Text>

        <InputText
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <InputText
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <InputText
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          variant="primary"
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          Update Password
        </Button>

        <Button
          variant="secondary"
          onPress={handleEnable2FA}
          disabled={loading}
        >
          Enable 2FA
        </Button>
      </View>
    </View>
  );
}

export default function SecurityScreen() {
  return (
    <AuthGate>
      <ActualSecurity />
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    gap: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    paddingTop: runtime.insets.top + theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
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
}));
