import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/craftrn-ui/components/Text';
import { StyleSheet } from 'react-native-unistyles';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Saved' }} />
      <Text variant="heading3">Saved — Collections & map</Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
    paddingBottom: theme.spacing.large + 40,
  },
}));
