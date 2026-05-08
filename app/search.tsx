import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/craftrn-ui/components/Text';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { InputSearch } from '@/craftrn-ui/components/InputSearch/InputSearch';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Search' }} />
      <View style={styles.content}>
        <InputSearch onPress={() => { }} editable={false} placeholder="Search places or creators" />
        <Text variant="body2" style={{ marginTop: 16 }}>
          Search is a demo placeholder. Implement search flow when ready.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingTop: UnistylesRuntime.insets.top + theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
  },
  content: {
    padding: theme.spacing.large,
  },
}));
