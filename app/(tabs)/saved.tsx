import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { Text } from '@/craftrn-ui/components/Text';

function ActualSaved() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text variant="heading3" style={{ marginTop: 16 }}>
        Saved — Collections & map
      </Text>
    </View>
  );
}

export default function SavedScreen() {
  return (
    <AuthGate>
      <ActualSaved />
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    paddingBottom: theme.spacing.large + 40,
  },
}));
