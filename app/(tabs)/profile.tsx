import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/craftrn-ui/components/Text';
import { StyleSheet } from 'react-native-unistyles';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader />

      <Text variant="heading3" style={{ marginTop: 16 }}>
        Profile — Account & creator tools
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
    paddingBottom: theme.spacing.large + 40,
  },
}));
