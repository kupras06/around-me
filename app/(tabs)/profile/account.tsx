import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { EmailInput } from '@/components/inputs/EmailInput';
import { PhoneNumberInput } from '@/components/inputs/PhoneNumberInput';
import { Button } from '@/craftrn-ui/components/Button';
import { InputText } from '@/craftrn-ui/components/InputText';
import { useProfile } from '@/hooks/use-auth';

function ActualProfile() {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { userProfile, updateProfile, linkPhoneNumber } = useProfile();
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      setDisplayName(userProfile?.display_name ?? '');
      setPhoneNumber(userProfile?.phone ?? '');
      setLoading(false);
    };

    getProfile();
  }, [userProfile]);

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

        <InputText
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <EmailInput email={userProfile?.email || ''} disabled />

        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <Button
          variant="secondary"
          onPress={handleLinkPhoneNumber}
          disabled={loading}
        >
          {userProfile?.phone ? 'Update Phone Number' : 'Link Phone Number'}
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
  },
}));
