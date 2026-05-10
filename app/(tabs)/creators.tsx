import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import SharedHeader from '@/components/SharedHeader/SharedHeader';
import { Text } from '@/craftrn-ui/components/Text';

function ActualCreators() {
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

export default function CreatorsScreen() {
  return (
    <AuthGate>
      <ActualCreators />
    </AuthGate>
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
