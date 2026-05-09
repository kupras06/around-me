import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function CreatorsScreen() {
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
        Creators — Browse & follow creators
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